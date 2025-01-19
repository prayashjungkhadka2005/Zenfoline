const express = require('express');
const { handleSignupMethod, userLogin , verifyRegisterOtp, resendOTP, forgotPasswordOtp, updateForgotPassword, verifyForgotPasswordOtp, addAdmin, addTemplate, activateTemplate, adminLogin, upload, activateUserTemplate, getActiveTemplate, deleteTemplate} = require('../controllers/user');
const router = express.Router();
const Template = require('../models/Templates');

router.post('/registeruser', handleSignupMethod);

router.post('/userlogin', userLogin);

router.post('/verifyregisterotp', verifyRegisterOtp)

router.post('/resendotp',resendOTP);

router.post('/forgotpassword',forgotPasswordOtp);

router.post('/verifyforgototp',verifyForgotPasswordOtp);

router.post('/updatepassword', updateForgotPassword);

router.post('/addadmin', addAdmin);

router.post('/addtemplate', upload.single('image'), addTemplate);

router.post('/activatetemplate', activateTemplate);

router.post('/adminlogin', adminLogin);

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

router.delete('/deletetemplate/:templateId', deleteTemplate);


module.exports = router;
