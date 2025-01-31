const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Otp = require('../models/Otp');
const Admin = require('../models/Admin');
const Template = require('../models/Templates');
require('dotenv').config();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Theme = require('../models/ThemeSchema');
const Component = require('../models/Components');

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

        
        const template = await Template.findById(templateId);
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

const activateTemplate = async (req, res) => {
    try {
        const { userId, templateId } = req.body;

        if (!userId || !templateId) {
            return res.status(400).json({ message: 'Both userId and templateId are required.' });
        }

       

        const findUser = await User.findById(userId).lean();
if (!findUser) {
    return res.status(403).json({ message: 'User not found.' });
}


        const template = await Template.findById(templateId);
        if (!template) {
            return res.status(404).json({ message: 'Template not found.' });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { selectedTemplate: templateId },
            { new: true }
        ).populate('selectedTemplate', 'name image category');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).json({
            message: 'Template activated successfully.',
            data: {
                userId: user._id,
                selectedTemplate: user.selectedTemplate,
            },
        });
    } catch (error) {
        console.error('Error activating template:', error);
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