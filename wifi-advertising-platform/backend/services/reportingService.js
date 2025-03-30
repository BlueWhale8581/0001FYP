const Transaction = require('../models/Transaction');
const AdImpression = require('../models/AdImpression');
const WiFiAccess = require('../models/WiFiAccess');
const Campaign = require('../models/Campaign');
const Merchant = require('../models/Merchant');
const Agent = require('../models/Agent');
const Advertiser = require('../models/Advertiser');

/**
 * Service for generating reports and analytics
 */
class ReportingService {
  /**
   * Generate revenue report
   * 
   * @param {object} options - Report options
   * @param {string} options.startDate - Start date (YYYY-MM-DD)
   * @param {string} options.endDate - End date (YYYY-MM-DD)
   * @param {string} options.groupBy - Group by (day, week, month)
   * @param {number} options.merchantId - Filter by merchant
   * @param {number} options.agentId - Filter by agent
   * @param {number} options.advertiserId - Filter by advertiser
   * @returns {Promise<object>} Revenue report data
   */
  async generateRevenueReport(options) {
    try {
      const { startDate, endDate, groupBy = 'day', merchantId, agentId, advertiserId } = options;
      
      const filters = {};
      if (merchantId) filters.merchant_id = merchantId;
      if (agentId) filters.agent_id = agentId;
      if (advertiserId) filters.advertiser_id = advertiserId;
      
      return await Transaction.getRevenueSummary({
        startDate,
        endDate,
        groupBy,
        ...filters
      });
    } catch (error) {
      console.error('Error generating revenue report:', error);
      throw error;
    }
  }

  /**
   * Generate ad performance report for campaigns or individual ads
   * 
   * @param {object} options - Report options
   * @param {string} options.startDate - Start date (YYYY-MM-DD)
   * @param {string} options.endDate - End date (YYYY-MM-DD)
   * @param {number} options.campaignId - Filter by campaign
   * @param {number} options.adId - Filter by ad
   * @param {number} options.advertiserId - Filter by advertiser
   * @returns {Promise<object>} Ad performance report data
   */
  async generateAdPerformanceReport(options) {
    try {
      const { startDate, endDate, campaignId, adId, advertiserId } = options;
      
      let impressionData;
      if (adId) {
        // For a specific ad
        impressionData = await AdImpression.findByAdId(adId, { startDate, endDate });
      } else if (campaignId) {
        // For a specific campaign
        impressionData = await AdImpression.findByCampaignId(campaignId, { startDate, endDate });
      } else if (advertiserId) {
        // For all ads of an advertiser
        const campaigns = await Campaign.findByAdvertiserId(advertiserId);
        const campaignIds = campaigns.map(campaign => campaign.id);
        
        impressionData = [];
        for (const id of campaignIds) {
          const data = await AdImpression.findByCampaignId(id, { startDate, endDate });
          impressionData = [...impressionData, ...data];
        }
      } else {
        throw new Error('At least one filter (campaignId, adId, or advertiserId) is required');
      }
      
      // Calculate metrics
      const totalImpressions = impressionData.length;
      const completedImpressions = impressionData.filter(imp => imp.completed).length;
      const completionRate = totalImpressions > 0 ? (completedImpressions / totalImpressions) * 100 : 0;
      
      // Calculate average view duration
      let totalDuration = 0;
      impressionData.forEach(imp => {
        totalDuration += imp.view_duration || 0;
      });
      const averageViewDuration = totalImpressions > 0 ? totalDuration / totalImpressions : 0;
      
      // Get daily impressions
      let dailyImpressions = {};
      if (campaignId) {
        dailyImpressions = await AdImpression.getDailyImpressions(campaignId, { startDate, endDate });
      }
      
      return {
        totalImpressions,
        completedImpressions,
        completionRate,
        averageViewDuration,
        dailyImpressions
      };
    } catch (error) {
      console.error('Error generating ad performance report:', error);
      throw error;
    }
  }

  /**
   * Generate WiFi usage report
   * 
   * @param {object} options - Report options
   * @param {string} options.startDate - Start date (YYYY-MM-DD)
   * @param {string} options.endDate - End date (YYYY-MM-DD)
   * @param {number} options.merchantId - Filter by merchant
   * @returns {Promise<object>} WiFi usage report data
   */
  async generateWiFiUsageReport(options) {
    try {
      const { startDate, endDate, merchantId } = options;
      
      if (!merchantId) {
        throw new Error('Merchant ID is required for WiFi usage reports');
      }
      
      // Get usage statistics
      const usageStats = await WiFiAccess.getUsageStatistics(merchantId, { startDate, endDate });
      
      // Get daily connection counts
      const dailyConnections = await WiFiAccess.getDailyConnectionCounts(merchantId, { startDate, endDate });
      
      return {
        ...usageStats,
        dailyConnections
      };
    } catch (error) {
      console.error('Error generating WiFi usage report:', error);
      throw error;
    }
  }

  /**
   * Generate agent performance report
   * 
   * @param {object} options - Report options
   * @param {string} options.startDate - Start date (YYYY-MM-DD)
   * @param {string} options.endDate - End date (YYYY-MM-DD)
   * @param {number} options.agentId - Filter by agent
   * @returns {Promise<object>} Agent performance report data
   */
  async generateAgentPerformanceReport(options) {
    try {
      const { startDate, endDate, agentId } = options;
      
      if (!agentId) {
        throw new Error('Agent ID is required for agent performance reports');
      }
      
      // Get agent data
      const agent = await Agent.findById(agentId);
      if (!agent) {
        throw new Error(`Agent with ID ${agentId} not found`);
      }
      
      // Get merchant count for this agent
      const merchants = await Merchant.findByAgentId(agentId);
      const merchantCount = merchants.length;
      
      // Get approved merchant count
      const approvedMerchants = merchants.filter(m => m.approval_status === 'approved').length;
      
      // Get commission data
      const commissionData = await Transaction.findByAgentId(agentId, { 
        startDate, 
        endDate,
        type: 'agent_commission'
      });
      
      // Calculate total commission
      let totalCommission = 0;
      commissionData.forEach(transaction => {
        if (transaction.status === 'completed') {
          totalCommission += parseFloat(transaction.amount);
        }
      });
      
      return {
        agentId,
        merchantCount,
        approvedMerchants,
        commissionData,
        totalCommission
      };
    } catch (error) {
      console.error('Error generating agent performance report:', error);
      throw error;
    }
  }

  /**
   * Generate system summary report
   * 
   * @param {object} options - Report options
   * @param {string} options.startDate - Start date (YYYY-MM-DD)
   * @param {string} options.endDate - End date (YYYY-MM-DD)
   * @returns {Promise<object>} System summary report data
   */
  async generateSystemSummaryReport(options) {
    try {
      const { startDate, endDate } = options;
      
      // Get transaction totals
      const transactionData = await Transaction.getRevenueSummary({
        startDate,
        endDate,
        groupBy: 'type'
      });
      
      // Get user counts by role
      const userCounts = {
        merchants: await Merchant.countByStatus(),
        agents: await Agent.findAll().then(agents => agents.length),
        advertisers: await Advertiser.findAll().then(advertisers => advertisers.length)
      };
      
      // Get campaign data
      const campaigns = await Campaign.getDashboardSummary({ startDate, endDate });
      
      // Get WiFi connection data (aggregated across all merchants)
      const wifiConnections = await WiFiAccess.getDailyConnectionCounts(null, { startDate, endDate });
      
      return {
        revenue: transactionData,
        userCounts,
        campaigns,
        wifiConnections
      };
    } catch (error) {
      console.error('Error generating system summary report:', error);
      throw error;
    }
  }
}

module.exports = new ReportingService();