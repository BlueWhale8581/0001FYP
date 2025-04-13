// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, authorizeRole } = require('../config/auth');

// Apply middleware to all admin routes
router.use(verifyToken);
router.use(authorizeRole('admin'));

/**
 * Dashboard Routes
 */

/**
 * @swagger
 * /api/admin/dashboard/stats:
 *   get:
 *     summary: Get admin dashboard data
 *     description: Fetches key statistics for the admin dashboard.
 *     tags: [Admin]
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
router.get('/dashboard/stats', adminController.getDashboardStats);

/**
 * @swagger
 * /api/admin/dashboard/metrics:
 *   get:
 *     summary: Get system metrics
 *     description: Fetches system performance metrics for the admin dashboard.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System metrics retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 metrics:
 *                   type: object
 *       401:
 *         description: Unauthorized.
 */
router.get('/dashboard/metrics', adminController.getSystemMetrics);

/**
 * @route   GET /api/admin/notification
 * @desc    Get admin notification
 * @access  Private (Admin)
 */
router.get('/notifications', adminController.getNotifications);

/**
 * @route   GET /api/admin/alerts
 * @desc    Get system alerts
 * @access  Private (Admin)
 */
router.get('/alerts', adminController.getAlerts);

/**
 * User Management Routes
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get list of all users
 *     description: Fetches a paginated list of all users with optional filters.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of users per page.
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filter users by role.
 *     responses:
 *       200:
 *         description: List of users retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized.
 */
router.get('/users', adminController.getAllUsers);

/**
 * @route   POST /api/admin/users
 * @desc    Create a new user
 * @access  Private (Admin)
 */
router.post('/users', adminController.createUser);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: Get user details
 *     description: Fetches details of a specific user by ID.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user.
 *     responses:
 *       200:
 *         description: User details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   type: object
 *       404:
 *         description: User not found.
 *       401:
 *         description: Unauthorized.
 */
router.get('/users/:id', adminController.getUserById);

/**
 * @route   PUT /api/admin/users/:id
 * @desc    Update user info
 * @access  Private (Admin)
 */
router.put('/users/:id', adminController.updateUser);

/**
 * @route   PUT /api/admin/users/:id/status
 * @desc    Change user status (active/inactive/suspended)
 * @access  Private (Admin)
 */
router.put('/users/:id/status', adminController.changeUserStatus);

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete a user
 * @access  Private (Admin)
 */
router.delete('/users/:id', adminController.deleteUser);

/**
 * Revenue Management Routes
 */

/**
 * @swagger
 * /api/admin/transactions:
 *   get:
 *     summary: Get transaction history
 *     description: Fetches a paginated list of transactions with optional filters.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of transactions per page.
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter transactions by status.
 *     responses:
 *       200:
 *         description: Transaction history retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 transactions:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized.
 */
router.get('/transactions', adminController.getTransactions);

/**
 * @route   GET /api/admin/transactions/:id
 * @desc    Get transaction details
 * @access  Private (Admin)
 */
router.get('/transactions/:id', adminController.getTransactionById);

/**
 * @route   PUT /api/admin/transactions/:id/approve
 * @desc    Approve transaction
 * @access  Private (Admin)
 */
router.put('/transactions/:id/approve', adminController.approveTransaction);

/**
 * @route   PUT /api/admin/transactions/:id/reject
 * @desc    Reject transaction
 * @access  Private (Admin)
 */
router.put('/transactions/:id/reject', adminController.rejectTransaction);

/**
 * @route   PUT /api/admin/revenue/overview
 * @desc    Get revenue overview
 * @access  Private (Admin)
 */
router.put('/revenue/overview', adminController.getRevenueOverview);

/**
 * Reporting & Analytics Routes
 */

/**
 * @swagger
 * /api/admin/reports/generate:
 *   get:
 *     summary: Generate system report
 *     description: Generates a detailed system report for the admin.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System report generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 report:
 *                   type: object
 *       401:
 *         description: Unauthorized.
 */
router.get('/reports/generate', adminController.generateSystemReport);

/**
 * @route   GET /api/admin/analytics
 * @desc    Generate system analytics
 * @access  Private (Admin)
 */
router.get('/analytics', adminController.getSystemAnalytics);

/**
 * @route   GET /api/admin/performance-metrics
 * @desc    Get performance metrics
 * @access  Private (Admin)
 */
router.get('/performance-metrics', adminController.getPerformanceMetrics);

/**
 * @route   GET /api/admin/reports/export
 * @desc    Export report data
 * @access  Private (Admin)
 */
router.get('/reports/export', adminController.exportReportData);

/**
 * System Management Routes
 */

/**
 * @route   GET /api/admin/audit-logs
 * @desc    View audit logs with filtering
 * @access  Private (Admin)
 */
router.get('/audit-logs', adminController.getAuditLogs);

/**
 * @route   GET /api/admin/audit-logs/:id
 * @desc    Get audit log details
 * @access  Private (Admin)
 */
router.get('/audit-logs/:id', adminController.getAuditLogById);

/**
 * @route   GET /api/admin/system-settings
 * @desc    Get all system settings
 * @access  Private (Admin)
 */
router.get('/system-settings', adminController.getSystemSettings);

/**
 * @route   PUT /api/admin/system-settings
 * @desc    Update system settings (bulk)
 * @access  Private (Admin)
 */
router.put('/system-settings', adminController.updateSystemSettings);

/**
 * @route   GET /api/admin/merchants
 * @desc    Get all merchants with filtering
 * @access  Private (Admin)
 */
router.get('/merchants', adminController.getMerchants);

/**
 * @route   GET /api/admin/advertisers
 * @desc    Get all advertisers with filtering
 * @access  Private (Admin)
 */
router.get('/advertisers', adminController.getAdvertisers);

/**
 * @route   GET /api/admin/agents
 * @desc    Get all agents with filtering
 * @access  Private (Admin)
 */
router.get('/agents', adminController.getAgents);

/**
 * @route   GET /api/admin/campaigns
 * @desc    Get all campaigns with filtering
 * @access  Private (Admin)
 */
router.get('/campaigns', adminController.getCampaigns);

module.exports = router;