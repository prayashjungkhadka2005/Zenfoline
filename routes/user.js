const express = require('express');
const { handleSignupMethod, userLogin , verifyRegisterOtp} = require('../controllers/user');
const router = express.Router();

router.post('/registeruser', handleSignupMethod);

router.post('/userlogin', userLogin);

router.post('/verifyregisterotp', verifyRegisterOtp)

module.exports = router;
