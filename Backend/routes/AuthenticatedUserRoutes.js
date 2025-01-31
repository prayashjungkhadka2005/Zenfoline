const express = require('express');
const { activateTemplate, getActiveTemplate, activateUserTemplate, updateTheme, getActiveComponents } = require('../controllers/AuthenticatedUser');
const router = express.Router();
const Template = require('../models/Templates');
const User = require('../models/User');
const Theme = require('../models/ThemeSchema');

router.post('/activatetemplate', activateTemplate);

router.post('/activateusertemplate', activateUserTemplate);

router.get('/getactivetemplate', getActiveTemplate);

router.post('/updatetheme', updateTheme);

router.get("/getactivecomponents", getActiveComponents);



router.get('/gettheme', async (req, res) => {
    const { userId } = req.query; // Extract userId from query parameters

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        // Find the theme settings for the user
        const theme = await Theme.findOne({ userId });

        if (!theme) {
            return res.status(404).json({ message: 'Theme not found for the user.' });
        }

        return res.status(200).json({
            message: 'Theme fetched successfully.',
            theme,
        });
    } catch (error) {
        console.error('Error fetching theme:', error);
        return res.status(500).json({ message: 'An error occurred while fetching the theme.' });
    }
});



router.get('/templates', async (req, res) => {
    try {
        const templates = await Template.find({});
        res.status(200).json(templates);
    } catch (error) {
        console.error('Error fetching templates:', error);
        res.status(500).json({ message: 'Error fetching templates' });
    }
});

//fetch active template for user
router.get('/activetemplate', async (req, res) => {
    const userId = req.query.userId;
    console.log('userId:', userId);

  
    const user = await User.findById(userId).populate('selectedTemplate');
    if (!user || !user.selectedTemplate) {
      return res.status(404).json({ message: 'No active template found' });
    }
  
    return res.status(200).json(user.selectedTemplate);
  });
  



module.exports = router;
