const express = require('express');
const multer = require('multer');
const path = require('path');
const PortfolioData = require('../models/PortfolioData');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads/portfolio');
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
        const { userId } = req.params;
        console.log(`[saveBasicInfo] Saving basic info for user: ${userId}`);
        console.log(`[saveBasicInfo] Request body:`, JSON.stringify(req.body, null, 2));

        let portfolio = await PortfolioData.findOne({ userId });
        if (!portfolio) {
            console.log(`[saveBasicInfo] Portfolio not found for user: ${userId}`);
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        portfolio.basics = {
            ...portfolio.basics,
            ...req.body
        };

        if (req.file) {
            console.log(`[saveBasicInfo] Profile image uploaded: ${req.file.filename}`);
            portfolio.basics.profileImage = `/uploads/portfolio/${req.file.filename}`;
        }

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


exports.getBasicInfo = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(`[GET /basic-info] Fetching basic info for user: ${userId}`);

        const portfolio = await PortfolioData.findOne({ userId });
        if (!portfolio) {
            console.log(`[GET /basic-info] Portfolio not found for user: ${userId}`);
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        console.log(`[GET /basic-info] Successfully retrieved basic info for user: ${userId}`);
        res.status(200).json({
            message: 'Basic information retrieved successfully',
            data: portfolio.basics
        });
    } catch (error) {
        console.error('[GET /basic-info] Error retrieving basic information:', error);
        res.status(500).json({ message: 'Error retrieving basic information' });
    }
};

// Save about section information
exports.saveAboutInfo = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(`[saveAboutInfo] Saving about info for user: ${userId}`);
        console.log(`[saveAboutInfo] Request body:`, JSON.stringify(req.body, null, 2));

        let portfolio = await PortfolioData.findOne({ userId });
        if (!portfolio) {
            console.log(`[saveAboutInfo] Portfolio not found for user: ${userId}`);
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        // Update about section
        portfolio.about = {
            ...portfolio.about,
            description: req.body.description,
            vision: req.body.vision,
            mission: req.body.mission,
            highlights: req.body.highlights || [],
            isVisible: true
        };

        await portfolio.save();
        console.log(`[saveAboutInfo] Successfully saved about info for user: ${userId}`);

        res.status(200).json({
            message: 'About information updated successfully',
            data: portfolio.about
        });
    } catch (error) {
        console.error('[saveAboutInfo] Error updating about information:', error);
        res.status(500).json({ message: 'Error updating about information' });
    }
};

// Get about section information
exports.getAboutInfo = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(`[getAboutInfo] Fetching about info for user: ${userId}`);

        const portfolio = await PortfolioData.findOne({ userId });
        if (!portfolio) {
            console.log(`[getAboutInfo] Portfolio not found for user: ${userId}`);
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        console.log(`[getAboutInfo] Successfully retrieved about info for user: ${userId}`);
        res.status(200).json({
            message: 'About information retrieved successfully',
            data: portfolio.about
        });
    } catch (error) {
        console.error('[getAboutInfo] Error retrieving about information:', error);
        res.status(500).json({ message: 'Error retrieving about information' });
    }
};

// Export the upload middleware for use in routes
exports.upload = upload;

