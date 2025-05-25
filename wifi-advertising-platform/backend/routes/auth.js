// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../config/auth');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: User registration
 *     description: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - first_name
 *               - last_name
 *               - role
 *               - phone
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, agent, advertiser, merchant]
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Registration successful
 *       400:
 *         description: Registration failed
 */
/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and returns a JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   type: object
 *       401:
 *         description: Invalid credentials
 */
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
 * @swagger
 * /api/auth/logout:
 *   get:
 *     summary: User logout
 *     description: Logs out the user on the client-side by clearing the token
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logout successful
 */
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

// Email verification
router.get('/verify-email/:token', authController.verifyEmail);

// Refresh token
router.post('/refresh-token', authController.refreshToken);

// Register role
router.post('/register-role', authController.registerRole);

module.exports = router;