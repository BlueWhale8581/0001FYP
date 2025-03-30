// backend/routes/advertiser.js
const express = require('express');
const router = express.Router();
const advertiserController = require('../controllers/advertiserController');
const { verifyToken, authorizeRole } = require('../config/auth');
const uploadService = require('../services/uploadService');

// Apply middleware to all routes to ensure only authenticated advertisers can access
router.use(verifyToken);
router.use(authorizeRole('advertiser'));

// Advertiser dashboard
router.get('/dashboard', advertiserController.getDashboard);

// Campaign management
router.get('/campaigns', advertiserController.getCampaigns);
router.post('/campaigns', advertiserController.createCampaign);
router.get('/campaigns/:id', advertiserController.getCampaignById);
router.put('/campaigns/:id', advertiserController.updateCampaign);
router.put('/campaigns/:id/status', advertiserController.updateCampaignStatus);
router.delete('/campaigns/:id', advertiserController.deleteCampaign);
router.get('/campaigns/:id/performance', advertiserController.getCampaignPerformance);

// Ad management
router.get('/ads', advertiserController.getAds);
router.post('/campaigns/:campaignId/ads', uploadService.uploadAdMedia, advertiserController.createAd);
router.get('/ads/:id', advertiserController.getAdById);
router.put('/ads/:id', uploadService.uploadAdMedia, advertiserController.updateAd);
router.delete('/ads/:id', advertiserController.deleteAd);
router.get('/ads/:id/metrics', advertiserController.getAdMetrics);

// Budget and payment management
router.get('/payments', advertiserController.getPaymentHistory);
router.post('/payments', advertiserController.makePayment);
router.get('/budget', advertiserController.getBudgetOverview);
router.get('/budget/:campaignId', advertiserController.getCampaignBudgetDetails);

// Analytics and reporting
router.get('/analytics/overview', advertiserController.getAnalyticsOverview);
router.get('/analytics/impressions', advertiserController.getImpressionAnalytics);
router.get('/analytics/performance', advertiserController.getPerformanceAnalytics);
router.get('/reports', advertiserController.generateReport);

// Profile management
router.get('/profile', advertiserController.getProfile);
router.put('/profile', advertiserController.updateProfile);

// Notifications specific to advertisers
router.get('/notifications', advertiserController.getNotifications);
router.put('/notifications/:id/read', advertiserController.markNotificationAsRead);
router.put('/notifications/read-all', advertiserController.markAllNotificationsAsRead);

module.exports = router;