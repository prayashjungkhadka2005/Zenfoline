const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const Otp = require('../models/Otp');
const Admin = require('../models/Admin');
require('dotenv').config();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Theme = require('../models/ThemeSchema');
const Component = require('../models/Components');
const User = require('../models/User');
const Templates = require('../models/Templates');
const PortfolioData = require('../models/PortfolioData');

const updateTheme = async (req, res) => {
    const { userId, templateId, colorMode, presetTheme, fontStyle, navigationBar, footer } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        // Update object based on provided fields
        const update = {};
        if (templateId !== undefined) update.activeTemplateId = templateId;
        if (colorMode !== undefined) update.colorMode = colorMode;
        if (presetTheme !== undefined) update.presetTheme = presetTheme;
        if (fontStyle !== undefined) update.fontStyle = fontStyle;
        if (navigationBar !== undefined) update.navigationBar = navigationBar;
        if (footer !== undefined) update.footer = footer;

        // Update the theme settings for the user
        const theme = await Theme.findOneAndUpdate(
            { userId },
            { ...update, userId },
            { new: true, upsert: true } // Creates new document if it doesn't exist
        );

        return res.status(200).json({ message: 'Theme updated successfully.', theme });
    } catch (error) {
        console.error('Error updating theme:', error);
        return res.status(500).json({ message: 'An error occurred while updating the theme.' });
    }
};


const activateUserTemplate = async (req, res) => {
    try {
        const { templateId, userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required.' });
        }

        if (!templateId) {
            // Template deactivation
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { selectedTemplate: null },
                { new: true }
            );

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found.' });
            }

            return res.status(200).json({
                message: 'Template deactivated successfully.',
                activeTemplateId: updatedUser.selectedTemplate,
            });
        }

        
        const template = await Templates.findById(templateId);
        if (!template) {
            return res.status(404).json({ message: 'Template not found.' });
        }

        // Activate template
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { selectedTemplate: templateId },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Apply template configuration to portfolio
        const result = await applyTemplateToPortfolio(userId, templateId);
        if (!result.success) {
            console.warn('Warning: Failed to apply template to portfolio:', result.message);
        }

        return res.status(200).json({
            message: 'Template activated successfully.',
            activeTemplateId: updatedUser.selectedTemplate,
        });
    } catch (error) {
        console.error('Error activating template:', error);
        return res.status(500).json({ message: 'An error occurred while activating the template.' });
    }
};


const getActiveTemplate = async (req, res) => {
    try {
        const userId = req.query.userId; // Fetch user id from query parameters

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required.' });
        }

        const user = await User.findById(userId).populate('selectedTemplate').lean();

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).json({
            message: 'Active template retrieved successfully.',
            activeTemplateId: user.selectedTemplate?._id || null,
            activeTemplate: user.selectedTemplate || null,
        });
    } catch (error) {
        console.error('Error fetching active template:', error);
        return res.status(500).json({ message: 'An error occurred while fetching the active template.' });
    }
};

// Function to apply template configuration to portfolio data
const applyTemplateToPortfolio = async (userId, templateId) => {
  console.log(`[applyTemplateToPortfolio] Called for userId: ${userId}, templateId: ${templateId}`);
  try {
    // Find the template
    const template = await Templates.findById(templateId);
    if (!template) {
      console.log(`[applyTemplateToPortfolio] Template not found with ID: ${templateId}`);
      return { success: false, message: 'Template not found' };
    }
    console.log(`[applyTemplateToPortfolio] Found template: ${template.name}`);
    
    // Print template category
    console.log(`[applyTemplateToPortfolio] Template category: ${template.category}`);
    
    // Get the default sections for this portfolio type
    const defaultSections = template.defaultSections.get(template.category) || [];
    console.log(`[applyTemplateToPortfolio] Default sections for ${template.category}:`, defaultSections);
    
    // Create a new section configuration based on the default sections
    const newSectionConfig = {};
    Object.keys(template.sectionConfiguration).forEach(section => {
      newSectionConfig[section] = {
        ...template.sectionConfiguration[section],
        isEnabled: defaultSections.includes(section)
      };
    });
    
    console.log(`[applyTemplateToPortfolio] New section configuration:`, JSON.stringify(newSectionConfig, null, 2));
    
    // Find the user's portfolio
    let portfolio = await PortfolioData.findOne({ userId });
    if (!portfolio) {
      console.log(`[applyTemplateToPortfolio] Creating new portfolio for user: ${userId}`);
      
      // Create default social links based on portfolio type
      let defaultSocialLinks = [];
      
      // Add common social links based on portfolio type
      if (template.category === 'developer' || template.category === 'expert') {
        defaultSocialLinks = [
          { platform: 'github', url: 'https://github.com', isVisible: true, order: 1 },
          { platform: 'linkedin', url: 'https://linkedin.com', isVisible: true, order: 2 },
          { platform: 'stackoverflow', url: 'https://stackoverflow.com', isVisible: true, order: 3 }
        ];
      } else if (template.category === 'content-creator') {
        defaultSocialLinks = [
          { platform: 'instagram', url: 'https://instagram.com', isVisible: true, order: 1 },
          { platform: 'youtube', url: 'https://youtube.com', isVisible: true, order: 2 },
          { platform: 'twitter', url: 'https://twitter.com', isVisible: true, order: 3 }
        ];
      } else if (template.category === 'designer') {
        defaultSocialLinks = [
          { platform: 'behance', url: 'https://behance.net', isVisible: true, order: 1 },
          { platform: 'dribbble', url: 'https://dribbble.com', isVisible: true, order: 2 },
          { platform: 'instagram', url: 'https://instagram.com', isVisible: true, order: 3 }
        ];
      } else {
        // Default social links for other portfolio types
        defaultSocialLinks = [
          { platform: 'linkedin', url: 'https://linkedin.com', isVisible: true, order: 1 },
          { platform: 'twitter', url: 'https://twitter.com', isVisible: true, order: 2 }
        ];
      }
      
      // Create a new portfolio if it doesn't exist
      portfolio = new PortfolioData({
        userId,
        templateId, // Set the templateId field
        portfolioType: template.category, // Use template category directly as portfolio type
        sectionConfiguration: newSectionConfig,
        socialLinks: defaultSocialLinks // Add default social links
      });
    } else {
      console.log(`[applyTemplateToPortfolio] Updating existing portfolio for user: ${userId}`);
      // Update existing portfolio's section configuration and templateId
      portfolio.sectionConfiguration = newSectionConfig;
      portfolio.templateId = templateId; // Update the templateId field
      portfolio.portfolioType = template.category; // Update the portfolio type
      
      // Always update social links when switching templates
      let defaultSocialLinks = [];
      
      if (template.category === 'developer' || template.category === 'expert') {
        defaultSocialLinks = [
          { platform: 'github', url: 'https://github.com', isVisible: true, order: 1 },
          { platform: 'linkedin', url: 'https://linkedin.com', isVisible: true, order: 2 },
          { platform: 'stackoverflow', url: 'https://stackoverflow.com', isVisible: true, order: 3 }
        ];
      } else if (template.category === 'content-creator') {
        defaultSocialLinks = [
          { platform: 'instagram', url: 'https://instagram.com', isVisible: true, order: 1 },
          { platform: 'youtube', url: 'https://youtube.com', isVisible: true, order: 2 },
          { platform: 'twitter', url: 'https://twitter.com', isVisible: true, order: 3 }
        ];
      } else if (template.category === 'designer') {
        defaultSocialLinks = [
          { platform: 'behance', url: 'https://behance.net', isVisible: true, order: 1 },
          { platform: 'dribbble', url: 'https://dribbble.com', isVisible: true, order: 2 },
          { platform: 'instagram', url: 'https://instagram.com', isVisible: true, order: 3 }
        ];
      } else {
        // Default social links for other portfolio types
        defaultSocialLinks = [
          { platform: 'linkedin', url: 'https://linkedin.com', isVisible: true, order: 1 },
          { platform: 'twitter', url: 'https://twitter.com', isVisible: true, order: 2 }
        ];
      }
      
      // Update social links
      portfolio.socialLinks = defaultSocialLinks;
      console.log(`[applyTemplateToPortfolio] Updated social links for ${template.category}:`, JSON.stringify(portfolio.socialLinks, null, 2));
    }
    
    // Save the updated portfolio
    await portfolio.save();
    console.log(`[applyTemplateToPortfolio] Successfully saved portfolio configuration for user: ${userId}`);
    console.log(`[applyTemplateToPortfolio] Applied section configuration:`, JSON.stringify(portfolio.sectionConfiguration, null, 2));
    
    return { success: true, portfolio };
  } catch (error) {
    console.error('[applyTemplateToPortfolio] Error applying template to portfolio:', error);
    return { success: false, message: 'Error applying template to portfolio' };
  }
};

const activateTemplate = async (req, res) => {
    try {
        const { userId, templateId } = req.body;
        console.log(`[activateTemplate] Called for userId: ${userId}, templateId: ${templateId}`);
        
        if (!userId || !templateId) {
            return res.status(400).json({ message: 'User ID and Template ID are required.' });
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            console.log(`[activateTemplate] User not found with ID: ${userId}`);
            return res.status(404).json({ message: 'User not found.' });
        }

        // Find the template
        const template = await Templates.findById(templateId);
        if (!template) {
            console.log(`[activateTemplate] Template not found with ID: ${templateId}`);
            return res.status(404).json({ message: 'Template not found.' });
        }

        console.log(`[activateTemplate] Found template: ${template.name}`);

        // Update the user's selected template
        user.selectedTemplate = templateId;
        await user.save();
        console.log(`[activateTemplate] Updated user's selected template to: ${templateId}`);

        // Apply the template configuration to the user's portfolio
        const result = await applyTemplateToPortfolio(userId, templateId);
        if (!result.success) {
            console.log(`[activateTemplate] Failed to apply template to portfolio: ${result.message}`);
            return res.status(500).json({ message: result.message });
        }

        console.log(`[activateTemplate] Successfully applied template to portfolio`);

        return res.status(200).json({
            message: 'Template activated successfully.',
            data: {
                userId: user._id,
                selectedTemplate: user.selectedTemplate,
                portfolio: result.portfolio
            },
        });
    } catch (error) {
        console.error('[activateTemplate] Error activating template:', error);
        return res.status(500).json({ message: 'An error occurred while activating the template.' });
    }
};

const getActiveComponents = async (req, res) => {
    try {
      const components = await Component.find({ isActive: true }); // Fetch only active components
      return res.status(200).json({ components });
    } catch (error) {
      console.error("Error fetching active components:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  


module.exports = {
    activateTemplate,
    getActiveTemplate,
    activateUserTemplate,
    updateTheme,
    getActiveComponents
}