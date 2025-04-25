const { sql, poolPromise } = require('../config/database');

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
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('ad_id', sql.Int, impressionData.ad_id)
        .input('user_id', sql.Int, impressionData.user_id || null)
        .input('merchant_id', sql.Int, impressionData.merchant_id)
        .input('view_duration', sql.Int, impressionData.view_duration)
        .input('completed', sql.Bit, impressionData.completed ? 1 : 0)
        .input('device_info', sql.NVarChar, JSON.stringify(impressionData.device_info || {}))
        .query(`
          INSERT INTO ad_impressions (ad_id, user_id, merchant_id, view_duration, completed, device_info)
          OUTPUT INSERTED.id
          VALUES (@ad_id, @user_id, @merchant_id, @view_duration, @completed, @device_info)
        `);
      return { id: result.recordset[0].id, ...impressionData };
    } catch (error) {
      console.error('Error creating ad impression:', error);
      throw error;
    }
  }

  // Find impression by ID
  static async findById(id) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM ad_impressions WHERE id = @id');
      if (result.recordset.length === 0) return null;
      const impressionData = result.recordset[0];
      if (impressionData.device_info) {
        impressionData.device_info = JSON.parse(impressionData.device_info);
      }
      return new AdImpression(impressionData);
    } catch (error) {
      console.error('Error finding ad impression by ID:', error);
      throw error;
    }
  }

  // Get impressions by ad ID
  static async findByAdId(adId, page = 1, limit = 10) {
    try {
      const pool = await poolPromise;
      const offset = (page - 1) * limit;
      const result = await pool
        .request()
        .input('ad_id', sql.Int, adId)
        .input('limit', sql.Int, limit)
        .input('offset', sql.Int, offset)
        .query(`
          SELECT * FROM ad_impressions
          WHERE ad_id = @ad_id
          ORDER BY view_time DESC
          OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
        `);
      return result.recordset.map((row) => {
        if (row.device_info) {
          row.device_info = JSON.parse(row.device_info);
        }
        return new AdImpression(row);
      });
    } catch (error) {
      console.error('Error finding impressions by ad ID:', error);
      throw error;
    }
  }
}

module.exports = AdImpression;