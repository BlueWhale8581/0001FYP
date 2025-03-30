const mysql = require('mysql2/promise');
const db = require('../config/database');

class AdImpression {
  constructor(impressionData) {
    this.id = impressionData.id;
    this.ad_id = impressionData.ad_id;
    this.user_id = impressionData.user_id;
    this.merchant_id = impressionData.merchant_id;
    this.view_time = impressionData.view_time;
    this.view_duration = impressionData.view_duration;
    this.completed = impressionData.completed || false;
    this.device_info = impressionData.device_info;
  }

  // Create a new ad impression
  static async create(impressionData) {
    try {
      const query = `
        INSERT INTO ad_impressions (
          ad_id, user_id, merchant_id, view_duration, 
          completed, device_info
        ) VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      const [result] = await db.execute(query, [
        impressionData.ad_id,
        impressionData.user_id || null,
        impressionData.merchant_id,
        impressionData.view_duration,
        impressionData.completed ? 1 : 0,
        JSON.stringify(impressionData.device_info || {})
      ]);
      
      return { id: result.insertId, ...impressionData };
    } catch (error) {
      throw error;
    }
  }

  // Find impression by ID
  static async findById(id) {
    try {
      const query = 'SELECT * FROM ad_impressions WHERE id = ?';
      const [rows] = await db.execute(query, [id]);
      
      if (rows.length === 0) return null;
      
      const impressionData = rows[0];
      // Parse JSON fields
      if (impressionData.device_info) {
        impressionData.device_info = JSON.parse(impressionData.device_info);
      }
      
      return new AdImpression(impressionData);
    } catch (error) {
      throw error;
    }
  }

  // Get impressions by ad ID
  static async findByAdId(adId, page = 1, limit = 10) {
    try {
      const query = `
        SELECT * FROM ad_impressions 
        WHERE ad_id = ? 
        ORDER BY view_time DESC
        LIMIT ? OFFSET ?
      `;
      
      const offset = (page - 1) * limit;
      const [rows] = await db.execute(query, [adId, parseInt(limit), parseInt(offset)]);
      
      // Parse JSON fields
      return rows.map(row => {
        if (row.device_info) {
          row.device_info = JSON.parse(row.device_info);
        }
        return new AdImpression(row);
      });
    } catch (error) {
      throw error;
    }
  }

  // Get impressions by merchant ID
  static async findByMerchantId(merchantId, startDate, endDate, page = 1, limit = 10) {
    try {
      const query = `
        SELECT ai.*, a.title as ad_title, a.campaign_id
        FROM ad_impressions ai
        JOIN ads a ON ai.ad_id = a.id
        WHERE ai.merchant_id = ? 
        AND ai.view_time BETWEEN ? AND ?
        ORDER BY ai.view_time DESC
        LIMIT ? OFFSET ?
      `;
      
      const offset = (page - 1) * limit;
      const [rows] = await db.execute(query, [
        merchantId, 
        startDate, 
        endDate, 
        parseInt(limit), 
        parseInt(offset)
      ]);
      
      // Parse JSON fields
      return rows.map(row => {
        if (row.device_info) {
          row.device_info = JSON.parse(row.device_info);
        }
        return row;
      });
    } catch (error) {
      throw error;
    }
  }

  // Get total impressions count by ad ID
  static async countByAdId(adId) {
    try {
      const query = 'SELECT COUNT(*) as count FROM ad_impressions WHERE ad_id = ?';
      const [rows] = await db.execute(query, [adId]);
      
      return rows[0].count;
    } catch (error) {
      throw error;
    }
  }

  // Get completion rate by ad ID
  static async getCompletionRate(adId) {
    try {
      const query = `
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed
        FROM ad_impressions
        WHERE ad_id = ?
      `;
      
      const [rows] = await db.execute(query, [adId]);
      
      if (rows[0].total === 0) return 0;
      
      return (rows[0].completed / rows[0].total) * 100;
    } catch (error) {
      throw error;
    }
  }

  // Get average view duration by ad ID
  static async getAverageViewDuration(adId) {
    try {
      const query = 'SELECT AVG(view_duration) as avg_duration FROM ad_impressions WHERE ad_id = ?';
      const [rows] = await db.execute(query, [adId]);
      
      return rows[0].avg_duration || 0;
    } catch (error) {
      throw error;
    }
  }

  // Get impressions by campaign ID
  static async findByCampaignId(campaignId, startDate, endDate) {
    try {
      const query = `
        SELECT ai.* 
        FROM ad_impressions ai
        JOIN ads a ON ai.ad_id = a.id
        WHERE a.campaign_id = ? 
        AND ai.view_time BETWEEN ? AND ?
      `;
      
      const [rows] = await db.execute(query, [campaignId, startDate, endDate]);
      
      // Parse JSON fields
      return rows.map(row => {
        if (row.device_info) {
          row.device_info = JSON.parse(row.device_info);
        }
        return row;
      });
    } catch (error) {
      throw error;
    }
  }

  // Get daily impression count for a time period
  static async getDailyImpressions(campaignId, startDate, endDate) {
    try {
      const query = `
        SELECT 
          DATE(ai.view_time) as date,
          COUNT(*) as impression_count,
          SUM(CASE WHEN ai.completed = 1 THEN 1 ELSE 0 END) as completed_count
        FROM ad_impressions ai
        JOIN ads a ON ai.ad_id = a.id
        WHERE a.campaign_id = ? 
        AND ai.view_time BETWEEN ? AND ?
        GROUP BY DATE(ai.view_time)
        ORDER BY date
      `;
      
      const [rows] = await db.execute(query, [campaignId, startDate, endDate]);
      
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AdImpression;