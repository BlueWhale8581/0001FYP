// backend/routes/agent.js
const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');
const { verifyToken, authorizeRole } = require('../config/auth');

// Apply middleware to all agent routes
router.use(verifyToken);
router.use(authorizeRole('agent'));

/**
 * Dashboard Routes
 */

/**
 * @route   GET /api/agent/dashboard/stats
 * @desc    Get dashboard statistics for the agent
 * @access  Private (Agent)
 */
router.get('/dashboard/stats', agentController.getDashboardStats);

/**
 * @route   GET /api/agent/notifications
 * @desc    Get agent notifications
 * @access  Private (Agent)
 */
router.get('/notifications', agentController.getAgentNotifications);

/**
 * @route   PUT /api/agent/notifications/:notificationId/read
 * @desc    Mark notification as read
 * @access  Private (Agent)
 */
router.put('/notifications/:notificationId/read', agentController.markNotificationAsRead);

/**
 * Merchant Management Routes
 */

/**
 * @route   GET /api/agent/merchants
 * @desc    Get all merchants onboarded by agent
 * @access  Private (Agent)
 */
router.get('/merchants', agentController.getAllMerchants);

/**
 * @route   GET /api/agent/merchants/onboarded
 * @desc    Get merchants onboarded by agent
 * @access  Private (Agent)
 */
router.get('/merchants/onboarded', agentController.getMerchantsOnboarded);

/**
 * @route   GET /api/agent/merchants/:merchantId
 * @desc    Get merchant by ID
 * @access  Private (Agent)
 */
router.get('/merchants/:merchantId', agentController.getMerchantById);

/**
 * @route   POST /api/agent/merchants
 * @desc    Register a new merchant
 * @access  Private (Agent)
 */
router.post('/merchants', agentController.registerMerchant);

/**
 * @route   PUT /api/agent/merchants/:merchantId
 * @desc    Update merchant details
 * @access  Private (Agent)
 */
router.put('/merchants/:merchantId', agentController.updateMerchant);

/**
 * @route   PUT /api/agent/merchants/:merchantId/approve
 * @desc    Approve merchant application
 * @access  Private (Agent)
 */
router.put('/merchants/:merchantId/approve', agentController.approveMerchantApplication);

/**
 * @route   PUT /api/agent/merchants/:merchantId/reject
 * @desc    Reject merchant application
 * @access  Private (Agent)
 */
router.put('/merchants/:merchantId/reject', agentController.rejectMerchantApplication);

/**
 * QR Code Management Routes
 */

/**
 * @route   GET /api/agent/qrcodes
 * @desc    Get all QR codes created by the agent
 * @access  Private (Agent)
 */
router.get('/qrcodes', agentController.getAllQRCodes);

/**
 * @route   GET /api/agent/merchants/:merchantId/qrcodes
 * @desc    Get QR codes by merchant
 * @access  Private (Agent)
 */
router.get('/merchants/:merchantId/qrcodes', agentController.getQRCodesByMerchant);

/**
 * @route   POST /api/agent/merchants/:merchantId/qrcodes
 * @desc    Generate QR code for merchant
 * @access  Private (Agent)
 */
router.post('/merchants/:merchantId/qrcodes', agentController.generateQRCode);

/**
 * @route   POST /api/agent/merchants/:merchantId/qrcodes/regenerate
 * @desc    Regenerate QR code for merchant
 * @access  Private (Agent)
 */
router.post('/merchants/:merchantId/qrcodes/regenerate', agentController.regenerateQRCode);

/**
 * @route   GET /api/agent/qrcodes/:qrCodeId/download
 * @desc    Download QR code
 * @access  Private (Agent)
 */
router.get('/qrcodes/:qrCodeId/download', agentController.downloadQRCode);

/**
 * Commission and Transaction Routes
 */

/**
 * @route   GET /api/agent/commissions
 * @desc    Get commissions for the agent
 * @access  Private (Agent)
 */
router.get('/commissions', agentController.getCommissions);

/**
 * @route   GET /api/agent/commissions/report
 * @desc    Get commission reports
 * @access  Private (Agent)
 */
router.get('/commissions/report', agentController.getCommissionReports);

/**
 * @route   GET /api/agent/commissions/period
 * @desc    Get commission by period
 * @access  Private (Agent)
 */
router.get('/commissions/period', agentController.getCommissionByPeriod);

/**
 * @route   GET /api/agent/transactions
 * @desc    Get transaction history
 * @access  Private (Agent)
 */
router.get('/transactions', agentController.getTransactionHistory);

/**
 * @route   GET /api/agent/earnings
 * @desc    Get earnings summary
 * @access  Private (Agent)
 */
router.get('/earnings', agentController.getEarningsSummary);

/**
 * Profile Management Routes
 */

/**
 * @route   GET /api/agent/profile
 * @desc    Get agent profile
 * @access  Private (Agent)
 */
router.get('/profile', agentController.getAgentProfile);

/**
 * @route   PUT /api/agent/profile
 * @desc    Update agent profile
 * @access  Private (Agent)
 */
router.put('/profile', agentController.updateAgentProfile);

/**
 * Help Resources
 */

/**
 * @route   GET /api/agent/help
 * @desc    Get help resources
 * @access  Private (Agent)
 */
router.get('/help', agentController.getHelpResources);

module.exports = router;