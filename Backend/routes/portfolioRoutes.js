const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

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

// Get complete portfolio data
router.get('/portfolio/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const portfolioData = await PortfolioData.findOne({ userId })
            .populate('userId', 'email')
            .lean();

        if (!portfolioData) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        res.status(200).json({ data: portfolioData });
    } catch (error) {
        console.error('Error fetching portfolio:', error);
        res.status(500).json({ message: 'Error fetching portfolio data' });
    }
});

// Create or update basic information
router.post('/portfolio/:userId/basics', async (req, res) => {
    try {
        const { userId } = req.params;
        const basicInfo = req.body;

        const portfolio = await PortfolioData.findOneAndUpdate(
            { userId },
            { $set: { basics: basicInfo } },
            { new: true, upsert: true }
        );

        res.status(200).json({
            message: 'Basic information updated successfully',
            data: portfolio.basics
        });
    } catch (error) {
        console.error('Error updating basic info:', error);
        res.status(500).json({ message: 'Error updating basic information' });
    }
});

// Handle section items (skills, experience, education, etc.)
router.post('/portfolio/:userId/:section', async (req, res) => {
    try {
        const { userId, section } = req.params;
        const newItem = req.body;

        const portfolio = await PortfolioData.findOneAndUpdate(
            { userId },
            { $push: { [section]: newItem } },
            { new: true, upsert: true }
        );

        res.status(200).json({
            message: `${section} item added successfully`,
            data: portfolio[section]
        });
    } catch (error) {
        console.error(`Error adding ${section} item:`, error);
        res.status(500).json({ message: `Error adding ${section} item` });
    }
});

// Update section item
router.put('/portfolio/:userId/:section/:itemId', async (req, res) => {
    try {
        const { userId, section, itemId } = req.params;
        const updateData = req.body;

        const portfolio = await PortfolioData.findOneAndUpdate(
            { 
                userId,
                [`${section}._id`]: itemId 
            },
            { $set: { [`${section}.$`]: updateData } },
            { new: true }
        );

        if (!portfolio) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({
            message: `${section} item updated successfully`,
            data: portfolio[section].id(itemId)
        });
    } catch (error) {
        console.error(`Error updating ${section} item:`, error);
        res.status(500).json({ message: `Error updating ${section} item` });
    }
});

// Delete section item
router.delete('/portfolio/:userId/:section/:itemId', async (req, res) => {
    try {
        const { userId, section, itemId } = req.params;

        const portfolio = await PortfolioData.findOneAndUpdate(
            { userId },
            { $pull: { [section]: { _id: itemId } } },
            { new: true }
        );

        if (!portfolio) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({
            message: `${section} item deleted successfully`,
            data: portfolio[section]
        });
    } catch (error) {
        console.error(`Error deleting ${section} item:`, error);
        res.status(500).json({ message: `Error deleting ${section} item` });
    }
});

// Update section visibility
router.patch('/portfolio/:userId/:section/visibility', async (req, res) => {
    try {
        const { userId, section } = req.params;
        const { isVisible } = req.body;

        const portfolio = await PortfolioData.findOneAndUpdate(
            { userId },
            { $set: { [`${section}.isVisible`]: isVisible } },
            { new: true }
        );

        res.status(200).json({
            message: `${section} visibility updated successfully`,
            data: portfolio[section]
        });
    } catch (error) {
        console.error(`Error updating ${section} visibility:`, error);
        res.status(500).json({ message: `Error updating ${section} visibility` });
    }
});

// Handle file uploads for profile and cover images
router.post('/portfolio/:userId/upload/:type', upload.single('image'), async (req, res) => {
    try {
        const { userId, type } = req.params;
        const imagePath = `/uploads/portfolio/${req.file.filename}`;

        const updateField = type === 'profile' ? 'basics.profileImage' : 'basics.coverImage';

        const portfolio = await PortfolioData.findOneAndUpdate(
            { userId },
            { $set: { [updateField]: imagePath } },
            { new: true, upsert: true }
        );

        res.status(200).json({
            message: `${type} image uploaded successfully`,
            data: {
                imageUrl: imagePath
            }
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ message: 'Error uploading image' });
    }
});

// Handle file uploads for section items (project images, certificates, etc.)
router.post('/portfolio/:userId/:section/:itemId/upload', upload.array('images', 5), async (req, res) => {
    try {
        const { userId, section, itemId } = req.params;
        const imagePaths = req.files.map(file => `/uploads/portfolio/${file.filename}`);

        const portfolio = await PortfolioData.findOneAndUpdate(
            { 
                userId,
                [`${section}._id`]: itemId 
            },
            { $push: { [`${section}.$.images`]: { $each: imagePaths } } },
            { new: true }
        );

        res.status(200).json({
            message: 'Images uploaded successfully',
            data: {
                imageUrls: imagePaths
            }
        });
    } catch (error) {
        console.error('Error uploading images:', error);
        res.status(500).json({ message: 'Error uploading images' });
    }
});

module.exports = router; 