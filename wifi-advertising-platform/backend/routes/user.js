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
 * @swagger
 * /api/user/dashboard:
 *   get:
 *     summary: Get user dashboard data
 *     description: Fetches dashboard data for the logged-in user.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully.
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
/**
 * @route   GET /api/user/dashboard
 * @desc    Get user dashboard data
 * @access  Private (Any logged in user)
 **/
router.get('/dashboard', userController.getDashboard);

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get user profile
 *     description: Fetches the profile information of the logged-in user.
 *     tags: [User]
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
/**
 * @route   GET /api/user/profile
 * @desc    Get user profile information
 * @access  Private (Any logged in user)
 **/
router.get('/profile', userController.getUserProfile);

/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     summary: Update user profile
 *     description: Updates the profile information of the logged-in user.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 profile:
 *                   type: object
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
 */
/**
 * @route   PUT /api/user/profile
 * @desc    Update user profile information
 * @access  Private (Any logged in user)
 **/
router.put('/profile', userController.updateUserProfile);

/**
 * @swagger
 * /api/user/password:
 *   put:
 *     summary: Change user password
 *     description: Allows the logged-in user to change their password.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       400:
 *         description: Invalid input or incorrect old password.
 *       401:
 *         description: Unauthorized.
 */
/**
 * @route   PUT /api/user/password
 * @desc    Change user password
 * @access  Private (Any logged in user)
 **/
router.put('/password', userController.changePassword);

/**
 * Notification Routes
 */

/**
 * @swagger
 * /api/user/notifications:
 *   get:
 *     summary: Get user notifications
 *     description: Fetches all notifications for the logged-in user.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 notifications:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized.
 */
/**
 * @route   GET /api/user/notifications
 * @desc    Get user notifications
 * @access  Private (Any logged in user)
 **/
router.get('/notifications', userController.getUserNotifications);

/**
 * @swagger
 * /api/user/notifications/{id}/read:
 *   put:
 *     summary: Mark notification as read
 *     description: Marks a specific notification as read.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the notification.
 *     responses:
 *       200:
 *         description: Notification marked as read successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       404:
 *         description: Notification not found.
 *       401:
 *         description: Unauthorized.
 */
/**
 * @route   PUT /api/user/notifications/:id/read
 * @desc    Mark a notification as read
 * @access  Private (Any logged in user)
 **/
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
 * @swagger
 * /api/user/transactions:
 *   get:
 *     summary: Get user transaction history
 *     description: Fetches the transaction history for the logged-in user.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
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
/**
 * @route   GET /api/user/transactions
 * @desc    Get user transaction history
 * @access  Private (Any logged in user)
 **/
router.get('/transactions', userController.getUserTransactions);

/**
 * @swagger
 * /api/user/transactions/{id}:
 *   get:
 *     summary: Get transaction details
 *     description: Fetches details of a specific transaction by ID.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the transaction.
 *     responses:
 *       200:
 *         description: Transaction details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 transaction:
 *                   type: object
 *       404:
 *         description: Transaction not found.
 *       401:
 *         description: Unauthorized.
 */
/**
 * @route   GET /api/user/transactions/:id
 * @desc    Get transaction details by ID
 * @access  Private (Any logged in user)
 **/
router.get('/transactions/:id', userController.getTransactionDetails);

module.exports = router;