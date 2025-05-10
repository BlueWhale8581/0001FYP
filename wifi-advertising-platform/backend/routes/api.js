const express = require('express');
const router = express.Router();

// Import route handlers
const authRoutes = require('./auth');
const adminRoutes = require('./admin');
const advertiserRoutes = require('./advertiser');
const agentRoutes = require('./agent');
const merchantRoutes = require('./merchant');
const publicRoutes = require('./public');
const userRoutes = require('./user');
const roleRegisterRoutes = require('./roleRegister');

// Authentication Routes
router.use('/auth', authRoutes);
router.use('/register', roleRegisterRoutes);

// Admin Routes
router.use('/admin', adminRoutes);

// Advertiser Routes
router.use('/advertiser', advertiserRoutes);

// Agent Routes
router.use('/agent', agentRoutes);

// Merchant Routes
router.use('/merchant', merchantRoutes);

// Public Routes (No Authentication Required)
router.use('/public', publicRoutes);

// User Routes (Authentication Required)
router.use('/user', userRoutes);

module.exports = router;