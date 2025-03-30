// backend/routes/agent.js
const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');
const { verifyToken, authorizeRole } = require('../config/auth');

// Apply middleware to all routes to ensure only authenticated agents can access
router.use(verifyToken);
router.use(authorizeRole('agent'));

// Agent dashboard
router.get('/dashboard', agentController.getDashboard);

// Merchant management
router.get('/merchants', agentController.getMerchants);
router.post('/merchants', agentController.createMerchant);
router.get('/merchants/:id', agentController.getMerchantById);
router.put('/merchants/:id', agentController.updateMerchant);
router.put('/merchants/:id/approval', agentController.updateMerchantApprovalStatus);

// QR code management
router.get('/qr-codes', agentController.getQRCodes);
router.post('/qr-codes/:merchantId', agentController.generateQRCode);
router.put('/qr-codes/:id', agentController.updateQRCodeStatus);
router.delete('/qr-codes/:id', agentController.deleteQRCode);

// Commission tracking
router.get('/commissions', agentController.getCommissions);
router.get('/commissions/summary', agentController.getCommissionSummary);
router.get('/commissions/:id', agentController.getCommissionDetails);

// Performance metrics
router.get('/performance', agentController.getPerformanceMetrics);
router.get('/merchants-stats', agentController.getMerchantsStatistics);

// Profile management
router.get('/profile', agentController.getProfile);
router.put('/profile', agentController.updateProfile);

// Notifications specific to agents
router.get('/notifications', agentController.getNotifications);
router.put('/notifications/:id/read', agentController.markNotificationAsRead);
router.put('/notifications/read-all', agentController.markAllNotificationsAsRead);

module.exports = router;