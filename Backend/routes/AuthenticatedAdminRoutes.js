const express = require('express');
const { addTemplate, deleteTemplate, upload, updateTemplate, addComponent, updateComponentStatus, deleteComponent } = require('../controllers/AuthenticatedAdmin');
const router = express.Router();
const Template = require('../models/Templates');
const Component = require('../models/Components');

router.post('/addtemplate', upload.single('image'), addTemplate);

router.get('/templates', async (req, res) => {
    try {
        const templates = await Template.find({});
        res.status(200).json(templates);
    } catch (error) {
        console.error('Error fetching templates:', error);
        res.status(500).json({ message: 'Error fetching templates' });
    }
});


router.put('/updatetemplate/:templateId', upload.single('image'), updateTemplate);

router.post('/addcomponent', addComponent);

router.get('/components', async(req, res) => {
    try {
        const component = await Component.find({});
        res.status(200).json(component);
    } catch (error) {
        console.error('Error fetching components:', error);
        res.status(500).json({ message: 'Error fetching components' });
    }
});

router.put('/updatecomponent/:componentId', updateComponentStatus);

router.delete('/deletecomponent/:componentId', deleteComponent);

router.delete('/deletetemplate/:templateId', deleteTemplate);


module.exports = router;
