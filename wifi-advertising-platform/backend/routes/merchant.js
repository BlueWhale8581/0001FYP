// backend/routes/merchant.js
const express = require('express');
const router = express.Router();
const merchantController = require('../controllers/merchantController');
const { verifyToken, authorizeRole } = require('../config/auth');
const uploadService = require('../services/uploadService');

// Apply middleware to all routes to ensure only authenticated merchants can access
router.use(verifyToken);
router.use(authorizeRole('merchant'));

// Merchant dashboard
router.get('/dashboard', merchantController.getDashboard);

// Profile management
router.get('/profile', merchantController.getProfile);
router.put('/profile', uploadService.uploadMerchantLogo, merchantController.updateProfile);

// WiFi service management
router.get('/wifi-settings', merchantController.getWiFiSettings);
router.put('/wifi-settings', merchantController.updateWiFiSettings);
router.get('/wifi-usage', merchantController.getWiFiUsage);
router.get('/wifi-usage/daily', merchantController.getDailyWiFiUsage);
router.get('/wifi-usage/current', merchantController.getCurrentConnections);
router.get('/wifi-sessions', merchantController.getWiFiSessions);

// QR Code management
router.get('/qr-codes', merchantController.getQRCodes);
router.get('/qr-codes/active', merchantController.getActiveQRCode);
router.get('/qr-codes/:id/download', merchantController.downloadQRCode);

// Revenue tracking
router.get('/revenue', merchantController.getRevenueOverview);
router.get('/revenue/details', merchantController.getRevenueDetails);
router.get('/revenue/monthly', merchantController.getMonthlyRevenue);
router.get('/transactions', merchantController.getTransactions);

// Ad impression data
router.get('/ad-impressions', merchantController.getAdImpressions);
router.get('/ad-impressions/summary', merchantController.getAdImpressionsSummary);
router.get('/ad-impressions/daily', merchantController.getDailyAdImpressions);

// Analytics
router.get('/analytics/overview', merchantController.getAnalyticsOverview);
router.get('/analytics/customer-insights', merchantController.getCustomerInsights);
router.get('/analytics/peak-hours', merchantController.getPeakHoursAnalysis);

// Agent information (for the merchant to see their agent details)
router.get('/agent', merchantController.getAgentInfo);

// Notifications specific to merchants
router.get('/notifications', merchantController.getNotifications);
router.put('/notifications/:id/read', merchantController.markNotificationAsRead);
router.put('/notifications/read-all', merchantController.markAllNotificationsAsRead);

module.exports = router;