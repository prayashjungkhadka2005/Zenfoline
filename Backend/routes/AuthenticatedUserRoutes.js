const express = require('express');
const { activateTemplate, getActiveTemplate, activateUserTemplate } = require('../controllers/AuthenticatedUser');
const router = express.Router();
const Template = require('../models/Templates');
const User = require('../models/User');

router.post('/activatetemplate', activateTemplate);

router.post('/activateusertemplate', activateUserTemplate);

router.get('/getactivetemplate', getActiveTemplate);

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
