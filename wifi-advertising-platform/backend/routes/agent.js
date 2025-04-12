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
 * @route   GET /api/admin/dashboard/stats
 * @desc    Get admin dashboard data
 * @access  Private (Admin)
 */
router.get('/dashboard/stats', adminController.getDashboardStats);

/**
 * @route   GET /api/admin/dashboard/metrics
 * @desc    Get system metrics
 * @access  Private (Admin)
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
 * @route   GET /api/admin/users
 * @desc    Get list of all users with filtering and pagination
 * @access  Private (Admin)
 */
router.get('/users', adminController.getAllUsers);

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
 * @route   GET /api/admin/reports/generate
 * @desc    Generate system report
 * @access  Private (Admin)
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