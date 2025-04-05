const express = require('express');
const multer = require('multer');
const path = require('path');
const PortfolioData = require('../models/PortfolioData');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads/');
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Save basic information
exports.saveBasicInfo = async (req, res) => {
    try {
        const { userId } = req.params; // Get user ID from URL params
        console.log(`[saveBasicInfo] Saving basic info for user: ${userId}`);
        console.log(`[saveBasicInfo] Request body:`, JSON.stringify(req.body, null, 2));

        // Find the user's portfolio
        let portfolio = await PortfolioData.findOne({ userId });
        if (!portfolio) {
            console.log(`[saveBasicInfo] Portfolio not found for user: ${userId}`);
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        // Update basic information
        // We're using the entire req.body to allow for future flexibility
        portfolio.basics = {
            ...portfolio.basics, // Preserve any existing basics data
            ...req.body // Override with new data
        };

        // Handle profile image if provided
        if (req.file) {
            console.log(`[saveBasicInfo] Profile image uploaded: ${req.file.filename}`);
            portfolio.basics.profileImage = `/uploads/${req.file.filename}`;
        }

        // Save the updated portfolio
        await portfolio.save();
        console.log(`[saveBasicInfo] Successfully saved basic info for user: ${userId}`);

        res.status(200).json({
            message: 'Basic information updated successfully',
            data: portfolio.basics
        });
    } catch (error) {
        console.error('[saveBasicInfo] Error updating basic information:', error);
        res.status(500).json({ message: 'Error updating basic information' });
    }
};

// Export the upload middleware for use in routes
exports.upload = upload;

