const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const wifiController = require('../controllers/wifiController');
const adController = require('../controllers/adController');
const authController = require('../controllers/authController');

// Public registration options
router.get('/join', authController.getRegistrationOptions);

// User registration
router.post('/register/:role', authController.register);

// Public WiFi connection routes (no authentication required)
router.post('/wifi/connect/:merchantId', wifiController.connectGuestToWiFi);
router.get('/wifi/qr/:token', wifiController.validateQRCode);
router.post('/wifi/session/:sessionId/end', wifiController.endWiFiSession);

// Public ad routes
router.get('/ads/serve/:merchantId', adController.serveAds);
router.post('/ads/impression', adController.recordAdImpression);
router.post('/ads/completion', adController.recordAdCompletion);

// Merchants list for public viewing (limited data)
router.get('/merchants', userController.getPublicMerchantsList);
router.get('/merchants/:id', userController.getPublicMerchantDetails);

// Redirect after ad viewing
router.get('/redirect/:sessionId', wifiController.handlePostAdRedirect);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Service is up and running' });
});

module.exports = router;