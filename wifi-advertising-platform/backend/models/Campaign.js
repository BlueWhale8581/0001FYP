const { sql, poolPromise } = require('../config/database');

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
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('advertiser_id', sql.Int, campaignData.advertiser_id)
        .input('name', sql.NVarChar, campaignData.name)
        .input('description', sql.NVarChar, campaignData.description)
        .input('start_date', sql.Date, campaignData.start_date)
        .input('end_date', sql.Date, campaignData.end_date)
        .input('budget', sql.Decimal(10, 2), campaignData.budget)
        .input('status', sql.NVarChar, campaignData.status || 'draft')
        .input('target_audience', sql.NVarChar, JSON.stringify(campaignData.target_audience || null))
        .query(`
          INSERT INTO campaigns (
            advertiser_id, name, description, start_date, end_date,
            budget, status, target_audience
          )
          OUTPUT INSERTED.id
          VALUES (@advertiser_id, @name, @description, @start_date, @end_date, @budget, @status, @target_audience)
        `);
      return { id: result.recordset[0].id, ...campaignData };
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  }

  // Find campaign by ID
  static async findById(id) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM campaigns WHERE id = @id');
      if (result.recordset.length === 0) return null;

      const campaignData = result.recordset[0];
      if (campaignData.target_audience) {
        campaignData.target_audience = JSON.parse(campaignData.target_audience);
      }
      return new Campaign(campaignData);
    } catch (error) {
      console.error('Error finding campaign by ID:', error);
      throw error;
    }
  }

  // Get all campaigns for an advertiser
  static async findByAdvertiserId(advertiserId, filters = {}, page = 1, limit = 10) {
    try {
      const pool = await poolPromise;
      let query = 'SELECT * FROM campaigns WHERE advertiser_id = @advertiserId';
      const request = pool.request().input('advertiserId', sql.Int, advertiserId);

      if (filters.status) {
        query += ' AND status = @status';
        request.input('status', sql.NVarChar, filters.status);
      }

      if (filters.active === true) {
        query += ' AND status = \'active\' AND start_date <= GETDATE() AND end_date >= GETDATE()';
      }

      // Add sorting
      query += ' ORDER BY created_at DESC';

      // Add pagination
      const offset = (page - 1) * limit;
      query += ' OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY';
      request.input('limit', sql.Int, limit).input('offset', sql.Int, offset);

      const result = await request.query(query);

      return result.recordset.map(row => {
        if (row.target_audience) {
          row.target_audience = JSON.parse(row.target_audience);
        }
        return new Campaign(row);
      });
    } catch (error) {
      console.error('Error finding campaigns by advertiser ID:', error);
      throw error;
    }
  }

  // Update campaign information
  static async update(id, updates) {
    try {
      const allowedUpdates = [
        'name', 'description', 'start_date', 'end_date',
        'budget', 'status', 'target_audience',
      ];
      const updateFields = [];
      const request = (await poolPromise).request();

      for (const [key, value] of Object.entries(updates)) {
        if (allowedUpdates.includes(key) && value !== undefined) {
          updateFields.push(`${key} = @${key}`);
          request.input(key, sql.NVarChar, key === 'target_audience' ? JSON.stringify(value) : value);
        }
      }

      if (updateFields.length === 0) {
        return false;
      }

      request.input('id', sql.Int, id);
      const query = `UPDATE campaigns SET ${updateFields.join(', ')} WHERE id = @id`;
      const result = await request.query(query);
      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Error updating campaign:', error);
      throw error;
    }
  }

  // Update campaign status
  static async updateStatus(id, status) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('id', sql.Int, id)
        .input('status', sql.NVarChar, status)
        .query('UPDATE campaigns SET status = @status WHERE id = @id');

      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Error updating campaign status:', error);
      throw error;
    }
  }

  // Update campaign spent amount
  static async updateSpent(id, additionalAmount) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('id', sql.Int, id)
        .input('additionalAmount', sql.Decimal(10, 2), additionalAmount)
        .query('UPDATE campaigns SET spent = spent + @additionalAmount WHERE id = @id');

      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Error updating campaign spent amount:', error);
      throw error;
    }
  }

  // Get campaign performance metrics
  static async getPerformanceMetrics(campaignId, startDate, endDate) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('campaignId', sql.Int, campaignId)
        .input('startDate', sql.Date, startDate)
        .input('endDate', sql.Date, endDate)
        .query(`
          SELECT 
            COUNT(DISTINCT a.id) as total_ads,
            COUNT(DISTINCT ai.id) as total_impressions,
            SUM(CASE WHEN ai.completed = 1 THEN 1 ELSE 0 END) as completed_views,
            COUNT(DISTINCT ai.merchant_id) as unique_locations,
            AVG(ai.view_duration) as avg_view_duration
          FROM campaigns c
          LEFT JOIN ads a ON c.id = a.campaign_id
          LEFT JOIN ad_impressions ai ON a.id = ai.ad_id
            AND ai.view_time BETWEEN @startDate AND @endDate
          WHERE c.id = @campaignId
          GROUP BY c.id
        `);

      return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (error) {
      console.error('Error getting campaign performance metrics:', error);
      throw error;
    }
  }

  // Get campaigns summary for dashboard
  static async getDashboardSummary(advertiserId) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('advertiserId', sql.Int, advertiserId)
        .query(`
          SELECT 
            COUNT(*) as total_campaigns,
            SUM(CASE WHEN status = 'active' AND start_date <= GETDATE() AND end_date >= GETDATE() THEN 1 ELSE 0 END) as active_campaigns,
            SUM(budget) as total_budget,
            SUM(spent) as total_spent
          FROM campaigns
          WHERE advertiser_id = @advertiserId
        `);

      return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (error) {
      console.error('Error getting dashboard summary:', error);
      throw error;
    }
  }

  // Delete a campaign
  static async delete(id) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('id', sql.Int, id)
        .query('DELETE FROM campaigns WHERE id = @id');

      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Error deleting campaign:', error);
      throw error;
    }
  }
}

module.exports = Campaign;