const express = require('express');
const router = express.Router();
const AnalyticsController = require('../controllers/AnalyticsController');
const { authenticateToken } = require('../middleware/auth');
const Analytics = require('../models/Analytics');

// Test endpoint to view raw analytics data
router.get('/test-data', async (req, res) => {
    try {
        const data = await Analytics.find().sort({ timestamp: -1 }).limit(10);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch test data' });
    }
});

// Track page view - Public endpoint
router.post('/track', AnalyticsController.trackPageView);

// Public analytics endpoints (no authentication required)
router.get('/summary', AnalyticsController.getAnalyticsSummary);
router.get('/traffic-sources', AnalyticsController.getTrafficSources);
router.get('/device-types', AnalyticsController.getDeviceTypes);
router.get('/time-trends', AnalyticsController.getTimeTrends);
router.get('/browser-stats', AnalyticsController.getBrowserStats);

module.exports = router; 