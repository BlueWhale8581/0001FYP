const Ad = require('../models/Ad');
const Campaign = require('../models/Campaign');
const AdImpression = require('../models/AdImpression');
const WiFiAccess = require('../models/WiFiAccess');
const Transaction = require('../models/Transaction');
const NotificationService = require('./notificationService');

class AdService {
  /**
   * Create a new ad
   * @param {Object} adData - Ad data
   * @param {number} campaignId - Campaign ID
   * @param {number} advertiserId - Advertiser ID for validation
   * @returns {Promise<Object>} Created ad
   */
  async createAd(adData, campaignId, advertiserId) {
    try {
      // Verify campaign exists and belongs to advertiser
      const campaign = await Campaign.findById(campaignId);
      if (!campaign) {
        throw new Error('Campaign not found');
      }
      
      if (campaign.advertiser_id !== advertiserId) {
        throw new Error('Unauthorized to add ads to this campaign');
      }
      
      // Validate ad data
      if (!adData.title || !adData.content || !adData.type) {
        throw new Error('Missing required ad information');
      }
      
      // Validate ad type
      const validTypes = ['image', 'video', 'text'];
      if (!validTypes.includes(adData.type)) {
        throw new Error('Invalid ad type');
      }
      
      // Create ad
      const ad = await Ad.create({
        ...adData,
        campaign_id: campaignId
      });
      
      return ad;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update ad details
   * @param {number} adId - Ad ID
   * @param {Object} updateData - Data to update
   * @param {number} advertiserId - Advertiser ID for validation
   * @returns {Promise<Object>} Updated ad
   */
  async updateAd(adId, updateData, advertiserId) {
    try {
      // Get ad with campaign
      const ad = await Ad.findById(adId);
      if (!ad) {
        throw new Error('Ad not found');
      }
      
      // Get campaign to check ownership
      const campaign = await Campaign.findById(ad.campaign_id);
      if (campaign.advertiser_id !== advertiserId) {
        throw new Error('Unauthorized to update this ad');
      }
      
      // Validate ad type if changed
      if (updateData.type) {
        const validTypes = ['image', 'video', 'text'];
        if (!validTypes.includes(updateData.type)) {
          throw new Error('Invalid ad type');
        }
      }
      
      // Update ad
      const updatedAd = await Ad.update(adId, updateData);
      
      return updatedAd;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete an ad
   * @param {number} adId - Ad ID
   * @param {number} advertiserId - Advertiser ID for validation
   * @returns {Promise<boolean>} Success status
   */
  async deleteAd(adId, advertiserId) {
    try {
      // Get ad with campaign
      const ad = await Ad.findById(adId);
      if (!ad) {
        throw new Error('Ad not found');
      }
      
      // Get campaign to check ownership
      const campaign = await Campaign.findById(ad.campaign_id);
      if (campaign.advertiser_id !== advertiserId) {
        throw new Error('Unauthorized to delete this ad');
      }
      
      // Check if ad has impressions
      const impressionCount = await AdImpression.countByAdId(adId);
      if (impressionCount > 0) {
        throw new Error('Cannot delete ad with existing impressions');
      }
      
      // Delete ad
      await Ad.delete(adId);
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Serve ads to a user at a merchant location
   * @param {number} merchantId - Merchant ID where user is connecting
   * @param {Object} user - User data (can be null for anonymous)
   * @param {Object} deviceInfo - Device information
   * @returns {Promise<Array>} List of ads to show
   */
  async serveAds(merchantId, user, deviceInfo) {
    try {
      // Get merchant WiFi settings to determine how many ads to show
      const wifiAccess = await WiFiAccess.findByMerchantId(merchantId, {
        limit: 1,
        orderBy: 'connection_time',
        direction: 'DESC'
      });
      
      // Default to 1 ad if no settings found
      const numberOfAdsToServe = wifiAccess.length > 0 ? 
        (wifiAccess[0].ads_viewed || 1) : 1;
      
      // Create targeting parameters based on user and device
      const targetingParams = {
        deviceType: deviceInfo.deviceType || null,
        browser: deviceInfo.browser || null,
        // Could include more targeting like location, time of day, etc.
      };
      
      // If user is logged in, add user-specific targeting
      if (user) {
        targetingParams.userId = user.id;
        // Could add more user-specific targeting based on profile
      }
      
      // Get random ads based on targeting params
      const ads = await Ad.getRandomAds(numberOfAdsToServe, targetingParams);
      
      // Filter out ads from inactive campaigns
      const activeCampaignIds = new Set();
      const campaigns = await Campaign.findAll({ status: 'active' });
      campaigns.forEach(campaign => activeCampaignIds.add(campaign.id));
      
      const activeAds = ads.filter(ad => activeCampaignIds.has(ad.campaign_id));
      
      return activeAds;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Record ad impression
   * @param {number} adId - Ad ID
   * @param {number} merchantId - Merchant ID where ad was shown
   * @param {number|null} userId - User ID if logged in, null otherwise
   * @param {Object} impressionData - Impression data (duration, completed, etc.)
   * @returns {Promise<Object>} Created impression
   */
  async recordImpression(adId, merchantId, userId, impressionData) {
    try {
      // Verify ad exists
      const ad = await Ad.findById(adId);
      if (!ad) {
        throw new Error('Ad not found');
      }
      
      // Create impression record
      const impression = await AdImpression.create({
        ad_id: adId,
        merchant_id: merchantId,
        user_id: userId || null,
        view_duration: impressionData.duration || 0,
        completed: impressionData.completed || false,
        device_info: JSON.stringify(impressionData.deviceInfo || {})
      });
      
      // Update WiFi access record if applicable
      if (userId) {
        const latestAccess = await WiFiAccess.findByMerchantId(merchantId, {
          userId: userId,
          limit: 1,
          orderBy: 'connection_time',
          direction: 'DESC'
        });
        
        if (latestAccess.length > 0) {
          await WiFiAccess.updateAdsViewed(latestAccess[0].id, 1, true); // Increment by 1
        }
      }
      
      // Check if need to update campaign spent
      // This would depend on your pricing model. Here's a simple example:
      if (impressionData.completed) {
        const campaign = await Campaign.findById(ad.campaign_id);
        
        // Simple cost per completed view model
        const impressionCost = 0.05; // $0.05 per completed view
        
        // Check if campaign has enough budget
        if (campaign.spent + impressionCost <= campaign.budget) {
          // Update campaign spent
          await Campaign.updateSpent(ad.campaign_id, impressionCost, true); // Increment
          
          // Create transaction record
          await Transaction.create({
            type: 'ad_revenue',
            amount: impressionCost,
            status: 'completed',
            advertiser_id: campaign.advertiser_id,
            merchant_id: merchantId,
            campaign_id: campaign.id,
            description: `Ad impression: ${ad.title}`
          });
        }
      }
      
      return impression;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get ad performance metrics
   * @param {number} adId - Ad ID
   * @param {number} advertiserId - Advertiser ID for validation
   * @returns {Promise<Object>} Ad metrics
   */
  async getAdMetrics(adId, advertiserId) {
    try {
      // Get ad details
      const ad = await Ad.findById(adId);
      if (!ad) {
        throw new Error('Ad not found');
      }
      
      // Verify campaign belongs to advertiser
      const campaign = await Campaign.findById(ad.campaign_id);
      if (campaign.advertiser_id !== advertiserId) {
        throw new Error('Unauthorized to view these metrics');
      }
      
      // Get impression data
      const impressions = await AdImpression.findByAdId(adId);
      
      // Calculate metrics
      const totalImpressions = impressions.length;
      const completedImpressions = impressions.filter(imp => imp.completed).length;
      const completionRate = totalImpressions > 0 ? (completedImpressions / totalImpressions) * 100 : 0;
      
      // Get average view duration
      const avgViewDuration = await AdImpression.getAverageViewDuration(adId);
      
      // Get performance by merchant location
      const merchantPerformance = [];
      const merchantImpressions = await AdImpression.findByAdId(adId, { groupBy: 'merchant_id' });
      
      return {
        ad: {
          id: ad.id,
          title: ad.title,
          type: ad.type,
          campaign: campaign.name
        },
        performance: {
          totalImpressions,
          completedImpressions,
          completionRate,
          avgViewDuration,
          merchantPerformance
        }
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AdService();