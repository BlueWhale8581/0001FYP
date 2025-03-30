const User = require('../models/User');
const Merchant = require('../models/Merchant');
const Agent = require('../models/Agent');
const Advertiser = require('../models/Advertiser');
const Campaign = require('../models/Campaign');
const Transaction = require('../models/Transaction');
const AdImpression = require('../models/AdImpression');
const WiFiAccess = require('../models/WiFiAccess');

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
      const timeframe = filters.timeframe || 'month'; // default to monthly view
      
      // Get key system metrics
      const [
        userCount, 
        merchantCount, 
        activeAgents,
        activeAdvertisers,
        pendingMerchants,
        revenueData,
        transactionData,
        adPerformanceData
      ] = await Promise.all([
        User.countByRole(), // Count of users by role
        Merchant.countByStatus(), // Count of merchants by status
        Agent.findAll({ status: 'active' }), // Active agents
        Advertiser.findAll({ status: 'active' }), // Active advertisers
        Merchant.findAll({ approval_status: 'pending' }), // Pending merchant approvals
        Transaction.getRevenueSummary({ timeframe }), // Revenue summary
        Transaction.findAll({ limit: 10, sort: 'created_at DESC' }), // Recent transactions
        this._getAdPerformanceData(timeframe) // Ad performance data
      ]);

      return {
        userMetrics: {
          total: userCount.total,
          byRole: {
            admin: userCount.admin || 0,
            agent: userCount.agent || 0,
            advertiser: userCount.advertiser || 0,
            merchant: userCount.merchant || 0
          }
        },
        merchantMetrics: {
          total: merchantCount.total || 0,
          approved: merchantCount.approved || 0,
          pending: merchantCount.pending || 0,
          rejected: merchantCount.rejected || 0
        },
        activeAgents: activeAgents.length,
        activeAdvertisers: activeAdvertisers.length,
        pendingApprovals: pendingMerchants.length,
        revenueData,
        recentTransactions: transactionData,
        adPerformance: adPerformanceData
      };
    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
      throw new Error('Failed to retrieve admin dashboard data');
    }
  }

  /**
   * Get agent dashboard data
   * @param {Number} agentId - ID of the agent
   * @param {Object} filters - Optional filters like timeframe
   * @returns {Object} Dashboard data for agent
   */
  async getAgentDashboard(agentId, filters = {}) {
    try {
      const timeframe = filters.timeframe || 'month'; // default to monthly view
      
      // Get agent metrics
      const [
        merchantData,
        commissionData,
        qrCodeData,
        recentMerchants
      ] = await Promise.all([
        Merchant.findByAgentId(agentId), // All merchants for this agent
        Transaction.findByAgentId(agentId, { type: 'agent_commission', timeframe }), // Commission transactions
        this._getAgentQrCodeData(agentId), // QR code generation data
        Merchant.findByAgentId(agentId, { limit: 5, sort: 'created_at DESC' }) // Recent merchants
      ]);

      // Calculate metrics
      const totalMerchants = merchantData.length;
      const approvedMerchants = merchantData.filter(m => m.approval_status === 'approved').length;
      const pendingMerchants = merchantData.filter(m => m.approval_status === 'pending').length;
      
      // Calculate total commission
      const totalCommission = commissionData.reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);
      
      return {
        merchantMetrics: {
          total: totalMerchants,
          approved: approvedMerchants,
          pending: pendingMerchants
        },
        commissionMetrics: {
          total: totalCommission,
          transactions: commissionData
        },
        qrCodeMetrics: qrCodeData,
        recentMerchants
      };
    } catch (error) {
      console.error(`Error fetching agent dashboard data for agent ${agentId}:`, error);
      throw new Error('Failed to retrieve agent dashboard data');
    }
  }

  /**
   * Get advertiser dashboard data
   * @param {Number} advertiserId - ID of the advertiser
   * @param {Object} filters - Optional filters like timeframe
   * @returns {Object} Dashboard data for advertiser
   */
  async getAdvertiserDashboard(advertiserId, filters = {}) {
    try {
      const timeframe = filters.timeframe || 'month'; // default to monthly view
      
      // Get advertiser metrics
      const [
        campaigns,
        impressionData,
        expenditureData
      ] = await Promise.all([
        Campaign.findByAdvertiserId(advertiserId), // All campaigns
        this._getAdvertiserImpressionData(advertiserId, timeframe), // Ad impression data
        Transaction.findByAdvertiserId(advertiserId, { type: 'advertiser_payment', timeframe }) // Payment transactions
      ]);

      // Active campaigns
      const activeCampaigns = campaigns.filter(c => c.status === 'active');
      
      // Calculate total expenditure
      const totalExpenditure = expenditureData.reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);
      
      // Get campaign performance metrics
      const campaignPerformance = [];
      for (const campaign of campaigns) {
        const metrics = await Campaign.getPerformanceMetrics(campaign.id);
        campaignPerformance.push({
          id: campaign.id,
          name: campaign.name,
          status: campaign.status,
          start_date: campaign.start_date,
          end_date: campaign.end_date,
          budget: campaign.budget,
          spent: campaign.spent,
          impressions: metrics.impressions,
          completionRate: metrics.completionRate,
          averageViewDuration: metrics.averageViewDuration
        });
      }
      
      return {
        campaignMetrics: {
          total: campaigns.length,
          active: activeCampaigns.length,
          draft: campaigns.filter(c => c.status === 'draft').length,
          paused: campaigns.filter(c => c.status === 'paused').length,
          completed: campaigns.filter(c => c.status === 'completed').length
        },
        expenditureMetrics: {
          total: totalExpenditure,
          transactions: expenditureData
        },
        impressionData,
        campaignPerformance
      };
    } catch (error) {
      console.error(`Error fetching advertiser dashboard data for advertiser ${advertiserId}:`, error);
      throw new Error('Failed to retrieve advertiser dashboard data');
    }
  }

  /**
   * Get merchant dashboard data
   * @param {Number} merchantId - ID of the merchant
   * @param {Object} filters - Optional filters like timeframe
   * @returns {Object} Dashboard data for merchant
   */
  async getMerchantDashboard(merchantId, filters = {}) {
    try {
      const timeframe = filters.timeframe || 'month'; // default to monthly view
      
      // Get merchant metrics
      const [
        wifiUsageData,
        impressionData,
        revenueData,
        wifiSettings
      ] = await Promise.all([
        WiFiAccess.getUsageStatistics(merchantId, { timeframe }), // WiFi usage data
        AdImpression.findByMerchantId(merchantId, { timeframe }), // Ad impressions at this merchant
        Transaction.findByMerchantId(merchantId, { type: 'merchant_payment', timeframe }), // Revenue transactions
        WiFiSettings.findByMerchantId(merchantId) // WiFi settings
      ]);

      // Calculate total revenue
      const totalRevenue = revenueData.reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);
      
      // Get daily connection counts
      const dailyConnections = await WiFiAccess.getDailyConnectionCounts(merchantId, timeframe);
      
      return {
        wifiMetrics: {
          totalConnections: wifiUsageData.totalConnections,
          uniqueUsers: wifiUsageData.uniqueUsers,
          averageSessionDuration: wifiUsageData.averageSessionDuration,
          dailyConnections
        },
        adMetrics: {
          totalImpressions: impressionData.length,
          completedViews: impressionData.filter(imp => imp.completed).length,
          averageViewDuration: impressionData.reduce((sum, imp) => sum + imp.view_duration, 0) / impressionData.length
        },
        revenueMetrics: {
          total: totalRevenue,
          transactions: revenueData
        },
        wifiSettings
      };
    } catch (error) {
      console.error(`Error fetching merchant dashboard data for merchant ${merchantId}:`, error);
      throw new Error('Failed to retrieve merchant dashboard data');
    }
  }

  /**
   * Get ad performance data
   * @param {String} timeframe - Time period for data
   * @returns {Object} Ad performance data
   * @private
   */
  async _getAdPerformanceData(timeframe) {
    // Implementation for getting aggregated ad performance data
    const impressions = await AdImpression.getDailyImpressions(timeframe);
    
    return {
      impressions,
      // Add more performance metrics as needed
    };
  }

  /**
   * Get agent QR code data
   * @param {Number} agentId - ID of the agent
   * @returns {Object} QR code data
   * @private
   */
  async _getAgentQrCodeData(agentId) {
    // Implementation for getting agent's QR code generation data
    const QRCode = require('../models/QRCode');
    const qrCodes = await QRCode.findByAgentId(agentId);
    
    return {
      total: qrCodes.length,
      active: qrCodes.filter(qr => qr.activation_status === 'active').length
    };
  }

  /**
   * Get advertiser impression data
   * @param {Number} advertiserId - ID of the advertiser
   * @param {String} timeframe - Time period for data
   * @returns {Object} Impression data
   * @private
   */
  async _getAdvertiserImpressionData(advertiserId, timeframe) {
    // Implementation for getting advertiser's impression data
    const campaigns = await Campaign.findByAdvertiserId(advertiserId);
    let impressionData = { total: 0, completed: 0, daily: [] };
    
    for (const campaign of campaigns) {
      const impressions = await AdImpression.findByCampaignId(campaign.id, timeframe);
      impressionData.total += impressions.length;
      impressionData.completed += impressions.filter(imp => imp.completed).length;
      
      // Get daily impressions for this campaign and merge with overall data
      const dailyImpressions = await AdImpression.getDailyImpressions(campaign.id, timeframe);
      // Merge logic for daily impressions would go here
      impressionData.daily = dailyImpressions; // Simplified for now
    }
    
    return impressionData;
  }
}

module.exports = new DashboardService();