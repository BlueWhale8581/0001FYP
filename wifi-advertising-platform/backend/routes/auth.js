// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../config/auth');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and get token
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset via email
 * @access  Public
 */
router.post('/forgot-password', authController.forgotPassword);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password', authController.resetPassword);

/**
 * @route   POST /api/auth/change-password
 * @desc    Change password (requires authentication)
 * @access  Private
 */
router.post('/change-password', verifyToken, authController.changePassword);

/**
 * @route   GET /api/auth/verify-token
 * @desc    Verify if token is valid
 * @access  Private
 */
router.get('/verify-token', verifyToken, authController.verifyToken);

/**
 * @route   GET /api/auth/logout
 * @desc    Logout user (client-side only, invalidates token on client)
 * @access  Public
 */
router.get('/logout', (req, res) => {
  // No server-side logout needed for JWT tokens
  // Client should remove token from storage
  res.status(200).json({ success: true, message: 'Logout successful' });
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user's data
 * @access  Private
 */
router.get('/me', verifyToken, authController.getCurrentUser);

module.exports = router;