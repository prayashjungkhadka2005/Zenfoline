const express = require('express');
const router = express.Router();
const PortfolioData = require('../models/PortfolioData');
const Template = require('../models/Templates');
const User = require('../models/User');
const { getTemplateByUserId, getPortfolioDataByUserId } = require('../controllers/PublicViewPortfolioController');

// Used for public portfolio view
// Get template by userId - THIS MUST COME FIRST 
router.get('/template/:userId', getTemplateByUserId);
   
// Get portfolio data by userId - THIS COMES SECOND
router.get('/:userId', getPortfolioDataByUserId);
   
        

module.exports = router; 