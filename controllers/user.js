const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Otp = require('../models/Otp');
require('dotenv').config();

const saltRounds = 10;

const handleSignupMethod = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user
        const newUser = await User.create({
            email,
            password: hashedPassword,
        });

        // Generate OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000);
        const otpExpire = new Date();
        otpExpire.setMinutes(otpExpire.getMinutes() + 1);

        await Otp.create({
            otp: otpCode,
            otpExpiry: otpExpire,
            user_id: newUser._id,
        });

        // Send email
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
            to: email,
            subject: 'Welcome to Zenfoline!',
            text: `Your OTP for signup (expires in 1 minute): ${otpCode}`,
        };

        await transporter.sendMail(mailOptions);

        return res.status(201).json({
            user_id: newUser._id,
            email: newUser.email,
            created_at: newUser.createdAt,
        });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'An error occurred while creating the user.' });
    }
};

module.exports = {
    handleSignupMethod,
};
