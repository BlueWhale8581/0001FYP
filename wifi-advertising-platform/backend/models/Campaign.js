const mysql = require('mysql2/promise');
const db = require('../config/database');

class Campaign {
  constructor(campaignData) {
    this.id = campaignData.id;
    this.advertiser_id = campaignData.advertiser_id;
    this.name = campaignData.name;
    this.description = campaignData.description;
    this.start_date = campaignData.start_date;
    this.end_date = campaignData.end_date;
    this.budget = parseFloat(campaignData.budget);
    this.spent = parseFloat(campaignData.spent || 0);
    this.status = campaignData.status || 'draft';
    this.target_audience = campaignData.target_audience;
    this.created_at = campaignData.created_at;
    this.updated_at = campaignData.updated_at;
  }

  // Create a new campaign
  static async create(campaignData) {
    try {
      const query = `
        INSERT INTO campaigns (
          advertiser_id, name, description, start_date, end_date,
          budget, status, target_audience
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const targetAudience = campaignData.target_audience 
        ? JSON.stringify(campaignData.target_audience) 
        : null;
      
      const [result] = await db.execute(query, [
        campaignData.advertiser_id,
        campaignData.name,
        campaignData.description,
        campaignData.start_date,
        campaignData.end_date,
        campaignData.budget,
        campaignData.status || 'draft',
        targetAudience
      ]);
      
      return { id: result.insertId, ...campaignData };
    } catch (error) {
      throw error;
    }
  }

  // Find campaign by ID
  static async findById(id) {
    try {
      const query = 'SELECT * FROM campaigns WHERE id = ?';
      const [rows] = await db.execute(query, [id]);
      
      if (rows.length === 0) return null;
      
      const campaignData = rows[0];
      if (campaignData.target_audience && typeof campaignData.target_audience === 'string') {
        campaignData.target_audience = JSON.parse(campaignData.target_audience);
      }
      
      return new Campaign(campaignData);
    } catch (error) {
      throw error;
    }
  }

  // Get all campaigns for an advertiser
  static async findByAdvertiserId(advertiserId, filters = {}, page = 1, limit = 10) {
    try {
      let query = 'SELECT * FROM campaigns WHERE advertiser_id = ?';
      const params = [advertiserId];
      
      if (filters.status) {
        query += ' AND status = ?';
        params.push(filters.status);
      }
      
      if (filters.active === true) {
        query += ' AND status = "active" AND start_date <= CURDATE() AND end_date >= CURDATE()';
      }
      
      // Add sorting
      query += ' ORDER BY created_at DESC';
      
      // Add pagination
      const offset = (page - 1) * limit;
      query += ' LIMIT ? OFFSET ?';
      params.push(parseInt(limit), parseInt(offset));
      
      const [rows] = await db.execute(query, params);
      
      return rows.map(row => {
        if (row.target_audience && typeof row.target_audience === 'string') {
          row.target_audience = JSON.parse(row.target_audience);
        }
        return new Campaign(row);
      });
    } catch (error) {
      throw error;
    }
  }

  // Update campaign information
  static async update(id, updates) {
    try {
      const allowedUpdates = [
        'name', 'description', 'start_date', 'end_date',
        'budget', 'status', 'target_audience'
      ];
      
      const updateFields = [];
      const updateValues = [];
      
      for (const [key, value] of Object.entries(updates)) {
        if (allowedUpdates.includes(key) && value !== undefined) {
          if (key === 'target_audience' && typeof value !== 'string') {
            updateFields.push(`${key} = ?`);
            updateValues.push(JSON.stringify(value));
          } else {
            updateFields.push(`${key} = ?`);
            updateValues.push(value);
          }
        }
      }
      
      if (updateFields.length === 0) {
        return false;
      }
      
      const query = `UPDATE campaigns SET ${updateFields.join(', ')} WHERE id = ?`;
      updateValues.push(id);
      
      const [result] = await db.execute(query, updateValues);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Update campaign status
  static async updateStatus(id, status) {
    try {
      const query = 'UPDATE campaigns SET status = ? WHERE id = ?';
      const [result] = await db.execute(query, [status, id]);
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Update campaign spent amount
  static async updateSpent(id, additionalAmount) {
    try {
      const query = `
        UPDATE campaigns 
        SET spent = spent + ? 
        WHERE id = ?
      `;
      
      const [result] = await db.execute(query, [additionalAmount, id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get campaign performance metrics
  static async getPerformanceMetrics(campaignId, startDate, endDate) {
    try {
      const query = `
        SELECT 
          COUNT(DISTINCT a.id) as total_ads,
          COUNT(DISTINCT ai.id) as total_impressions,
          SUM(CASE WHEN ai.completed = 1 THEN 1 ELSE 0 END) as completed_views,
          COUNT(DISTINCT ai.merchant_id) as unique_locations,
          AVG(ai.view_duration) as avg_view_duration
        FROM campaigns c
        LEFT JOIN ads a ON c.id = a.campaign_id
        LEFT JOIN ad_impressions ai ON a.id = ai.ad_id
          AND ai.view_time BETWEEN ? AND ?
        WHERE c.id = ?
        GROUP BY c.id
      `;
      
      const [rows] = await db.execute(query, [startDate, endDate, campaignId]);
      
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // Get campaigns summary for dashboard
  static async getDashboardSummary(advertiserId) {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_campaigns,
          SUM(CASE WHEN status = 'active' AND start_date <= CURDATE() AND end_date >= CURDATE() THEN 1 ELSE 0 END) as active_campaigns,
          SUM(budget) as total_budget,
          SUM(spent) as total_spent
        FROM campaigns
        WHERE advertiser_id = ?
      `;
      
      const [rows] = await db.execute(query, [advertiserId]);
      
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // Delete a campaign
  static async delete(id) {
    try {
      const query = 'DELETE FROM campaigns WHERE id = ?';
      const [result] = await db.execute(query, [id]);
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Campaign;