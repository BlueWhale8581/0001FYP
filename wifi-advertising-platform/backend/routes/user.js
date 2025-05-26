// backend/routes/user.js
const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');
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
router.get('/dashboard', publicController.getDashboard);
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
router.get('/profile', publicController.getUserProfile);
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
 *               first_name:
 *                 type: string
 *               last_name:
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
router.put('/profile', publicController.updateUserProfile);
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
router.put('/password', publicController.changePassword);

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
router.get('/notifications', publicController.getUserNotifications);
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
router.put('/notifications/:id/read', publicController.markNotificationRead);
/**
 * @route   PUT /api/user/notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Private (Any logged in user)
 */
router.put('/notifications/read-all', publicController.markAllNotificationsRead);
/**
 * @route   DELETE /api/user/notifications/:id
 * @desc    Delete a notification
 * @access  Private (Any logged in user)
 */
router.delete('/notifications/:id', publicController.deleteNotification);
/**
 * @route   PUT /api/user/settings
 * @desc    Update user settings and preferences
 * @access  Private (Any logged in user)
 */
router.put('/settings', publicController.updateUserSettings);
/**
 * @route   POST /api/user/feedback
 * @desc    Submit user feedback
 * @access  Private (Any logged in user)
 */
router.post('/feedback', publicController.submitFeedback);
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
router.get('/transactions', publicController.getUserTransactions);
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
router.get('/transactions/:id', publicController.getTransactionDetails);

/**
 * @route   POST /api/user/check-role
 * @desc    Check and insert role data
 * @access  Private (Any logged in user)
 */
router.post('/check-role', async (req, res) => {
  const { userId, role } = req.body;

  try {
    if (role === 'agent') {
      const agentExists = await Agent.findById(userId);
      if (!agentExists) {
        await Agent.create({
          id: userId,
          commission_rate: 0.5,
          territory: 'Malaysia',
        });
      }
    } else if (role === 'advertiser') {
      const advertiserExists = await Advertiser.findById(userId);
      if (!advertiserExists) {
        return res.status(200).json({ success: false, message: 'Advertiser details required' });
      }
    } else if (role === 'merchant') {
      const merchantExists = await Merchant.findById(userId);
      if (!merchantExists) {
        return res.status(200).json({ success: false, message: 'Merchant details required' });
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error checking role:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;