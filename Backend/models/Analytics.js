const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        ref: 'User'
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    // Session tracking
    sessionId: {
        type: String,
        required: true
    },
    // Page view data
    pageViews: {
        type: Number,
        default: 1
    },
    // Visitor data
    isUniqueVisitor: {
        type: Boolean,
        default: true
    },
    // Session duration in seconds
    sessionDuration: {
        type: Number,
        default: 0
    },
    // Bounce tracking
    isBounce: {
        type: Boolean,
        default: true
    },
    // Device information
    deviceType: {
        type: String,
        enum: ['desktop', 'mobile', 'tablet'],
        required: true
    },
    // Browser information
    browser: {
        type: String
    },
    browserVersion: {
        type: String
    },
    // OS information
    os: {
        type: String
    },
    osVersion: {
        type: String
    },
    // Geographic data
    country: {
        type: String,
        required: true
    },
    // Traffic source
    trafficSource: {
        type: String,
        enum: ['direct', 'google', 'facebook', 'linkedin', 'other'],
        required: true
    },
    // Referrer URL if any
    referrerUrl: {
        type: String
    },
    // User agent
    userAgent: {
        type: String
    }
}, {
    timestamps: true
});

// Indexes for better query performance
analyticsSchema.index({ userId: 1, timestamp: -1 });
analyticsSchema.index({ sessionId: 1 });
analyticsSchema.index({ userId: 1, isUniqueVisitor: 1 });
analyticsSchema.index({ userId: 1, browser: 1 });

const Analytics = mongoose.model('Analytics', analyticsSchema);
module.exports = Analytics; 