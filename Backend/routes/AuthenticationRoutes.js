const express = require('express');
const { handleSignupMethod, userLogin , verifyRegisterOtp, resendOTP, forgotPasswordOtp, updateForgotPassword, verifyForgotPasswordOtp, addAdmin, adminLogin, changePassword, changeEmail, verifyEmailChange, deleteAccount} = require('../controllers/Authentications');
const router = express.Router();

router.post('/registeruser', handleSignupMethod);

router.post('/userlogin', userLogin);

router.post('/verifyregisterotp', verifyRegisterOtp)

router.post('/resendotp',resendOTP);

router.post('/forgotpassword',forgotPasswordOtp);

router.post('/verifyforgototp',verifyForgotPasswordOtp);

router.post('/updatepassword', updateForgotPassword);

router.post('/addadmin', addAdmin);

router.post('/adminlogin', adminLogin);

router.post('/changepassword', changePassword);
router.post('/changeemail', changeEmail);
router.post('/verifyemailchange', verifyEmailChange);
router.delete('/deleteaccount', deleteAccount);

module.exports = router;
