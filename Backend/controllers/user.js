const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Otp = require('../models/Otp');
require('dotenv').config();

const saltRounds = 10;

const generateOTP = () => Math.floor(9999 + Math.random() * 900);

const handleSignupMethod = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (password.length < 4) {
            return res.status(400).json({ message: 'Password must be at least 4 characters long.' });
        }

        const normalizedEmail = email.toLowerCase();

        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered.' });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds).catch(() => {
            throw new Error('Password hashing failed.');
        });

        const newUser = new User({
            email: normalizedEmail,
            password: hashedPassword,
            verified: false,
        });

        await newUser.save();

        sendOTPVerificationEmail(newUser).catch((err) =>
            console.error('Error sending verification email:', err)
        );

        return res.status(201).json({
            status: 'Pending',
            message: 'Verification OTP email is being sent.',
            data: {
                userId: newUser._id,
                email: normalizedEmail,
            },
        });
    } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).json({ message: 'An error occurred. Please try again later.' });
    }
};

const sendOTPVerificationEmail = async (user) => {
    try {
        const otpCode = generateOTP();
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
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Failed to send OTP email.');
    }
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

        return res.status(200).json({ message: 'Registration successful. You can now log in.' });
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

const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        await Otp.deleteMany({ user_id: user._id });
        await sendOTPVerificationEmail(user);

        return res.status(200).json({
            message: 'OTP resent successfully!',
        });
    } catch (error) {
        console.error('Error during OTP resend:', error);
        return res.status(500).json({
            message: 'An error occurred during OTP resend.',
        });
    }
};

const forgotPasswordOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found! Please enter a correct email.' });
        }

        await sendOTPVerificationEmail(user);

        return res.status(200).json({
            status: 'Pending',
            message: 'Password reset OTP email sent.',
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
            message: 'Password updated successfully. You can now log in with your new password.',
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
};
