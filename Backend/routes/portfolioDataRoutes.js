const express = require('express');
const router = express.Router();
const { saveBasicInfo, saveAboutInfo, getAboutInfo, upload, getBasicInfo, saveSkillsInfo, getSkillsInfo, saveExperienceInfo, getExperienceInfo } = require('../controllers/PortfolioDataController');
const PortfolioData = require('../models/PortfolioData');

// // Get complete portfolio data
// router.get('/portfolio/:userId', async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const portfolioData = await PortfolioData.findOne({ userId })
//             .populate('userId', 'email')
//             .lean();

//         if (!portfolioData) {
//             return res.status(404).json({ message: 'Portfolio not found' });
//         }

//         res.status(200).json({ data: portfolioData });
//     } catch (error) {
//         console.error('Error fetching portfolio:', error);
//         res.status(500).json({ message: 'Error fetching portfolio data' });
//     }
// });

// // Create or update basic information
// router.post('/portfolio/:userId/basics', async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const basicInfo = req.body;

//         const portfolio = await PortfolioData.findOneAndUpdate(
//             { userId },
//             { $set: { basics: basicInfo } },
//             { new: true, upsert: true }
//         );

//         res.status(200).json({
//             message: 'Basic information updated successfully',
//             data: portfolio.basics
//         });
//     } catch (error) {
//         console.error('Error updating basic info:', error);
//         res.status(500).json({ message: 'Error updating basic information' });
//     }
// });

// // Handle section items (skills, experience, education, etc.)
// router.post('/portfolio/:userId/:section', async (req, res) => {
//     try {
//         const { userId, section } = req.params;
//         const newItem = req.body;

//         const portfolio = await PortfolioData.findOneAndUpdate(
//             { userId },
//             { $push: { [section]: newItem } },
//             { new: true, upsert: true }
//         );

//         res.status(200).json({
//             message: `${section} item added successfully`,
//             data: portfolio[section]
//         });
//     } catch (error) {
//         console.error(`Error adding ${section} item:`, error);
//         res.status(500).json({ message: `Error adding ${section} item` });
//     }
// });

// // Update section item
// router.put('/portfolio/:userId/:section/:itemId', async (req, res) => {
//     try {
//         const { userId, section, itemId } = req.params;
//         const updateData = req.body;

//         const portfolio = await PortfolioData.findOneAndUpdate(
//             { 
//                 userId,
//                 [`${section}._id`]: itemId 
//             },
//             { $set: { [`${section}.$`]: updateData } },
//             { new: true }
//         );

//         if (!portfolio) {
//             return res.status(404).json({ message: 'Item not found' });
//         }

//         res.status(200).json({
//             message: `${section} item updated successfully`,
//             data: portfolio[section].id(itemId)
//         });
//     } catch (error) {
//         console.error(`Error updating ${section} item:`, error);
//         res.status(500).json({ message: `Error updating ${section} item` });
//     }
// });

// // Delete section item
// router.delete('/portfolio/:userId/:section/:itemId', async (req, res) => {
//     try {
//         const { userId, section, itemId } = req.params;

//         const portfolio = await PortfolioData.findOneAndUpdate(
//             { userId },
//             { $pull: { [section]: { _id: itemId } } },
//             { new: true }
//         );

//         if (!portfolio) {
//             return res.status(404).json({ message: 'Item not found' });
//         }

//         res.status(200).json({
//             message: `${section} item deleted successfully`,
//             data: portfolio[section]
//         });
//     } catch (error) {
//         console.error(`Error deleting ${section} item:`, error);
//         res.status(500).json({ message: `Error deleting ${section} item` });
//     }
// });

// // Update section visibility
// router.patch('/portfolio/:userId/:section/visibility', async (req, res) => {
//     try {
//         const { userId, section } = req.params;
//         const { isVisible } = req.body;

//         const portfolio = await PortfolioData.findOneAndUpdate(
//             { userId },
//             { $set: { [`${section}.isVisible`]: isVisible } },
//             { new: true }
//         );

//         res.status(200).json({
//             message: `${section} visibility updated successfully`,
//             data: portfolio[section]
//         });
//     } catch (error) {
//         console.error(`Error updating ${section} visibility:`, error);
//         res.status(500).json({ message: `Error updating ${section} visibility` });
//     }
// });

// // Handle file uploads for profile and cover images
// router.post('/portfolio/:userId/upload/:type', upload.single('image'), async (req, res) => {
//     try {
//         const { userId, type } = req.params;
//         const imagePath = `/uploads/portfolio/${req.file.filename}`;

//         const updateField = type === 'profile' ? 'basics.profileImage' : 'basics.coverImage';

//         const portfolio = await PortfolioData.findOneAndUpdate(
//             { userId },
//             { $set: { [updateField]: imagePath } },
//             { new: true, upsert: true }
//         );

//         res.status(200).json({
//             message: `${type} image uploaded successfully`,
//             data: {
//                 imageUrl: imagePath
//             }
//         });
//     } catch (error) {
//         console.error('Error uploading image:', error);
//         res.status(500).json({ message: 'Error uploading image' });
//     }
// });

// // Handle file uploads for section items (project images, certificates, etc.)
// router.post('/portfolio/:userId/:section/:itemId/upload', upload.array('images', 5), async (req, res) => {
//     try {
//         const { userId, section, itemId } = req.params;
//         const imagePaths = req.files.map(file => `/uploads/portfolio/${file.filename}`);

//         const portfolio = await PortfolioData.findOneAndUpdate(
//             { 
//                 userId,
//                 [`${section}._id`]: itemId 
//             },
//             { $push: { [`${section}.$.images`]: { $each: imagePaths } } },
//             { new: true }
//         );

//         res.status(200).json({
//             message: 'Images uploaded successfully',
//             data: {
//                 imageUrls: imagePaths
//             }
//         });
//     } catch (error) {
//         console.error('Error uploading images:', error);
//         res.status(500).json({ message: 'Error uploading images' });
//     }
// });

// // Update template basic information
// router.put('/template/:userId/basics', async (req, res) => {
//     try {
//         const { userId } = req.params;
//         console.log('Received userId:', userId);
//         console.log('Received data:', req.body);

//         if (!userId) {
//             return res.status(400).json({ message: 'User ID is required' });
//         }

//         const {
//             name,
//             role,
//             bio,
//             email,
//             phone,
//             location,
//             profileImage,
//             socialLinks
//         } = req.body;

//         // Find or create portfolio data
//         let portfolio = await PortfolioData.findOne({ userId });
//         console.log('Existing portfolio:', portfolio);
        
//         if (!portfolio) {
//             console.log('Creating new portfolio for user:', userId);
//             portfolio = new PortfolioData({
//                 userId,
//                 portfolioType: 'developer', // Default type for expert template
//                 basics: {
//                     isVisible: true
//                 }
//             });
//         }

//         // Update basic information
//         portfolio.basics = {
//             ...portfolio.basics,
//             name,
//             title: role, // Map role to title in the schema
//             summary: bio, // Map bio to summary in the schema
//             email,
//             phone,
//             location,
//             profileImage,
//             isVisible: true
//         };

//         // Update social links
//         if (socialLinks) {
//             portfolio.socialLinks = Object.entries(socialLinks).map(([platform, url]) => ({
//                 platform,
//                 url,
//                 isVisible: true
//             }));
//         }

//         console.log('Saving portfolio:', portfolio);

//         // Save the updated portfolio
//         await portfolio.save();

//         console.log('Portfolio saved successfully');
//         res.status(200).json({
//             message: 'Basic information updated successfully',
//             data: portfolio
//         });
//     } catch (error) {
//         console.error('Error updating basic info:', error);
//         res.status(500).json({ message: 'Error updating basic information' });
//     }
// });

// // Update complete template data
// router.put('/template/:userId/data', async (req, res) => {
//     try {
//         const { userId } = req.params;
//         console.log('Received userId for template data update:', userId);
//         console.log('Received template data:', req.body);

//         if (!userId) {
//             return res.status(400).json({ message: 'User ID is required' });
//         }

//         const { data } = req.body;
//         if (!data) {
//             return res.status(400).json({ message: 'Template data is required' });
//         }

//         // Find or create portfolio data
//         let portfolio = await PortfolioData.findOne({ userId });
//         if (!portfolio) {
//             portfolio = new PortfolioData({
//                 userId,
//                 portfolioType: 'developer'
//             });
//         }

//         // Update sections by merging with existing data
//         if (data.basics) {
//             portfolio.basics = {
//                 ...portfolio.basics,
//                 ...data.basics
//             };
//         }
        
//         // Properly handle about section with highlights
//         if (data.about) {
//             portfolio.about = {
//                 description: data.about.description || portfolio.about?.description || '',
//                 highlights: data.about.highlights?.map(highlight => ({
//                     text: highlight.text,
//                     isVisible: highlight.isVisible || true
//                 })) || portfolio.about?.highlights || []
//             };
//         }
        
//         if (data.skills) {
//             portfolio.skills = data.skills;
//         }
//         if (data.experience) {
//             portfolio.experience = data.experience;
//         }
//         if (data.projects) {
//             portfolio.projects = data.projects;
//         }
//         if (data.theme) {
//             portfolio.theme = {
//                 ...portfolio.theme,
//                 ...data.theme
//             };
//         }

//         console.log('Saving complete template data:', portfolio);

//         // Save the updated portfolio
//         await portfolio.save();

//         console.log('Template data saved successfully');
//         res.status(200).json({
//             message: 'Template data updated successfully',
//             data: portfolio
//         });
//     } catch (error) {
//         console.error('Error updating template data:', error);
//         res.status(500).json({ message: 'Error updating template data' });
//     }
// });

// Get basic information
router.get('/basic-info/:userId', getBasicInfo);

// Save basic information (with profile image upload)
router.post('/basic-info/:userId', upload.single('profileImage'), saveBasicInfo);

// Get about information
router.get('/about/:userId', getAboutInfo);

// Save about information
router.post('/about/:userId', saveAboutInfo);

// Skills routes
router.get('/skills/:userId', getSkillsInfo);
router.post('/skills/:userId', saveSkillsInfo);

// Experience routes
router.get('/experience/:userId', getExperienceInfo);
router.post('/experience/:userId', saveExperienceInfo);

module.exports = router; 