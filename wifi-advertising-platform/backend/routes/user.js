const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { verifyToken } = require('../config/auth');

// Apply authentication middleware to all user routes
router.use(verifyToken);

// User profile routes
router.get('/profile', userController.getUserProfile);
router.put('/profile', userController.updateUserProfile);

// Notification routes
router.get('/notifications', userController.getUserNotifications);
router.put('/notifications/:id', userController.markNotificationAsRead);
router.put('/notifications/read-all', userController.markAllNotificationsAsRead);
router.delete('/notifications/:id', userController.deleteNotification);

// WiFi sessions for authenticated users
router.get('/wifi-sessions', userController.getUserWiFiSessions);

// WiFi connection for authenticated users (with additional user data)
router.post('/wifi-connect', userController.connectToWiFi);

// Ad viewing for authenticated users
router.post('/ad-view', userController.recordAdView);

// Password change (requires authentication)
router.post('/change-password', authController.changePassword);

// Get user dashboard data (based on role)
router.get('/dashboard', userController.getUserDashboard);

module.exports = router;