const express = require('express');
const { handleSignupMethod } = require('../controllers/user');
const router = express.Router();

router.post('/registeruser', handleSignupMethod);

module.exports = router;
