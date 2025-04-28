const express = require('express');
const router = express.Router();

// Import route handlers
const authRoutes = require('./authRoutes');
const adminRoutes = require('./adminRoutes');
const advertiserRoutes = require('./advertiserRoutes');
const agentRoutes = require('./agentRoutes');
const merchantRoutes = require('./merchantRoutes');
const publicRoutes = require('./publicRoutes');
const userRoutes = require('./userRoutes');

// Authentication Routes
router.use('/auth', authRoutes);

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