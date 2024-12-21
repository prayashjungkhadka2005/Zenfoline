const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Otp = require('../models/Otp');
require('dotenv').config();

const saltRounds = 10;

const handleSignupMethod = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered.' });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            email,
            password: hashedPassword,
            verified: false,
        });

        await newUser.save();

        await sendOTPVerificationEmail(newUser);

        return res.status(201).json({
            status: 'Pending',
            message: 'Verification OTP email sent.',
            data: {
                userId: newUser._id,
                email,
            },
        });
    } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).json({ message: 'An error occurred during signup.' });
    }
};

const sendOTPVerificationEmail = async (user) => {
    const otpCode = Math.floor(100000 + Math.random() * 900000);
    const otpExpire = new Date();
    otpExpire.setMinutes(otpExpire.getMinutes() + 1);

    const newOtp = new Otp({
        user_id: user._id,
        otp: otpCode,
        otpExpiry: otpExpire,
    });

    await newOtp.save();

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

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Welcome to Zenfoline!',
        text: `Your OTP for signup (expires in 1 minute): ${otpCode}`,
    };

    await transporter.sendMail(mailOptions);
};

const verifyRegisterOtp = async (req, res) => {
    try {
        const { otp, email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const otpRecord = await Otp.findOne({
            user_id: user._id,
            otp,
        });

        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }

        user.verified = true;
        await user.save();

        await Otp.deleteOne({ _id: otpRecord._id });

        return res.status(200).json({ message: 'Registration successful. You can now login.' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found! Please signup to login.' });
        }

        if (!user.verified) {
            return res.status(403).json({ message: 'Please verify your email before logging in.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Email or password incorrect.' });
        }

        return res.status(200).json({
            message: 'Login successful.',
            user_id: user._id,
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'An error occurred during login.' });
    }
};

module.exports = {
    handleSignupMethod,
    userLogin,
    verifyRegisterOtp,
};
