// backend/routes/public.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../config/auth');

/**
 * Wi-Fi Access Routes - No authentication required
 */

/**
 * @route   GET /api/public/wifi/:qrCodeId
 * @desc    Get Wi-Fi details based on merchant QR code
 * @access  Public
 */
router.get('/wifi/:qrCodeId', userController.getWiFiDetails);

/**
 * @route   POST /api/public/wifi/connect/:merchantId
 * @desc    Connect to merchant Wi-Fi
 * @access  Public
 */
router.post('/wifi/connect/:merchantId', userController.connectToWiFi);

/**
 * @route   POST /api/public/wifi/ad/start/:sessionId/:adId
 * @desc    Track when an ad starts playing
 * @access  Public
 */
router.post('/wifi/ad/start/:sessionId/:adId', userController.trackAdView);

/**
 * @route   POST /api/public/wifi/ad/complete/:sessionId/:adId
 * @desc    Mark ad as completely viewed
 * @access  Public
 */
router.post('/wifi/ad/complete/:sessionId/:adId', userController.completeAdView);

/**
 * @route   GET /api/public/wifi/redirect/:sessionId
 * @desc    Redirect user after viewing all required ads
 * @access  Public
 */
router.get('/wifi/redirect/:sessionId', userController.redirectAfterAds);

/**
 * @route   GET /api/public/ads/:merchantId
 * @desc    Get ads that need to be viewed
 * @access  Public
 */
router.get('/ads/:merchantId', userController.getAdsToView);

/**
 * @route   POST /api/public/ads/impression/:adId/:merchantId
 * @desc    Record an ad impression without being connected to Wi-Fi
 * @access  Public
 */
router.post('/ads/impression/:adId/:merchantId', userController.recordAdImpression);

/**
 * Registration Routes - No authentication required
 */

/**
 * @route   POST /api/public/register/advertiser
 * @desc    Register as an advertiser
 * @access  Public
 */
router.post('/register/advertiser', userController.registerAsAdvertiser);

/**
 * @route   POST /api/public/register/merchant
 * @desc    Register as a merchant
 * @access  Public
 */
router.post('/register/merchant', userController.registerAsMerchant);

/**
 * @route   POST /api/public/register/agent
 * @desc    Register as an agent
 * @access  Public
 */
router.post('/register/agent', userController.registerAsAgent);

module.exports = router;