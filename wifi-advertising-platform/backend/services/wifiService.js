const WiFiAccess = require('../models/WiFiAccess');
const WiFiSettings = require('../models/WiFiSettings');
const Merchant = require('../models/Merchant');
const AdImpression = require('../models/AdImpression');
const Ad = require('../models/Ad');
const QRCode = require('../models/QRCode');

/**
 * Service for managing WiFi connections and settings
 */
class WiFiService {
  /**
   * Initialize WiFi service for a merchant
   * 
   * @param {number} merchantId - The merchant ID
   * @param {object} settings - The WiFi settings object
   * @returns {Promise<object>} The created WiFi settings
   */
  async initializeWiFiSettings(merchantId, settings) {
    try {
      // Verify the merchant exists
      const merchant = await Merchant.findById(merchantId);
      if (!merchant) {
        throw new Error(`Merchant with ID ${merchantId} not found`);
      }
      
      // Check if merchant already has WiFi settings
      const existingSettings = await WiFiSettings.findByMerchantId(merchantId);
      if (existingSettings) {
        throw new Error(`WiFi settings already exist for merchant ID ${merchantId}`);
      }
      
      // Create WiFi settings
      return await WiFiSettings.create({
        merchant_id: merchantId,
        ssid: settings.ssid,
        password: settings.password,
        connection_limit: settings.connectionLimit || 50,
        session_duration: settings.sessionDuration || 60,
        ads_before_access: settings.adsBeforeAccess !== undefined ? settings.adsBeforeAccess : true,
        redirect_url: settings.redirectUrl || null,
        terms_and_conditions: settings.termsAndConditions || null
      });
    } catch (error) {
      console.error('Error initializing WiFi settings:', error);
      throw error;
    }
  }

  /**
   * Update WiFi settings for a merchant
   * 
   * @param {number} merchantId - The merchant ID
   * @param {object} settings - The updated WiFi settings
   * @returns {Promise<object>} The updated WiFi settings
   */
  async updateWiFiSettings(merchantId, settings) {
    try {
      // Verify the merchant exists
      const merchant = await Merchant.findById(merchantId);
      if (!merchant) {
        throw new Error(`Merchant with ID ${merchantId} not found`);
      }
      
      // Get existing settings
      const existingSettings = await WiFiSettings.findByMerchantId(merchantId);
      if (!existingSettings) {
        throw new Error(`No WiFi settings found for merchant ID ${merchantId}`);
      }
      
      // Update settings
      const updatedSettings = {
        ...existingSettings,
        ...settings
      };
      
      return await WiFiSettings.update(existingSettings.id, updatedSettings);
    } catch (error) {
      console.error('Error updating WiFi settings:', error);
      throw error;
    }
  }

  /**
   * Connect a device to WiFi
   * 
   * @param {number} merchantId - The merchant ID
   * @param {object} deviceInfo - Information about the connecting device
   * @param {string} deviceInfo.macAddress - Device MAC address
   * @param {string} deviceInfo.ipAddress - Device IP address
   * @param {string} deviceInfo.userAgent - Device user agent
   * @param {number} userId - User ID (optional, if logged in)
   * @returns {Promise<object>} Connection result with session ID and ads to view
   */
  async connectDevice(merchantId, deviceInfo, userId = null) {
    try {
      // Verify the merchant exists
      const merchant = await Merchant.findById(merchantId);
      if (!merchant) {
        throw new Error(`Merchant with ID ${merchantId} not found`);
      }
      
      // Get WiFi settings
      const wifiSettings = await WiFiSettings.findByMerchantId(merchantId);
      if (!wifiSettings) {
        throw new Error(`No WiFi settings found for merchant ID ${merchantId}`);
      }
      
      // Check if device is already connected
      const isConnected = await WiFiAccess.isDeviceConnected(deviceInfo.macAddress, merchantId);
      if (isConnected) {
        return {
          success: false,
          message: 'Device is already connected to this WiFi network',
          sessionId: null
        };
      }
      
      // Check if connection limit is reached
      const connectionLimitReached = await WiFiSettings.isConnectionLimitReached(merchantId);
      if (connectionLimitReached) {
        return {
          success: false,
          message: 'Connection limit reached for this WiFi network',
          sessionId: null
        };
      }
      
      // Create WiFi access log
      const accessLog = await WiFiAccess.create({
        merchant_id: merchantId,
        user_id: userId,
        device_mac: deviceInfo.macAddress,
        ip_address: deviceInfo.ipAddress,
        user_agent: deviceInfo.userAgent
      });
      
      // Determine if ads should be shown
      let adsToView = [];
      if (wifiSettings.ads_before_access) {
        // Get random ads to display
        adsToView = await Ad.getRandomAds(3);
      }
      
      return {
        success: true,
        sessionId: accessLog.id,
        adsBeforeAccess: wifiSettings.ads_before_access,
        adsToView,
        redirectUrl: wifiSettings.redirect_url,
        sessionDuration: wifiSettings.session_duration
      };
    } catch (error) {
      console.error('Error connecting device to WiFi:', error);
      throw error;
    }
  }

  /**
   * Record an ad impression and update WiFi access
   * 
   * @param {number} sessionId - The WiFi session ID
   * @param {number} adId - The ad ID
   * @param {object} viewData - Information about the view
   * @param {number} viewData.duration - View duration in seconds
   * @param {boolean} viewData.completed - Whether the ad was fully viewed
   * @param {object} viewData.deviceInfo - Device information
   * @returns {Promise<object>} Updated session info
   */
  async recordAdView(sessionId, adId, viewData) {
    try {
      // Get session data
      const session = await WiFiAccess.findById(sessionId);
      if (!session) {
        throw new Error(`WiFi session with ID ${sessionId} not found`);
      }
      
      // Get ad data
      const ad = await Ad.findById(adId);
      if (!ad) {
        throw new Error(`Ad with ID ${adId} not found`);
      }
      
      // Record impression
      await AdImpression.create({
        ad_id: adId,
        user_id: session.user_id,
        merchant_id: session.merchant_id,
        view_duration: viewData.duration,
        completed: viewData.completed,
        device_info: JSON.stringify(viewData.deviceInfo)
      });
      
      // Update ads viewed count
      await WiFiAccess.updateAdsViewed(sessionId);
      
      // Get WiFi settings to check how many ads are required
      const wifiSettings = await WiFiSettings.findByMerchantId(session.merchant_id);
      
      // Get updated session to check ads viewed count
      const updatedSession = await WiFiAccess.findById(sessionId);
      
      // Determine if user can now access the internet
      const adRequirement = 1; // Default requirement of 1 ad
      const canAccessInternet = updatedSession.ads_viewed >= adRequirement;
      
      return {
        success: true,
        sessionId,
        adsViewed: updatedSession.ads_viewed,
        canAccessInternet,
        redirectUrl: canAccessInternet ? wifiSettings.redirect_url : null
      };
    } catch (error) {
      console.error('Error recording ad view:', error);
      throw error;
    }
  }

  /**
   * End a WiFi session
   * 
   * @param {number} sessionId - The WiFi session ID
   * @returns {Promise<boolean>} Success status
   */
  async endSession(sessionId) {
    try {
      return await WiFiAccess.endSession(sessionId);
    } catch (error) {
      console.error('Error ending WiFi session:', error);
      throw error;
    }
  }

  /**
   * Get WiFi connection information by QR code
   * 
   * @param {number} qrCodeId - The QR code ID
   * @returns {Promise<object>} WiFi connection information
   */
  async getConnectionInfoByQRCode(qrCodeId) {
    try {
      // Get QR code data
      const qrCode = await QRCode.findById(qrCodeId);
      if (!qrCode) {
        throw new Error(`QR code with ID ${qrCodeId} not found`);
      }
      
      // Check if QR code is active
      if (qrCode.activation_status !== 'active') {
        throw new Error('This QR code is no longer active');
      }
      
      // Get merchant data
      const merchant = await Merchant.findById(qrCode.merchant_id);
      if (!merchant) {
        throw new Error(`Merchant with ID ${qrCode.merchant_id} not found`);
      }
      
      // Get WiFi settings
      const wifiSettings = await WiFiSettings.findByMerchantId(qrCode.merchant_id);
      if (!wifiSettings) {
        throw new Error(`No WiFi settings found for merchant ID ${qrCode.merchant_id}`);
      }
      
      return {
        merchantId: merchant.id,
        businessName: merchant.business_name,
        ssid: wifiSettings.ssid,
        requiresPassword: !!wifiSettings.password,
        adsBeforeAccess: wifiSettings.ads_before_access,
        termsAndConditions: wifiSettings.terms_and_conditions
      };
    } catch (error) {
      console.error('Error getting WiFi connection info by QR code:', error);
      throw error;
    }
  }

  /**
   * Get WiFi usage statistics
   * 
   * @param {number} merchantId - The merchant ID
   * @param {object} options - Options for filtering
   * @param {string} options.startDate - Start date (YYYY-MM-DD)
   * @param {string} options.endDate - End date (YYYY-MM-DD)
   * @returns {Promise<object>} WiFi usage statistics
   */
  async getWiFiUsageStats(merchantId, options) {
    try {
      return await WiFiAccess.getUsageStatistics(merchantId, options);
    } catch (error) {
      console.error('Error getting WiFi usage statistics:', error);
      throw error;
    }
  }

  /**
   * Get current connections count
   * 
   * @param {number} merchantId - The merchant ID
   * @returns {Promise<number>} Current connections count
   */
  async getCurrentConnectionsCount(merchantId) {
    try {
      return await WiFiSettings.getCurrentConnectionsCount(merchantId);
    } catch (error) {
      console.error('Error getting current connections count:', error);
      throw error;
    }
  }
}

module.exports = new WiFiService();