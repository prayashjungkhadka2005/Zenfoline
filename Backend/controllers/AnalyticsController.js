const Analytics = require('../models/Analytics');
const { v4: uuidv4 } = require('uuid');
const UAParser = require('ua-parser-js');
const geoip = require('geoip-lite');

class AnalyticsController {
    // Track a page view
    static async trackPageView(req, res) {
        try {
            const { userId } = req.body;
            
            // Get user agent and parse it
            const ua = new UAParser(req.headers['user-agent']);
            const deviceType = ua.getDevice().type || 'desktop';
            const browser = ua.getBrowser();
            const os = ua.getOS();
            
            // Get IP and country with better fallback
            const ip = req.headers['x-forwarded-for'] || 
                      req.connection.remoteAddress || 
                      req.socket.remoteAddress || 
                      '127.0.0.1';
            
            // Clean IP address (remove IPv6 prefix if present)
            const cleanIp = ip.replace(/^::ffff:/, '');
            const geo = geoip.lookup(cleanIp);
            const country = geo ? geo.country : 'Unknown';
            
            // Get referrer and determine traffic source
            const referrer = req.headers.referer || 'direct';
            let trafficSource = 'direct';
            
            if (referrer !== 'direct') {
                if (referrer.includes('google')) {
                    trafficSource = 'google';
                } else if (referrer.includes('facebook')) {
                    trafficSource = 'facebook';
                } else if (referrer.includes('linkedin')) {
                    trafficSource = 'linkedin';
                } else {
                    trafficSource = 'other';
                }
            }

            // Generate a session ID if not provided
            const sessionId = req.body.sessionId || uuidv4();

            // Find and update existing session or create new one
            const result = await Analytics.findOneAndUpdate(
                {
                    userId,
                    sessionId,
                    createdAt: {
                        $gte: new Date(Date.now() - 30 * 60 * 1000) // Within last 30 minutes
                    }
                },
                {
                    $inc: { pageViews: 1 },
                    $set: {
                        isBounce: false,
                        deviceType,
                        country,
                        trafficSource,
                        referrerUrl: referrer,
                        userAgent: req.headers['user-agent'],
                        browser: browser.name,
                        browserVersion: browser.version,
                        os: os.name,
                        osVersion: os.version,
                        updatedAt: new Date()
                    },
                    $setOnInsert: {
                        createdAt: new Date()
                    }
                },
                {
                    new: true,
                    upsert: true,
                    setDefaultsOnInsert: true
                }
            );

            // Update session duration if it's an existing session
            if (result.createdAt) {
                const sessionDuration = Math.floor((Date.now() - result.createdAt.getTime()) / 1000);
                await Analytics.updateOne(
                    { _id: result._id },
                    { $set: { sessionDuration } }
                );
            }

            res.json({ success: true });
        } catch (error) {
            console.error('Error tracking page view:', error);
            res.status(500).json({ error: 'Failed to track page view' });
        }
    }

    // Get analytics summary
    static async getAnalyticsSummary(req, res) {
        try {
            const { userId } = req.query;
            const { timeRange = '7d' } = req.query;

            const dateFilter = getDateFilter(timeRange);

            const summary = await Analytics.aggregate([
                { $match: { userId, createdAt: dateFilter } },
                {
                    $group: {
                        _id: null,
                        totalSessions: { $sum: 1 },
                        totalPageViews: { $sum: '$pageViews' },
                        uniqueVisitors: { $addToSet: '$sessionId' },
                        averageSessionDuration: { $avg: '$sessionDuration' },
                        bounceRate: {
                            $avg: { $cond: ['$isBounce', 1, 0] }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        totalSessions: 1,
                        totalPageViews: 1,
                        uniqueVisitors: { $size: '$uniqueVisitors' },
                        averageSessionDuration: { $round: ['$averageSessionDuration', 2] },
                        bounceRate: { $multiply: [{ $round: ['$bounceRate', 2] }, 100] }
                    }
                }
            ]);

            res.json({
                success: true,
                data: summary[0] || {
                    totalSessions: 0,
                    totalPageViews: 0,
                    uniqueVisitors: 0,
                    averageSessionDuration: 0,
                    bounceRate: 0
                }
            });
        } catch (error) {
            console.error('Error getting analytics summary:', error);
            res.status(500).json({ error: 'Failed to get analytics summary' });
        }
    }

    // Get traffic sources breakdown
    static async getTrafficSources(req, res) {
        try {
            const { userId } = req.query;
            const { timeRange = '7d' } = req.query;

            const dateFilter = getDateFilter(timeRange);

            const trafficSources = await Analytics.aggregate([
                { $match: { userId, createdAt: dateFilter } },
                {
                    $group: {
                        _id: '$trafficSource',
                        count: { $sum: 1 },
                        pageViews: { $sum: '$pageViews' }
                    }
                },
                {
                    $project: {
                        source: '$_id',
                        count: 1,
                        pageViews: 1,
                        _id: 0
                    }
                }
            ]);

            res.json({
                success: true,
                data: trafficSources
            });
        } catch (error) {
            console.error('Error getting traffic sources:', error);
            res.status(500).json({ error: 'Failed to get traffic sources' });
        }
    }

    // Get device types breakdown
    static async getDeviceTypes(req, res) {
        try {
            const { userId } = req.query;
            const { timeRange = '7d' } = req.query;

            const dateFilter = getDateFilter(timeRange);

            const deviceTypes = await Analytics.aggregate([
                { $match: { userId, createdAt: dateFilter } },
                {
                    $group: {
                        _id: '$deviceType',
                        count: { $sum: 1 },
                        pageViews: { $sum: '$pageViews' }
                    }
                },
                {
                    $project: {
                        device: '$_id',
                        count: 1,
                        pageViews: 1,
                        _id: 0
                    }
                }
            ]);

            res.json({
                success: true,
                data: deviceTypes
            });
        } catch (error) {
            console.error('Error getting device types:', error);
            res.status(500).json({ error: 'Failed to get device types' });
        }
    }

    // Get time-based trends
    static async getTimeTrends(req, res) {
        try {
            const { userId } = req.query;
            const { timeRange = '7d' } = req.query;

            const dateFilter = getDateFilter(timeRange);
            const groupBy = getGroupBy(timeRange);

            const trends = await Analytics.aggregate([
                { $match: { userId, createdAt: dateFilter } },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: groupBy,
                                date: '$createdAt'
                            }
                        },
                        sessions: { $sum: 1 },
                        pageViews: { $sum: '$pageViews' },
                        uniqueVisitors: { $addToSet: '$sessionId' }
                    }
                },
                {
                    $project: {
                        date: '$_id',
                        sessions: 1,
                        pageViews: 1,
                        uniqueVisitors: { $size: '$uniqueVisitors' },
                        _id: 0
                    }
                },
                { $sort: { date: 1 } }
            ]);

            res.json({
                success: true,
                data: trends
            });
        } catch (error) {
            console.error('Error getting time trends:', error);
            res.status(500).json({ error: 'Failed to get time trends' });
        }
    }

    // Get browser statistics
    static async getBrowserStats(req, res) {
        try {
            const { userId } = req.query;
            const { timeRange = '7d' } = req.query;

            const dateFilter = getDateFilter(timeRange);

            const browserStats = await Analytics.aggregate([
                { $match: { userId, createdAt: dateFilter } },
                {
                    $group: {
                        _id: {
                            browser: '$browser',
                            version: '$browserVersion'
                        },
                        count: { $sum: 1 },
                        pageViews: { $sum: '$pageViews' },
                        uniqueSessions: { $addToSet: '$sessionId' }
                    }
                },
                {
                    $project: {
                        browser: '$_id.browser',
                        version: '$_id.version',
                        count: 1,
                        pageViews: 1,
                        uniqueSessions: { $size: '$uniqueSessions' },
                        _id: 0
                    }
                },
                { $sort: { count: -1 } }
            ]);

            res.json({
                success: true,
                data: browserStats
            });
        } catch (error) {
            console.error('Error getting browser stats:', error);
            res.status(500).json({ error: 'Failed to get browser stats' });
        }
    }
}

// Helper function to get date filter based on time range
function getDateFilter(timeRange) {
    const now = new Date();
    let startDate;

    switch (timeRange) {
        case '24h':
            startDate = new Date(now.setHours(now.getHours() - 24));
            break;
        case '7d':
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
        case '30d':
            startDate = new Date(now.setDate(now.getDate() - 30));
            break;
        case '90d':
            startDate = new Date(now.setDate(now.getDate() - 90));
            break;
        default:
            startDate = new Date(now.setDate(now.getDate() - 7));
    }

    return { $gte: startDate };
}

// Helper function to get group by format based on time range
function getGroupBy(timeRange) {
    switch (timeRange) {
        case '24h':
            return '%H:00';
        case '7d':
            return '%Y-%m-%d';
        case '30d':
            return '%Y-%m-%d';
        case '90d':
            return '%Y-%m';
        default:
            return '%Y-%m-%d';
    }
}

module.exports = AnalyticsController; 