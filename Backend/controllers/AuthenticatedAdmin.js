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

      const template = await Template.findById(templateId);
  
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
      await Template.findByIdAndDelete(templateId);
  
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
        const { name, description, category } = req.body;

        if (!templateId) {
            return res.status(400).json({ message: 'Template ID is required.' });
        }

        
        const existingTemplate = await Template.findById(templateId);
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
        const updatedTemplate = await Template.findByIdAndUpdate(
            templateId,
            {
                name: name || existingTemplate.name,
                description: description || existingTemplate.description,
                category: category || existingTemplate.category,
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
        const { name, description, category, adminId } = req.body;

        if (!name || !req.file || !category || !adminId) {
            return res.status(400).json({ message: 'All fields are required!' });
        }

        const admin = await Admin.findById(adminId).lean();
        if (!admin || admin.role !== 'Admin') {
            return res.status(403).json({ message: 'Only an admin can add templates.' });
        }

        const imagePath = `/uploads/${req.file.filename}`; //relativepath

        const newTemplate = await Template.create({
            name,
            description: description || '',
            image: imagePath, 
            category,
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



module.exports = {
    addTemplate,
    deleteTemplate,
    upload,
    storage,
    updateTemplate
}
