// backend/routes/merchant.js
const express = require('express');
const router = express.Router();
const merchantController = require('../controllers/merchantController');
const { verifyToken, authorizeRole } = require('../config/auth');
const { upload } = require('../config/multer');
const { body } = require('express-validator');

// Apply middleware to all merchant routes
router.use(verifyToken);
router.use(authorizeRole('merchant'));

/**
 * Dashboard Routes
 */

/**
 * @swagger
 * /api/merchant/dashboard/stats:
 *   get:
 *     summary: Get merchant dashboard statistics
 *     description: Fetches key statistics for the merchant dashboard.
 *     tags: [Merchant]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully.
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
 * @route   GET /api/merchant/dashboard/stats
 * @desc    Get merchant dashboard statistics
 * @access  Private (Merchant)
 **/
router.get('/dashboard/stats', merchantController.getDashboardStats);

/**
 * @swagger
 * /api/merchant/dashboard/wifi-usage:
 *   get:
 *     summary: Get WiFi usage statistics
 *     description: Fetches WiFi usage statistics for the merchant dashboard.
 *     tags: [Merchant]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: WiFi usage statistics retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 wifiUsage:
 *                   type: object
 *       401:
 *         description: Unauthorized.
 */
/**
 * @route   GET /api/merchant/dashboard/wifi-usage
 * @desc    Get WiFi usage statistics
 * @access  Private (Merchant)
 **/
router.get('/dashboard/wifi-usage', merchantController.getWiFiUsageStats);

/**
 * @route   GET /api/merchant/dashboard/ad-impressions
 * @desc    Get ad impression statistics
 * @access  Private (Merchant)
 */
router.get('/dashboard/ad-impressions', merchantController.getAdImpressions);

/**
 * @route   GET /api/merchant/dashboard/revenue
 * @desc    Get revenue details
 * @access  Private (Merchant)
 */
router.get('/dashboard/revenue', merchantController.getRevenueDetails);

/**
 * Wi-Fi Service Management Routes
 */

/**
 * @swagger
 * /api/merchant/wifi-settings:
 *   get:
 *     summary: Get WiFi settings
 *     description: Fetches the WiFi settings configured by the merchant.
 *     tags: [WiFi Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: WiFi settings retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 settings:
 *                   type: object
 *       401:
 *         description: Unauthorized.
 */
/**
 * @route   GET /api/merchant/wifi-settings
 * @desc    Get WiFi settings
 * @access  Private (Merchant)
 **/
router.get('/wifi-settings', merchantController.getWiFiSettings);

/**
 * @swagger
 * /api/merchant/wifi-settings:
 *   put:
 *     summary: Update WiFi settings
 *     description: Updates the WiFi settings for the merchant.
 *     tags: [WiFi Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ssid:
 *                 type: string
 *               encryption_type:
 *                 type: string
 *                 enum: [WPA2, WPA3, Open]
 *               bandwidth_limit:
 *                 type: number
 *               session_timeout:
 *                 type: number
 *               ads_before_access:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 5
 *     responses:
 *       200:
 *         description: WiFi settings updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
 */
/**
 * @route   PUT /api/merchant/wifi-settings
 * @desc    Update WiFi settings
 * @access  Private (Merchant)
 */
router.put('/wifi-settings', [
  body('ssid').optional().isString().trim(),
  body('encryption_type').optional().isIn(['WPA2', 'WPA3', 'Open']),
  body('bandwidth_limit').optional().isNumeric(),
  body('session_timeout').optional().isNumeric(),
  body('ads_before_access').optional().isInt({ min: 0, max: 5 }),
], merchantController.updateWiFiSettings);

/**
 * @route   GET /api/merchant/ad-preferences
 * @desc    Get merchant's ad display preferences
 * @access  Private (Merchant)
 */
router.get('/ad-preferences', merchantController.getAdDisplayPreferences);

/**
 * @route   PUT /api/merchant/ad-preferences
 * @desc    Update merchant's ad display preferences
 * @access  Private (Merchant)
 */
router.put('/ad-preferences', [
  body('adsBeforeAccess').isInt({min: 0, max: 5})
], merchantController.updateAdDisplayPreferences);

/**
 * @route   PUT /api/merchant/redirect-url
 * @desc    Configure post-login redirect URL
 * @access  Private (Merchant)
 */
router.put('/redirect-url', [
  body('redirectUrl').isURL()
], merchantController.configureRedirectUrl);

/**
 * Profile Management Routes
 */

/**
 * @swagger
 * /api/merchant/profile:
 *   get:
 *     summary: Get merchant profile
 *     description: Fetches the profile information of the logged-in merchant.
 *     tags: [Profile]
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
 * @route   GET /api/merchant/profile
 * @desc    Get merchant's profile information
 * @access  Private (Merchant)
 **/
router.get('/profile', merchantController.getMerchantProfile);

/**
 * @route   PUT /api/merchant/profile
 * @desc    Update merchant's profile information
 * @access  Private (Merchant)
 */
router.put('/profile', [
  body('business_name').optional().isString().trim(),
  body('business_address').optional().isString().trim(),
  body('business_type').optional().isString().trim(),
  body('contact_email').optional().isEmail(),
  body('contact_phone').optional().isMobilePhone('any')
], merchantController.updateMerchantProfile);

/**
 * @route   PUT /api/merchant/profile/logo
 * @desc    Update merchant's business logo
 * @access  Private (Merchant)
 */
router.put('/profile/logo', upload.single('logo'), merchantController.updateBusinessLogo);

/**
 * Revenue & Commission Report Routes
 */

/**
 * @swagger
 * /api/merchant/reports/earnings:
 *   get:
 *     summary: Get earnings report
 *     description: Fetches the earnings report for the merchant.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Earnings report retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 earnings:
 *                   type: object
 *       401:
 *         description: Unauthorized.
 */
/**
 * @route   GET /api/merchant/reports/earnings
 * @desc    Get merchant's earnings report
 * @access  Private (Merchant)
 **/
router.get('/reports/earnings', merchantController.getEarningsReport);

/**
 * @route   GET /api/merchant/reports/commission
 * @desc    Get merchant's commission breakdown
 * @access  Private (Merchant)
 */
router.get('/reports/commission', merchantController.getCommissionBreakdown);

/**
 * @swagger
 * /api/merchant/reports/revenue:
 *   get:
 *     summary: Get revenue report
 *     description: Fetches the revenue report for the merchant by period.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Revenue report retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 revenue:
 *                   type: object
 *       401:
 *         description: Unauthorized.
 */
/**
 * @route   GET /api/merchant/reports/revenue
 * @desc    Get revenue report by period
 * @access  Private (Merchant)
 **/
router.get('/reports/revenue', merchantController.getRevenueByPeriod);

module.exports = router;