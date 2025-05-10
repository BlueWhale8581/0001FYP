const { sql, poolPromise } = require('../config/database');

class Advertiser {
  constructor(advertiserData) {
    this.id = advertiserData.id;
    this.company_name = advertiserData.company_name;
    this.company_address = advertiserData.company_address;
    this.company_phone = advertiserData.company_phone;
    this.company_email = advertiserData.company_email;
    this.industry = advertiserData.industry;
    this.created_at = advertiserData.created_at;
    this.updated_at = advertiserData.updated_at;
  }

  // Create a new advertiser
  static async create(advertiserData) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('id', sql.Int, advertiserData.id)
        .input('company_name', sql.NVarChar, advertiserData.company_name)
        .input('company_address', sql.NVarChar, advertiserData.company_address)
        .input('company_phone', sql.NVarChar, advertiserData.company_phone)
        .input('company_email', sql.NVarChar, advertiserData.company_email)
        .input('industry', sql.NVarChar, advertiserData.industry)
        .query(`
          INSERT INTO advertisers (id, company_name, company_address, company_phone, company_email, industry)
          OUTPUT INSERTED.id
          VALUES (@id, @company_name, @company_address, @company_phone, @company_email, @industry)
        `);
      return { id: result.recordset[0].id, ...advertiserData };
    } catch (error) {
      console.error('Error creating advertiser:', error);
      throw error;
    }
  }

  // Find advertiser by ID
  static async findById(id) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM advertisers WHERE id = @id');
      if (result.recordset.length === 0) return null;
      return new Advertiser(result.recordset[0]);
    } catch (error) {
      console.error('Error finding advertiser by ID:', error);
      throw error;
    }
  }

  // Get all advertisers with optional filtering and pagination
  static async findAll(filters = {}, page = 1, limit = 10) {
    try {
      const pool = await poolPromise;
      let query = 'SELECT * FROM advertisers WHERE 1=1';
      const request = pool.request();

      if (filters.industry) {
        query += ' AND industry = @industry';
        request.input('industry', sql.NVarChar, filters.industry);
      }

      const offset = (page - 1) * limit;
      query += ' ORDER BY id OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY';
      request.input('offset', sql.Int, offset);
      request.input('limit', sql.Int, limit);

      const result = await request.query(query);
      return result.recordset.map((row) => new Advertiser(row));
    } catch (error) {
      console.error('Error finding all advertisers:', error);
      throw error;
    }
  }

  // Update advertiser information
  static async update(id, updates) {
    try {
      const allowedUpdates = ['company_name', 'company_address', 'company_phone', 'company_email', 'industry'];
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
      const query = `UPDATE advertisers SET ${updateFields.join(', ')} WHERE id = @id`;
      const result = await request.query(query);
      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Error updating advertiser:', error);
      throw error;
    }
  }

  // Delete an advertiser
  static async delete(id) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('id', sql.Int, id)
        .query('DELETE FROM advertisers WHERE id = @id');
      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Error deleting advertiser:', error);
      throw error;
    }
  }
}

module.exports = Advertiser;