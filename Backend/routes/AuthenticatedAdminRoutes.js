const express = require('express');
const { addTemplate, deleteTemplate, upload, updateTemplate } = require('../controllers/AuthenticatedAdmin');
const router = express.Router();
const Template = require('../models/Templates');

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



router.delete('/deletetemplate/:templateId', deleteTemplate);


module.exports = router;
