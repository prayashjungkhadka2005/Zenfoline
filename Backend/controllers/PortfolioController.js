const PortfolioData = require('../models/PortfolioData');
const fs = require('fs');
const path = require('path');

const portfolioController = {
    // Initialize portfolio for a user
    initializePortfolio: async (req, res) => {
        try {
            const { userId, portfolioType } = req.body;

            // Check if portfolio already exists
            let portfolio = await PortfolioData.findOne({ userId });
            if (portfolio) {
                return res.status(400).json({ message: 'Portfolio already exists for this user' });
            }

            // Create new portfolio
            portfolio = await PortfolioData.create({
                userId,
                portfolioType,
                basics: { isVisible: true },
                about: { isVisible: true }
            });

            // Update user reference
            await User.findByIdAndUpdate(userId, { portfolioData: portfolio._id });

            res.status(201).json({
                message: 'Portfolio initialized successfully',
                data: portfolio
            });
        } catch (error) {
            console.error('Error initializing portfolio:', error);
            res.status(500).json({ message: 'Error initializing portfolio' });
        }
    },

    // Get portfolio data with template configuration
    getPortfolioData: async (req, res) => {
        try {
            const { userId } = req.params;
            
            const user = await User.findById(userId)
                .populate('selectedTemplate')
                .populate('portfolioData')
                .lean();

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (!user.portfolioData) {
                return res.status(404).json({ message: 'Portfolio not found' });
            }

            // Combine portfolio data with template configuration
            const response = {
                portfolio: user.portfolioData,
                template: user.selectedTemplate ? {
                    id: user.selectedTemplate._id,
                    name: user.selectedTemplate.name,
                    sectionConfiguration: user.selectedTemplate.sectionConfiguration
                } : null
            };

            res.status(200).json({ data: response });
        } catch (error) {
            console.error('Error fetching portfolio:', error);
            res.status(500).json({ message: 'Error fetching portfolio data' });
        }
    },

    // Update portfolio type
    updatePortfolioType: async (req, res) => {
        try {
            const { userId } = req.params;
            const { portfolioType } = req.body;

            const portfolio = await PortfolioData.findOneAndUpdate(
                { userId },
                { portfolioType },
                { new: true }
            );

            if (!portfolio) {
                return res.status(404).json({ message: 'Portfolio not found' });
            }

            res.status(200).json({
                message: 'Portfolio type updated successfully',
                data: portfolio
            });
        } catch (error) {
            console.error('Error updating portfolio type:', error);
            res.status(500).json({ message: 'Error updating portfolio type' });
        }
    },

    // Update section order
    updateSectionOrder: async (req, res) => {
        try {
            const { userId } = req.params;
            const { sections } = req.body; // Array of section names in order

            const user = await User.findById(userId).populate('selectedTemplate');
            if (!user || !user.selectedTemplate) {
                return res.status(404).json({ message: 'User or template not found' });
            }

            // Update order in template configuration
            const updatedConfig = { ...user.selectedTemplate.sectionConfiguration };
            sections.forEach((section, index) => {
                if (updatedConfig[section]) {
                    updatedConfig[section].order = index + 1;
                }
            });

            await Templates.findByIdAndUpdate(
                user.selectedTemplate._id,
                { sectionConfiguration: updatedConfig }
            );

            res.status(200).json({
                message: 'Section order updated successfully',
                data: updatedConfig
            });
        } catch (error) {
            console.error('Error updating section order:', error);
            res.status(500).json({ message: 'Error updating section order' });
        }
    },

    // Delete portfolio image
    deletePortfolioImage: async (req, res) => {
        try {
            const { userId, section, itemId, imageIndex } = req.params;

            const portfolio = await PortfolioData.findOne({ userId });
            if (!portfolio) {
                return res.status(404).json({ message: 'Portfolio not found' });
            }

            let imagePath;
            if (section === 'basics') {
                // Handle profile/cover image deletion
                imagePath = portfolio.basics[itemId]; // itemId would be 'profileImage' or 'coverImage'
                portfolio.basics[itemId] = null;
            } else {
                // Handle section item image deletion
                const item = portfolio[section].id(itemId);
                if (!item || !item.images || !item.images[imageIndex]) {
                    return res.status(404).json({ message: 'Image not found' });
                }
                imagePath = item.images[imageIndex];
                item.images.splice(imageIndex, 1);
            }

            // Delete file from filesystem
            if (imagePath) {
                const fullPath = path.join(__dirname, '..', imagePath);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            }

            await portfolio.save();

            res.status(200).json({
                message: 'Image deleted successfully',
                data: portfolio
            });
        } catch (error) {
            console.error('Error deleting image:', error);
            res.status(500).json({ message: 'Error deleting image' });
        }
    }
};

module.exports = portfolioController; 