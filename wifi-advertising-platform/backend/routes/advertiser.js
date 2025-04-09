// backend/routes/advertiser.js
const express = require('express');
const router = express.Router();
const advertiserController = require('../controllers/advertiserController');
const { verifyToken, authorizeRole } = require('../config/auth');
const uploadService = require('../services/uploadService');

// Apply middleware to all advertiser routes
router.use(verifyToken);
router.use(authorizeRole('advertiser'));

/**
 * Dashboard Routes
 */

/**
 * @route   GET /api/advertiser/dashboard
 * @desc    Get advertiser dashboard data
 * @access  Private (Advertiser)
 */
router.get('/dashboard', advertiserController.getDashboard);

/**
 * @route   GET /api/advertiser/notifications
 * @desc    Get advertiser notifications
 * @access  Private (Advertiser)
 */
router.get('/notifications', advertiserController.getNotifications);

/**
 * @route   PUT /api/advertiser/notifications/:id/read
 * @desc    Mark notification as read
 * @access  Private (Advertiser)
 */
router.put('/notifications/:id/read', advertiserController.markNotificationAsRead);

/**
 * @route   PUT /api/advertiser/notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Private (Advertiser)
 */
router.put('/notifications/read-all', advertiserController.markAllNotificationsAsRead);

/**
 * Campaign Management Routes
 */

/**
 * @route   GET /api/advertiser/campaigns
 * @desc    Get all campaigns for advertiser
 * @access  Private (Advertiser)
 */
router.get('/campaigns', advertiserController.getCampaigns);

/**
 * @route   POST /api/advertiser/campaigns
 * @desc    Create a new campaign
 * @access  Private (Advertiser)
 */
router.post('/campaigns', advertiserController.createCampaign);

/**
 * @route   GET /api/advertiser/campaigns/:id
 * @desc    Get campaign details by ID
 * @access  Private (Advertiser)
 */
router.get('/campaigns/:id', advertiserController.getCampaignById);

/**
 * @route   PUT /api/advertiser/campaigns/:id
 * @desc    Update campaign details
 * @access  Private (Advertiser)
 */
router.put('/campaigns/:id', advertiserController.updateCampaign);

/**
 * @route   PUT /api/advertiser/campaigns/:id/status
 * @desc    Update campaign status (active/paused/completed)
 * @access  Private (Advertiser)
 */
router.put('/campaigns/:id/status', advertiserController.updateCampaignStatus);

/**
 * @route   DELETE /api/advertiser/campaigns/:id
 * @desc    Delete a campaign
 * @access  Private (Advertiser)
 */
router.delete('/campaigns/:id', advertiserController.deleteCampaign);

/**
 * @route   GET /api/advertiser/campaigns/:id/performance
 * @desc    Get campaign performance metrics
 * @access  Private (Advertiser)
 */
router.get('/campaigns/:id/performance', advertiserController.getCampaignPerformance);

/**
 * Ad Management Routes
 */

/**
 * @route   GET /api/advertiser/ads
 * @desc    Get all ads for advertiser
 * @access  Private (Advertiser)
 */
router.get('/ads', advertiserController.getAds);

/**
 * @route   POST /api/advertiser/campaigns/:campaignId/ads
 * @desc    Create a new ad for a campaign
 * @access  Private (Advertiser)
 */
router.post('/campaigns/:campaignId/ads', uploadService.uploadAdMedia, advertiserController.createAd);

/**
 * @route   GET /api/advertiser/ads/:id
 * @desc    Get ad details by ID
 * @access  Private (Advertiser)
 */
router.get('/ads/:id', advertiserController.getAdById);

/**
 * @route   PUT /api/advertiser/ads/:id
 * @desc    Update ad details
 * @access  Private (Advertiser)
 */
router.put('/ads/:id', uploadService.uploadAdMedia, advertiserController.updateAd);

/**
 * @route   DELETE /api/advertiser/ads/:id
 * @desc    Delete an ad
 * @access  Private (Advertiser)
 */
router.delete('/ads/:id', advertiserController.deleteAd);

/**
 * @route   GET /api/advertiser/ads/:id/metrics
 * @desc    Get ad performance metrics
 * @access  Private (Advertiser)
 */
router.get('/ads/:id/metrics', advertiserController.getAdMetrics);

/**
 * Budget & Payment Routes
 */

/**
 * @route   GET /api/advertiser/payments
 * @desc    Get payment history
 * @access  Private (Advertiser)
 */
router.get('/payments', advertiserController.getPaymentHistory);

/**
 * @route   POST /api/advertiser/payments
 * @desc    Make a new payment
 * @access  Private (Advertiser)
 */
router.post('/payments', advertiserController.makePayment);

/**
 * @route   GET /api/advertiser/budget
 * @desc    Get overall budget overview
 * @access  Private (Advertiser)
 */
router.get('/budget', advertiserController.getBudgetOverview);

/**
 * @route   GET /api/advertiser/budget/:campaignId
 * @desc    Get budget details for a specific campaign
 * @access  Private (Advertiser)
 */
router.get('/budget/:campaignId', advertiserController.getCampaignBudgetDetails);

/**
 * Analytics & Reporting Routes
 */

/**
 * @route   GET /api/advertiser/analytics/overview
 * @desc    Get analytics overview
 * @access  Private (Advertiser)
 */
router.get('/analytics/overview', advertiserController.getAnalyticsOverview);

/**
 * @route   GET /api/advertiser/analytics/impressions
 * @desc    Get impression analytics
 * @access  Private (Advertiser)
 */
router.get('/analytics/impressions', advertiserController.getImpressionAnalytics);

/**
 * @route   GET /api/advertiser/analytics/performance
 * @desc    Get performance analytics
 * @access  Private (Advertiser)
 */
router.get('/analytics/performance', advertiserController.getPerformanceAnalytics);

/**
 * @route   GET /api/advertiser/reports
 * @desc    Generate reports
 * @access  Private (Advertiser)
 */
router.get('/reports', advertiserController.generateReport);

/**
 * Profile Management Routes
 */

/**
 * @route   GET /api/advertiser/profile
 * @desc    Get advertiser profile
 * @access  Private (Advertiser)
 */
router.get('/profile', advertiserController.getProfile);

/**
 * @route   PUT /api/advertiser/profile
 * @desc    Update advertiser profile
 * @access  Private (Advertiser)
 */
router.put('/profile', advertiserController.updateProfile);

module.exports = router;