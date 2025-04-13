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
/**
 * @swagger
 * /api/agent/dashboard/stats:
 *   get:
 *     summary: Get agent dashboard statistics
 *     description: Fetches key statistics for the agent dashboard.
 *     tags: [Agent]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized.
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
/**
 * @swagger
 * /api/agent/merchants:
 *   get:
 *     summary: Get all merchants
 *     description: Fetches all merchants onboarded by the agent.
 *     tags: [Merchants]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Merchants retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 merchants:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized.
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
/**
 * @swagger
 * /api/agent/merchants/{merchantId}:
 *   get:
 *     summary: Get merchant details
 *     description: Fetches details of a specific merchant by ID.
 *     tags: [Merchants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the merchant.
 *     responses:
 *       200:
 *         description: Merchant details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 merchant:
 *                   type: object
 *       404:
 *         description: Merchant not found.
 *       401:
 *         description: Unauthorized.
 */
router.get('/merchants/:merchantId', agentController.getMerchantById);

/**
 * @route   POST /api/agent/merchants
 * @desc    Register a new merchant
 * @access  Private (Agent)
 */
/**
 * @swagger
 * /api/agent/merchants:
 *   post:
 *     summary: Register a new merchant
 *     description: Allows the agent to register a new merchant.
 *     tags: [Merchants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Merchant registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 merchant:
 *                   type: object
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
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
/**
 * @swagger
 * /api/agent/qrcodes:
 *   get:
 *     summary: Get all QR codes
 *     description: Fetches all QR codes created by the agent.
 *     tags: [QR Codes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: QR codes retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 qrcodes:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized.
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
/**
 * @swagger
 * /api/agent/commissions:
 *   get:
 *     summary: Get agent commissions
 *     description: Fetches the commission details for the agent.
 *     tags: [Commissions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Commissions retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 commissions:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized.
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
/**
 * @swagger
 * /api/agent/profile:
 *   get:
 *     summary: Get agent profile
 *     description: Fetches the profile information of the logged-in agent.
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 profile:
 *                   type: object
 *       401:
 *         description: Unauthorized.
 */
router.get('/profile', agentController.getAgentProfile);

/**
 * @route   PUT /api/agent/profile
 * @desc    Update agent profile
 * @access  Private (Agent)
 **/
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