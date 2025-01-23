const express = require('express');
const { activateTemplate, getActiveTemplate, activateUserTemplate } = require('../controllers/AuthenticatedUser');
const router = express.Router();
const Template = require('../models/Templates');

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



module.exports = router;
