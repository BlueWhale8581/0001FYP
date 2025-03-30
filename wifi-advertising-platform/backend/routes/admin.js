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
 * @route   GET /api/admin/dashboard
 * @desc    Get admin dashboard data
 * @access  Private (Admin)
 */
router.get('/dashboard', adminController.getDashboard);

/**
 * User Management Routes
 */

/**
 * @route   GET /api/admin/users
 * @desc    Get list of all users with filtering and pagination
 * @access  Private (Admin)
 */
router.get('/users', adminController.getUsers);

/**
 * @route   POST /api/admin/users
 * @desc    Create a new user
 * @access  Private (Admin)
 */
router.post('/users', adminController.createUser);

/**
 * @route   GET /api/admin/users/:id
 * @desc    Get a specific user's details
 * @access  Private (Admin)
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
router.put('/users/:id/status', adminController.updateUserStatus);

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
 * @route   GET /api/admin/transactions
 * @desc    Get transaction history with filtering and pagination
 * @access  Private (Admin)
 */
router.get('/transactions', adminController.getTransactions);

/**
 * @route   GET /api/admin/transactions/:id
 * @desc    Get transaction details
 * @access  Private (Admin)
 */
router.get('/transactions/:id', adminController.getTransactionById);

/**
 * @route   PUT /api/admin/transactions/:id
 * @desc    Update transaction status
 * @access  Private (Admin)
 */
router.put('/transactions/:id', adminController.updateTransactionStatus);

/**
 * Reporting & Analytics Routes
 */

/**
 * @route   GET /api/admin/reports/revenue
 * @desc    Generate revenue report
 * @access  Private (Admin)
 */
router.get('/reports/revenue', adminController.getRevenueReport);

/**
 * @route   GET /api/admin/reports/ad-performance
 * @desc    Generate ad performance report
 * @access  Private (Admin)
 */
router.get('/reports/ad-performance', adminController.getAdPerformanceReport);

/**
 * @route   GET /api/admin/reports/wifi-usage
 * @desc    Generate WiFi usage report
 * @access  Private (Admin)
 */
router.get('/reports/wifi-usage', adminController.getWiFiUsageReport);

/**
 * @route   GET /api/admin/reports/agents
 * @desc    Generate agent performance report
 * @access  Private (Admin)
 */
router.get('/reports/agents', adminController.getAgentPerformanceReport);

/**
 * @route   GET /api/admin/reports/system
 * @desc    Generate system summary report
 * @access  Private (Admin)
 */
router.get('/reports/system', adminController.getSystemSummaryReport);

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
 * @route   PUT /api/admin/system-settings/:key
 * @desc    Update a specific system setting
 * @access  Private (Admin)
 */
router.put('/system-settings/:key', adminController.updateSystemSetting);

/**
 * @route   GET /api/admin/merchants
 * @desc    Get all merchants with filtering
 * @access  Private (Admin)
 */
router.get('/merchants', adminController.getMerchants);

/**
 * @route   PUT /api/admin/merchants/:id/approval
 * @desc    Update merchant approval status
 * @access  Private (Admin)
 */
router.put('/merchants/:id/approval', adminController.updateMerchantApproval);

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