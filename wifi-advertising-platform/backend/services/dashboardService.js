const User = require('../models/User');
const Merchant = require('../models/Merchant');
const Agent = require('../models/Agent');
const Advertiser = require('../models/Advertiser');
const Campaign = require('../models/Campaign');
const Transaction = require('../models/Transaction');
const AdImpression = require('../models/AdImpression');
const WiFiAccess = require('../models/WiFiAccess');
const QRCode = require('../models/QRCode');

/**
 * Service for handling dashboard-related operations
 */
class DashboardService {
  /**
   * Get admin dashboard data
   * @param {Object} filters - Optional filters like timeframe
   * @returns {Object} Dashboard data for admin
   */
  async getAdminDashboard(filters = {}) {
    try {
      const userMetrics = await User.countByRole();
      const merchantMetrics = await Merchant.findAll({ count: true });
      const pendingMerchants = await Merchant.findAll({ filters: { approval_status: 'PENDING' }, count: true });
      const recentTransactions = await Transaction.findAll({ limit: 10 }) || [];
      const totalImpressions = await AdImpression.findByAdId(null, { count: true });
      return {
        userMetrics,
        merchantMetrics,
        pendingMerchants,
        recentTransactions,
        totalImpressions,
      };
    } catch (error) {
      console.error('Error in getAdminDashboard:', error);
      throw new Error('Failed to retrieve admin dashboard data');
    }
  }

  /**
   * Get agent dashboard data
   * @param {Number} agentId - ID of the agent
   * @returns {Object} Dashboard data for agent
   */
  async getAgentDashboard(agentId) {
    try {
      const merchants = await Merchant.findByAgentId(agentId);
      const totalMerchants = merchants.length;
      const pendingMerchants = merchants.filter((m) => m.approval_status === 'PENDING').length;
      const qrCodes = await QRCode.findByAgentId(agentId);

      return {
        totalMerchants,
        pendingMerchants,
        qrCodes,
      };
    } catch (error) {
      console.error(`Error fetching agent dashboard data for agent ${agentId}:`, error);
      throw new Error('Failed to retrieve agent dashboard data');
    }
  }

  /**
   * Get advertiser dashboard data
   * @param {Number} advertiserId - ID of the advertiser
   * @returns {Object} Dashboard data for advertiser
   */
  async getAdvertiserDashboard(advertiserId) {
    try {
      const campaigns = await Campaign.findByAdvertiserId(advertiserId);
      const activeCampaigns = campaigns.filter((c) => c.status === 'ACTIVE').length;
      const totalBudget = campaigns.reduce((sum, c) => sum + parseFloat(c.budget), 0);
      const totalSpent = campaigns.reduce((sum, c) => sum + parseFloat(c.spent), 0);

      return {
        totalCampaigns: campaigns.length,
        activeCampaigns,
        totalBudget,
        totalSpent,
      };
    } catch (error) {
      console.error(`Error fetching advertiser dashboard data for advertiser ${advertiserId}:`, error);
      throw new Error('Failed to retrieve advertiser dashboard data');
    }
  }

  /**
   * Get merchant dashboard data
   * @param {Number} merchantId - ID of the merchant
   * @returns {Object} Dashboard data for merchant
   */
  async getMerchantDashboard(merchantId) {
    try {
      const wifiUsage = await WiFiAccess.getUsageStatistics(merchantId);
      const totalConnections = wifiUsage.total_connections;
      const uniqueDevices = wifiUsage.unique_devices;
      const totalAdsViewed = wifiUsage.total_ads_viewed;

      return {
        totalConnections,
        uniqueDevices,
        totalAdsViewed,
      };
    } catch (error) {
      console.error(`Error fetching merchant dashboard data for merchant ${merchantId}:`, error);
      throw new Error('Failed to retrieve merchant dashboard data');
    }
  }
}

module.exports = new DashboardService();