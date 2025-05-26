// backend/routes/public.js
const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');
const { verifyToken } = require('../config/auth');

/**
 * Wi-Fi Access Routes - No authentication required
 */

/**
 * @swagger
 * /public/wifi/{qrCodeId}:
 *   get:
 *     summary: Get Wi-Fi details based on QR code
 *     parameters:
 *       - in: path
 *         name: qrCodeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The QR code ID
 *     responses:
 *       200:
 *         description: Wi-Fi details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     wifiDetails:
 *                       type: object
 *                       properties:
 *                         ssid:
 *                           type: string
 *                         networkSpeed:
 *                           type: string
 *                     deviceInfo:
 *                       type: object
 *                       properties:
 *                         userAgent:
 *                           type: string
 *                         ipAddress:
 *                           type: string
 *       500:
 *         description: Failed to retrieve Wi-Fi details
 */
router.get('/wifi/:qrCodeId', publicController.getWiFiDetails);

/**
 * @route   POST /api/public/wifi/connect/:merchantId
 * @desc    Connect to merchant Wi-Fi
 * @access  Public
 */
router.post('/wifi/connect/:merchantId', publicController.connectToWiFi);

/**
 * @route   POST /api/public/wifi/ad/start/:sessionId/:adId
 * @desc    Track ad start
 * @access  Public
 */
router.post('/wifi/ad/start/:sessionId/:adId', publicController.trackAdView);

/**
 * @route   POST /api/public/wifi/ad/complete/:sessionId/:adId
 * @desc    Mark ad as completed
 * @access  Public
 */
router.post('/wifi/ad/complete/:sessionId/:adId', publicController.completeAdView);

/**
 * @route   GET /api/public/wifi/redirect/:sessionId
 * @desc    Redirect user after viewing all required ads
 * @access  Public
 */
router.get('/wifi/redirect/:sessionId', publicController.redirectAfterAds);

/**
 * @route   GET /api/public/ads/:merchantId
 * @desc    Get ads that need to be viewed
 * @access  Public
 */
router.get('/ads/:merchantId', publicController.getAdsToView);

/**
 * @route   POST /api/public/ads/impression/:adId/:merchantId
 * @desc    Record an ad impression without being connected to Wi-Fi
 * @access  Public
 */
router.post('/ads/impression/:adId/:merchantId', publicController.recordAdImpression);

/**
 * @route   POST /api/demo/qrcodes/create
 * @desc    Generate a demo QR code with custom SSID and password
 * @access  Public
 */
router.post('/demo/qrcodes/create', require('../controllers/publicController').demoGenerateQRCode);

router.get('/demo/merchants', publicController.getMerchants);

module.exports = router;