const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const Otp = require('../models/Otp');
const Admin = require('../models/Admin');
require('dotenv').config();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Component = require('../models/Components');
const Templates = require('../models/Templates');
const User = require('../models/User');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads/');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true }); 
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); 
    },

});


const upload = multer({ storage });

const deleteTemplate = async (req, res) => {
    try {
      const { templateId } = req.params;
  
      if (!templateId) {
        return res.status(400).json({ message: 'Template ID is required.' });
      }

      const template = await Templates.findById(templateId);
  
      if (!template) {
        return res.status(404).json({ message: 'Template not found.' });
      }
  
      //remove the image
      if (template.image) {
        const imagePath = path.join(__dirname, '..', template.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
  
      //delete template using id
      await Templates.findByIdAndDelete(templateId);
  
      //update users
      await User.updateMany(
        { selectedTemplate: templateId },
        { $set: { selectedTemplate: null } }
      );
  
      return res.status(200).json({ message: 'Template deleted successfully.' });
    } catch (error) {
      console.error('Error deleting template:', error);
      return res.status(500).json({ message: 'An error occurred while deleting the template.' });
    }
  };
  
  const updateTemplate = async (req, res) => {
    try {
        const { templateId } = req.params;
        const { name, description, category, predefinedTemplate } = req.body;

        if (!templateId) {
            return res.status(400).json({ message: 'Template ID is required.' });
        }

        
        const existingTemplate = await Templates.findById(templateId);
        if (!existingTemplate) {
            return res.status(404).json({ message: 'Template not found.' });
        }

        // new image
        let updatedImagePath = existingTemplate.image;
        if (req.file) {
            // Deleting old image
            if (existingTemplate.image) {
                const oldImagePath = path.join(__dirname, '..', existingTemplate.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            updatedImagePath = `/uploads/${req.file.filename}`;
        }

        // Updating the template
        const updatedTemplate = await Templates.findByIdAndUpdate(
            templateId,
            {
                name: name || existingTemplate.name,
                description: description || existingTemplate.description,
                category: category || existingTemplate.category, predefinedTemplate: predefinedTemplate || existingTemplate.predefinedTemplate,
                image: updatedImagePath,
            },
            { new: true } 
        );

        if (!updatedTemplate) {
            return res.status(500).json({ message: 'Failed to update template.' });
        }

        return res.status(200).json({
            message: 'Template updated successfully.',
            data: updatedTemplate,
        });
    } catch (error) {
        console.error('Error updating template:', error);
        return res.status(500).json({ message: 'An error occurred while updating the template.' });
    }
};


const addTemplate = async (req, res) => {
    try {
        const { name, description, category,predefinedTemplate, adminId } = req.body;

        if (!name || !req.file || !category || !adminId || !predefinedTemplate) {
            return res.status(400).json({ message: 'All fields are required!' });
        }

        const admin = await Admin.findById(adminId).lean();
        if (!admin || admin.role !== 'Admin') {
            return res.status(403).json({ message: 'Only an admin can add templates.' });
        }

        const imagePath = `/uploads/${req.file.filename}`; //relativepath

        const newTemplate = await Templates.create({
            name,
            description: description || '',
            image: imagePath, 
            category,
            predefinedTemplate,
            addedBy: adminId,
        });

        return res.status(201).json({
            message: 'Template added successfully.',
            data: newTemplate,
        });
    } catch (error) {
        console.error('Error adding template:', error);
        return res.status(500).json({ message: 'An error occurred while adding the template.' });
    }
};


const addComponent = async (req, res) => {
    try {
        const { name, category, linkedTemplate, componentType, componentSubType } = req.body;

        // Validate required fields
        if (!name || !category || !linkedTemplate || !componentType || !componentSubType) {
            return res.status(400).json({ message: 'All fields are required!' });
        }

        // Check if the linked template exists
        const template = await Templates.findById(linkedTemplate);
        if (!template) {
            return res.status(404).json({ message: 'Linked template not found.' });
        }

        // Check if the category matches the template category
        if (template.category !== category) {
            return res.status(400).json({ message: 'Category mismatch with the linked template.' });
        }

        // Create a new component
        const newComponent = await Component.create({
            name,
            category,
            linkedTemplate,
            componentType,
            componentSubType,
            isActive: true, // Default to active
        });

        return res.status(201).json({
            message: 'Component added successfully.',
            data: newComponent,
        });
    } catch (error) {
        console.error('Error adding component:', error);
        return res.status(500).json({ message: 'An error occurred while adding the component.' });
    }
};


const updateComponentStatus = async (req, res) => {
    try {
        const { componentId } = req.params; // Use componentId instead of id for clarity
        console.log(componentId);
        
        const { isActive } = req.body;
        console.log(isActive);
        

        // Ensure `isActive` is provided and is a boolean
        if (typeof isActive !== 'boolean') {
            return res.status(400).json({ message: 'Invalid status value. Must be true or false.' });
        }

        // Find component by ID
        const component = await Component.findById(componentId);
        if (!component) {
            return res.status(404).json({ message: 'Component not found.' });
        }

        // Toggle the active status
        component.isActive = isActive;
        await component.save();

        return res.status(200).json({
            message: `Component ${isActive ? 'activated' : 'deactivated'} successfully.`,
            data: component,
        });

    } catch (error) {
        console.error('Error updating component status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const deleteComponent = async (req, res) => {
    try {
        const { componentId } = req.params;

        if (!componentId) {
            return res.status(400).json({ message: "Component ID is required." });
        }

        const component = await Component.findById(componentId);
        if (!component) {
            return res.status(404).json({ message: "Component not found." });
        }

        await Component.findByIdAndDelete(componentId);

        return res.status(200).json({ message: "Component deleted successfully." });
    } catch (error) {
        console.error("Error deleting component:", error);
        res.status(500).json({ message: "An error occurred while deleting the component." });
    }
};


module.exports = {
    addTemplate,
    deleteTemplate,
    upload,
    storage,
    updateTemplate,
    addComponent,
    updateComponentStatus,
    deleteComponent
}
