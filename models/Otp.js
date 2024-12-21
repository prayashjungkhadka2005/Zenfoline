const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    otp: {
        type: String,
        required: true,
    },
    otpExpiry: {
        type: Date,
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

otpSchema.index({ otpExpiry: 1 }, { expireAfterSeconds: 10 });

const Otp = mongoose.model("otp", otpSchema); 

module.exports = Otp;