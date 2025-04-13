// backend/routes/user.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../config/auth');

// Apply authentication middleware to all user routes
router.use(verifyToken);

/**
 * Dashboard Routes
 */

/**
 * @route   GET /api/user/dashboard
 * @desc    Get user dashboard data
 * @access  Private (Any logged in user)
 */
router.get('/dashboard', userController.getDashboard);

/**
 * @route   GET /api/user/profile
 * @desc    Get user profile information
 * @access  Private (Any logged in user)
 */
router.get('/profile', userController.getUserProfile);

/**
 * @route   PUT /api/user/profile
 * @desc    Update user profile information
 * @access  Private (Any logged in user)
 */
router.put('/profile', userController.updateUserProfile);

/**
 * @route   PUT /api/user/password
 * @desc    Change user password
 * @access  Private (Any logged in user)
 */
router.put('/password', userController.changePassword);

/**
 * Notification Routes
 */

/**
 * @route   GET /api/user/notifications
 * @desc    Get user notifications
 * @access  Private (Any logged in user)
 */
router.get('/notifications', userController.getUserNotifications);

/**
 * @route   PUT /api/user/notifications/:id/read
 * @desc    Mark notification as read
 * @access  Private (Any logged in user)
 */
router.put('/notifications/:id/read', userController.markNotificationRead);

/**
 * @route   PUT /api/user/notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Private (Any logged in user)
 */
router.put('/notifications/read-all', userController.markAllNotificationsRead);

/**
 * @route   DELETE /api/user/notifications/:id
 * @desc    Delete a notification
 * @access  Private (Any logged in user)
 */
router.delete('/notifications/:id', userController.deleteNotification);

/**
 * @route   PUT /api/user/settings
 * @desc    Update user settings and preferences
 * @access  Private (Any logged in user)
 */
router.put('/settings', userController.updateUserSettings);

/**
 * @route   POST /api/user/feedback
 * @desc    Submit user feedback
 * @access  Private (Any logged in user)
 */
router.post('/feedback', userController.submitFeedback);

/**
 * @route   GET /api/user/transactions
 * @desc    Get user transaction history
 * @access  Private (Any logged in user)
 */
router.get('/transactions', userController.getUserTransactions);

/**
 * @route   GET /api/user/transactions/:id
 * @desc    Get specific transaction details
 * @access  Private (Any logged in user)
 */
router.get('/transactions/:id', userController.getTransactionDetails);

module.exports = router;