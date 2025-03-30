const mysql = require('mysql2/promise');
const db = require('../config/database');

class Ad {
  constructor(adData) {
    this.id = adData.id;
    this.campaign_id = adData.campaign_id;
    this.title = adData.title;
    this.content = adData.content;
    this.media_url = adData.media_url;
    this.type = adData.type;
    this.redirect_url = adData.redirect_url;
    this.duration = adData.duration || 15;
    this.created_at = adData.created_at;
    this.updated_at = adData.updated_at;
  }

  // Create a new ad
  static async create(adData) {
    try {
      const query = `
        INSERT INTO ads (
          campaign_id, title, content, media_url, type, redirect_url, duration
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      const [result] = await db.execute(query, [
        adData.campaign_id,
        adData.title,
        adData.content,
        adData.media_url,
        adData.type,
        adData.redirect_url,
        adData.duration || 15
      ]);
      
      return { id: result.insertId, ...adData };
    } catch (error) {
      throw error;
    }
  }

  // Find ad by ID
  static async findById(id) {
    try {
      const query = 'SELECT * FROM ads WHERE id = ?';
      const [rows] = await db.execute(query, [id]);
      
      if (rows.length === 0) return null;
      
      const adData = rows[0];
      return new Ad(adData);
    } catch (error) {
      throw error;
    }
  }

  // Get all ads for a campaign
  static async findByCampaignId(campaignId) {
    try {
      const query = 'SELECT * FROM ads WHERE campaign_id = ?';
      const [rows] = await db.execute(query, [campaignId]);
      
      return rows.map(row => new Ad(row));
    } catch (error) {
      throw error;
    }
  }

  // Update ad information
  static async update(id, updates) {
    try {
      const allowedUpdates = [
        'title', 'content', 'media_url', 'type', 'redirect_url', 'duration'
      ];
      
      const updateFields = [];
      const updateValues = [];
      
      for (const [key, value] of Object.entries(updates)) {
        if (allowedUpdates.includes(key) && value !== undefined) {
          updateFields.push(`${key} = ?`);
          updateValues.push(value);
        }
      }
      
      if (updateFields.length === 0) {
        return false;
      }
      
      const query = `UPDATE ads SET ${updateFields.join(', ')} WHERE id = ?`;
      updateValues.push(id);
      
      const [result] = await db.execute(query, updateValues);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get random ads for serving to users
  static async getRandomAds(count = 1, targetingParams = {}) {
    try {
      let query = `
        SELECT a.* 
        FROM ads a
        JOIN campaigns c ON a.campaign_id = c.id
        WHERE c.status = 'active'
        AND c.start_date <= CURDATE()
        AND c.end_date >= CURDATE()
      `;
      
      const params = [];
      
      // Add targeting parameters if specified
      if (targetingParams.merchant_id) {
        query += ' AND c.target_audience LIKE ?';
        params.push(`%"location":"${targetingParams.merchant_id}"%`);
      }
      
      query += ' ORDER BY RAND() LIMIT ?';
      params.push(parseInt(count));
      
      const [rows] = await db.execute(query, params);
      
      return rows.map(row => new Ad(row));
    } catch (error) {
      throw error;
    }
  }

  // Get ad performance metrics
  static async getPerformanceMetrics(adId, startDate, endDate) {
    try {
      const query = `
        SELECT 
          COUNT(ai.id) as total_impressions,
          SUM(CASE WHEN ai.completed = 1 THEN 1 ELSE 0 END) as completed_views,
          AVG(ai.view_duration) as avg_view_duration,
          COUNT(DISTINCT ai.merchant_id) as unique_locations
        FROM ads a
        LEFT JOIN ad_impressions ai ON a.id = ai.ad_id
          AND ai.view_time BETWEEN ? AND ?
        WHERE a.id = ?
        GROUP BY a.id
      `;
      
      const [rows] = await db.execute(query, [startDate, endDate, adId]);
      
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // Delete an ad
  static async delete(id) {
    try {
      const query = 'DELETE FROM ads WHERE id = ?';
      const [result] = await db.execute(query, [id]);
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Ad;