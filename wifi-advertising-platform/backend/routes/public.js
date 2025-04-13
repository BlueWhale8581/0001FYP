// backend/routes/public.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../config/auth');

/**
 * Wi-Fi Access Routes - No authentication required
 */

/**
 * @swagger
 * /api/public/wifi/{qrCodeId}:
 *   get:
 *     summary: Get Wi-Fi details
 *     description: Fetches Wi-Fi details based on the merchant's QR code.
 *     tags: [Wi-Fi]
 *     parameters:
 *       - in: path
 *         name: qrCodeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The QR code ID of the merchant.
 *     responses:
 *       200:
 *         description: Wi-Fi details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 wifiDetails:
 *                   type: object
 *       404:
 *         description: QR code not found.
 */
/**
 * @route   GET /api/public/wifi/:qrCodeId
 * @desc    Get Wi-Fi details based on QR code
 * @access  Public
 **/
router.get('/wifi/:qrCodeId', userController.getWiFiDetails);

/**
 * @swagger
 * /api/public/wifi/connect/{merchantId}:
 *   post:
 *     summary: Connect to merchant Wi-Fi
 *     description: Allows a user to connect to a merchant's Wi-Fi.
 *     tags: [Wi-Fi]
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the merchant.
 *     responses:
 *       200:
 *         description: Connected to Wi-Fi successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       400:
 *         description: Connection failed.
 */
/**
 * @route   POST /api/public/wifi/connect/:merchantId
 * @desc    Connect to merchant Wi-Fi
 * @access  Public
 **/
router.post('/wifi/connect/:merchantId', userController.connectToWiFi);

/**
 * @swagger
 * /api/public/wifi/ad/start/{sessionId}/{adId}:
 *   post:
 *     summary: Track ad start
 *     description: Tracks when an ad starts playing during a Wi-Fi session.
 *     tags: [Ads]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The session ID of the Wi-Fi connection.
 *       - in: path
 *         name: adId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the ad.
 *     responses:
 *       200:
 *         description: Ad start tracked successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       404:
 *         description: Ad or session not found.
 */
/**
 * @route   POST /api/public/wifi/ad/start/:sessionId/:adId
 * @desc    Track ad start
 * @access  Public
 **/
router.post('/wifi/ad/start/:sessionId/:adId', userController.trackAdView);

/**
 * @swagger
 * /api/public/wifi/ad/complete/{sessionId}/{adId}:
 *   post:
 *     summary: Mark ad as completed
 *     description: Marks an ad as completely viewed during a Wi-Fi session.
 *     tags: [Ads]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The session ID of the Wi-Fi connection.
 *       - in: path
 *         name: adId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the ad.
 *     responses:
 *       200:
 *         description: Ad marked as completed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       404:
 *         description: Ad or session not found.
 */
/**
 * @route   POST /api/public/wifi/ad/complete/:sessionId/:adId
 * @desc    Mark ad as completed
 * @access  Public
 **/
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
 * @swagger
 * /api/public/register/advertiser:
 *   post:
 *     summary: Register as an advertiser
 *     description: Allows a user to register as an advertiser.
 *     tags: [Registration]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: Advertiser registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 advertiser:
 *                   type: object
 *       400:
 *         description: Invalid input.
 */
/**
 * @route   POST /api/public/register/advertiser
 * @desc    Register as an advertiser
 * @access  Public
 **/
router.post('/register/advertiser', userController.registerAsAdvertiser);

/**
 * @swagger
 * /api/public/register/merchant:
 *   post:
 *     summary: Register as a merchant
 *     description: Allows a user to register as a merchant.
 *     tags: [Registration]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: Merchant registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 merchant:
 *                   type: object
 *       400:
 *         description: Invalid input.
 */
/**
 * @route   POST /api/public/register/merchant
 * @desc    Register as a merchant
 * @access  Public
 **/
router.post('/register/merchant', userController.registerAsMerchant);

/**
 * @swagger
 * /api/public/register/agent:
 *   post:
 *     summary: Register as an agent
 *     description: Allows a user to register as an agent.
 *     tags: [Registration]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: Agent registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 agent:
 *                   type: object
 *       400:
 *         description: Invalid input.
 */
/**
 * @route   POST /api/public/register/agent
 * @desc    Register as an agent
 * @access  Public
 **/
router.post('/register/agent', userController.registerAsAgent);

module.exports = router;