const express = require('express');
const { handleSignupMethod, userLogin , verifyRegisterOtp, resendOTP, forgotPasswordOtp, updateForgotPassword, verifyForgotPasswordOtp} = require('../controllers/user');
const router = express.Router();

router.post('/registeruser', handleSignupMethod);

router.post('/userlogin', userLogin);

router.post('/verifyregisterotp', verifyRegisterOtp)

router.post('/resendotp',resendOTP);

router.post('/forgotpassword',forgotPasswordOtp);

router.post('/verifyforgototp',verifyForgotPasswordOtp);

router.post('/updatepassword', updateForgotPassword);


module.exports = router;
