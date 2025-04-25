const { sql, poolPromise } = require('../config/database');

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
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('campaign_id', sql.Int, adData.campaign_id)
        .input('title', sql.NVarChar, adData.title)
        .input('content', sql.NVarChar, adData.content)
        .input('media_url', sql.NVarChar, adData.media_url)
        .input('type', sql.NVarChar, adData.type)
        .input('redirect_url', sql.NVarChar, adData.redirect_url)
        .input('duration', sql.Int, adData.duration || 15)
        .query(`
          INSERT INTO ads (campaign_id, title, content, media_url, type, redirect_url, duration)
          OUTPUT INSERTED.id
          VALUES (@campaign_id, @title, @content, @media_url, @type, @redirect_url, @duration)
        `);
      return { id: result.recordset[0].id, ...adData };
    } catch (error) {
      console.error('Error creating ad:', error);
      throw error;
    }
  }

  // Find ad by ID
  static async findById(id) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM ads WHERE id = @id');
      if (result.recordset.length === 0) return null;
      return new Ad(result.recordset[0]);
    } catch (error) {
      console.error('Error finding ad by ID:', error);
      throw error;
    }
  }

  // Get all ads for a campaign
  static async findByCampaignId(campaignId) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('campaign_id', sql.Int, campaignId)
        .query('SELECT * FROM ads WHERE campaign_id = @campaign_id');
      return result.recordset.map((row) => new Ad(row));
    } catch (error) {
      console.error('Error finding ads by campaign ID:', error);
      throw error;
    }
  }

  // Update ad information
  static async update(id, updates) {
    try {
      const allowedUpdates = ['title', 'content', 'media_url', 'type', 'redirect_url', 'duration'];
      const updateFields = [];
      const request = (await poolPromise).request();

      for (const [key, value] of Object.entries(updates)) {
        if (allowedUpdates.includes(key) && value !== undefined) {
          updateFields.push(`${key} = @${key}`);
          request.input(key, sql.NVarChar, value);
        }
      }

      if (updateFields.length === 0) {
        return false;
      }

      request.input('id', sql.Int, id);
      const query = `UPDATE ads SET ${updateFields.join(', ')} WHERE id = @id`;
      const result = await request.query(query);
      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Error updating ad:', error);
      throw error;
    }
  }
}

module.exports = Ad;