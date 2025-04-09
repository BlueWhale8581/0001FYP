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
 * @route   GET /api/merchant/dashboard/stats
 * @desc    Get merchant dashboard data
 * @access  Private (Merchant)
 */
router.get('/dashboard/stats', merchantController.getDashboardStats);

/**
 * @route   GET /api/merchant/dashboard/wifi-usage
 * @desc    Get WiFi usage statistics
 * @access  Private (Merchant)
 */
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
 * @route   GET /api/merchant/wifi-settings
 * @desc    Get merchant's WiFi settings
 * @access  Private (Merchant)
 */
router.get('/wifi-settings', merchantController.getWiFiSettings);

/**
 * @route   PUT /api/merchant/wifi-settings
 * @desc    Update merchant's WiFi settings
 * @access  Private (Merchant)
 */
router.put('/wifi-settings', [
  body('ssid').optional().isString().trim(),
  body('encryption_type').optional().isIn(['WPA2', 'WPA3', 'Open']),
  body('bandwidth_limit').optional().isNumeric(),
  body('session_timeout').optional().isNumeric(),
  body('ads_before_access').optional().isInt({min: 0, max: 5})
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
 * @route   GET /api/merchant/profile
 * @desc    Get merchant's profile information
 * @access  Private (Merchant)
 */
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
 * @route   GET /api/merchant/reports/earnings
 * @desc    Get merchant's earnings report
 * @access  Private (Merchant)
 */
router.get('/reports/earnings', merchantController.getEarningsReport);

/**
 * @route   GET /api/merchant/reports/commission
 * @desc    Get merchant's commission breakdown
 * @access  Private (Merchant)
 */
router.get('/reports/commission', merchantController.getCommissionBreakdown);

/**
 * @route   GET /api/merchant/reports/revenue
 * @desc    Get merchant's revenue by period
 * @access  Private (Merchant)
 */
router.get('/reports/revenue', merchantController.getRevenueByPeriod);

module.exports = router;