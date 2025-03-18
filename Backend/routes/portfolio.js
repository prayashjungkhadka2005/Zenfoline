const express = require('express');
const router = express.Router();
const PortfolioData = require('../models/PortfolioData');
const Template = require('../models/Templates');
const User = require('../models/User');

// Get template by userId - THIS MUST COME FIRST
router.get('/template/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        console.log('Fetching template for userId:', userId);
        
        // First try to find a user-specific template
        const template = await Template.findOne({ userId });
        console.log('Found template:', template ? 'Yes' : 'No');
        
        if (!template) {
            // If no user-specific template, try to get the template from user's selected template
            const user = await User.findById(userId).populate('selectedTemplate');
            console.log('Found user:', user ? 'Yes' : 'No');
            console.log('User has selectedTemplate:', user?.selectedTemplate ? 'Yes' : 'No');
            if (user && user.selectedTemplate) {
                return res.json({
                    success: true,
                    data: user.selectedTemplate
                });
            }
            
            console.log('No template found for userId:', userId);
            return res.status(404).json({
                success: false,
                message: 'Template not found'
            });
        }

        console.log('Successfully returning template');
        res.json({
            success: true,
            data: template
        });
    } catch (error) {
        console.error('Error fetching template:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching template',
            error: error.message
        });
    }
});

// Get portfolio data by userId - THIS COMES SECOND
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        console.log('Fetching portfolio data for userId:', userId);
        
        // First try to find the portfolio data
        const portfolioData = await PortfolioData.findOne({ userId });
        console.log('Found portfolio data:', portfolioData ? 'Yes' : 'No');
        
        if (!portfolioData) {
            console.log('No portfolio data found for userId:', userId);
            return res.status(404).json({
                success: false,
                message: 'Portfolio not found'
            });
        }

        console.log('Successfully returning portfolio data');
        res.json({
            success: true,
            data: portfolioData
        });
    } catch (error) {
        console.error('Error fetching portfolio data:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching portfolio data',
            error: error.message
        });
    }
});

module.exports = router; 