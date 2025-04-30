const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const Otp = require('../models/Otp');
const Admin = require('../models/Admin');
require('dotenv').config();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const saltRounds = 10;
const generateOTP = () => Math.floor(9999 + Math.random() * 900);

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendOTPVerificationEmail = async (user, otpCode) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Welcome to Zenfoline!',
        text: `Your OTP for signup (expires in 1 minute): ${otpCode}`,
    };
    await transporter.sendMail(mailOptions);
};



// const getTemplate =  async (req, res) => {
//     try {
//         const templates = await Template.find({});
//         res.status(200).json(templates);
//     } catch (error) {
//         console.error('Error fetching templates:', error);
//         res.status(500).json({ message: 'Error fetching templates' });
//     }
// };



const addAdmin = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log(req.body);

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const normalizedEmail = email.toLowerCase();
        const normalizedUsername = username.toLowerCase();

        const existingAdmin = await Admin.findOne({
            $or: [{ email: normalizedEmail }, { username: normalizedUsername }]
        }).lean();

        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin with this email or username already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newAdmin = await Admin.create({
            username: normalizedUsername,
            email: normalizedEmail,
            password: hashedPassword,
            role: "Admin",
        });

        return res.status(201).json({
            message: 'Admin creation successful.',
            data: {
                id: newAdmin._id,
                username: newAdmin.username,
                email: newAdmin.email,
                role: newAdmin.role,
            },
        });
    } catch (error) {
        console.error('Error creating admin:', error);
        return res.status(500).json({ message: 'An error occurred while creating the admin.' });
    }
};


const adminLogin = async (req, res) => { 
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const admin = await Admin.findOne({ username }).lean();
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found! Please signup to login.' });
        }

        const passwordMatch = await bcrypt.compare(password, admin.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Username or password incorrect.' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: admin._id,
                role: 'admin'
            }, 
            JWT_SECRET, 
            { expiresIn: '24h' }
        );

        return res.status(200).json({ 
            message: 'Admin login successful.', 
            admin_id: admin._id,
            username: admin.username,
            token
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'An error occurred during login.' });
    }
};



// const addTemplate = async (req, res) => {
//     try {
//         const { name, description, image, category, adminId } = req.body;

//         if (!name || !image || !category || !adminId) {
//             return res.status(400).json({ message: 'All fields are required: name, image, category, and adminId.' });
//         }

//         const admin = await Admin.findById(adminId).lean();
// if (!admin || admin.role !== 'Admin') {
//     return res.status(403).json({ message: 'Only an admin can add templates.' });
// }


//         const newTemplate = await Template.create({
//             name,
//             description: description || '', 
//             image,
//             category,
//             addedBy: adminId,
//         });

//         return res.status(201).json({
//             message: 'Template added successfully.',
//             data: {
//                 id: newTemplate._id,
//                 name: newTemplate.name,
//                 description: newTemplate.description,
//                 image: newTemplate.image,
//                 category: newTemplate.category,
//                 addedBy: adminId,
//                 createdAt: newTemplate.createdAt,
//             },
//         });
//     } catch (error) {
//         console.error('Error adding template:', error);
//         return res.status(500).json({ message: 'An error occurred while adding the template.' });
//     }
// };







const handleSignupMethod = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (password.length < 4) {
            return res.status(400).json({ message: 'Password must be at least 4 characters long.' });
        }

        const normalizedEmail = email.toLowerCase();

        const existingUser = await User.findOne({ email: normalizedEmail }).lean();
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered.' });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = await User.create({
            email: normalizedEmail,
            password: hashedPassword,
            verified: false,
        });

        const otpCode = generateOTP();
        const otpExpire = new Date(Date.now() + 60 * 1000);

        await Otp.create({
            user_id: newUser._id,
            otp: otpCode,
            otpExpiry: otpExpire,
        });

        sendOTPVerificationEmail(newUser, otpCode);

        return res.status(201).json({
            status: 'Pending',
            message: 'Verification OTP email is being sent.',
            data: { userId: newUser._id, email: normalizedEmail },
        });
    } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).json({ message: 'An error occurred. Please try again later.' });
    }
};

const verifyRegisterOtp = async (req, res) => {
    try {
        const { otp, email } = req.body;

        const user = await User.findOne({ email }).lean();
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const otpRecord = await Otp.findOne({ user_id: user._id, otp }).lean();
        if (!otpRecord || new Date(otpRecord.otpExpiry) < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }

        await User.updateOne({ _id: user._id }, { verified: true });
        await Otp.deleteOne({ _id: otpRecord._id });

        return res.status(200).json({ message: 'Registration successful. You can now log in.' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).lean();
        if (!user) {
            return res.status(404).json({ message: 'User not found! Please signup to login.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Email or password incorrect.' });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ message: 'Login successful.', user_id: user._id, token });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'An error occurred during login.' });
    }
};

const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email }).lean();
        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        const otpCode = generateOTP();
        const otpExpire = new Date(Date.now() + 60 * 1000);

        await Otp.updateOne(
            { user_id: user._id },
            { otp: otpCode, otpExpiry: otpExpire },
            { upsert: true }
        );

        sendOTPVerificationEmail(user, otpCode);

        return res.status(200).json({ message: 'OTP resent successfully!' });
    } catch (error) {
        console.error('Error during OTP resend:', error);
        return res.status(500).json({ message: 'An error occurred during OTP resend.' });
    }
};

const forgotPasswordOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email }).lean();
        if (!user) {
            return res.status(404).json({ message: 'User not found! Please enter a correct email.' });
        }

        const otpCode = generateOTP();
        const otpExpire = new Date(Date.now() + 60 * 1000);

        await Otp.updateOne(
            { user_id: user._id },
            { otp: otpCode, otpExpiry: otpExpire },
            { upsert: true }
        );

        sendOTPVerificationEmail(user, otpCode).catch((err) =>
            console.error('Error sending OTP email:', err)
        );

        return res.status(200).json({
            status: 'Pending',
            message: 'Password reset OTP email is being sent.',
            data: { email },
        });
    } catch (error) {
        console.error('Error in forgot password:', error);
        return res.status(500).json({ message: 'An error occurred during password reset OTP generation.' });
    }
};

const verifyForgotPasswordOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        const otpRecord = await Otp.findOne({
            user_id: user._id,
            otp,
        });

        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }

        await Otp.deleteOne({ _id: otpRecord._id });

        return res.status(200).json({
            message: 'OTP verified. You can now update your password.',
        });
    } catch (error) {
        console.error('Error verifying OTP for forgot password:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const updateForgotPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({
                message: 'Enter a different password.',
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            message: 'Password updated successfully.',
        });
    } catch (error) {
        console.error('Error updating password:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    handleSignupMethod,
    userLogin,
    verifyRegisterOtp,
    forgotPasswordOtp,
    verifyForgotPasswordOtp,
    updateForgotPassword,
    resendOTP,
    addAdmin,
    adminLogin,
};
