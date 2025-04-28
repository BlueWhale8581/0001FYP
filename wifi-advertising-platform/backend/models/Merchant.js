const { sql, poolPromise } = require('../config/database');

class Merchant {
  constructor(merchantData) {
    this.id = merchantData.id;
    this.business_name = merchantData.business_name;
    this.business_address = merchantData.business_address;
    this.business_phone = merchantData.business_phone;
    this.business_email = merchantData.business_email;
    this.business_category = merchantData.business_category;
    this.tax_id = merchantData.tax_id;
    this.logo_url = merchantData.logo_url;
    this.agent_id = merchantData.agent_id;
    this.approval_status = merchantData.approval_status || 'pending';
    this.created_at = merchantData.created_at;
    this.updated_at = merchantData.updated_at;
  }

  // Create a new merchant
  static async create(merchantData) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('id', sql.Int, merchantData.id)
        .input('business_name', sql.NVarChar, merchantData.business_name)
        .input('business_address', sql.NVarChar, merchantData.business_address)
        .input('business_phone', sql.NVarChar, merchantData.business_phone)
        .input('business_email', sql.NVarChar, merchantData.business_email)
        .input('business_category', sql.NVarChar, merchantData.business_category)
        .input('tax_id', sql.NVarChar, merchantData.tax_id)
        .input('logo_url', sql.NVarChar, merchantData.logo_url)
        .input('agent_id', sql.Int, merchantData.agent_id)
        .input('approval_status', sql.NVarChar, merchantData.approval_status || 'pending')
        .query(`
          INSERT INTO merchants (
            id, business_name, business_address, business_phone, business_email,
            business_category, tax_id, logo_url, agent_id, approval_status
          )
          OUTPUT INSERTED.id
          VALUES (
            @id, @business_name, @business_address, @business_phone, @business_email,
            @business_category, @tax_id, @logo_url, @agent_id, @approval_status
          )
        `);
      return { id: result.recordset[0].id, ...merchantData };
    } catch (error) {
      console.error('Error creating merchant:', error);
      throw error;
    }
  }

  // Find merchant by ID
  static async findById(id) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM merchants WHERE id = @id');
      if (result.recordset.length === 0) return null;
      return new Merchant(result.recordset[0]);
    } catch (error) {
      console.error('Error finding merchant by ID:', error);
      throw error;
    }
  }

  // Get all merchants with optional filtering and pagination
  static async findAll(filters = {}, page = 1, limit = 10) {
    try {
      const pool = await poolPromise;
      let query = 'SELECT * FROM merchants WHERE 1=1';
      const request = pool.request();

      if (filters.agent_id) {
        query += ' AND agent_id = @agent_id';
        request.input('agent_id', sql.Int, filters.agent_id);
      }

      if (filters.approval_status) {
        query += ' AND approval_status = @approval_status';
        request.input('approval_status', sql.NVarChar, filters.approval_status);
      }

      const offset = (page - 1) * limit;
      query += ' ORDER BY id OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY';
      request.input('offset', sql.Int, offset);
      request.input('limit', sql.Int, limit);

      const result = await request.query(query);
      return result.recordset.map((row) => new Merchant(row));
    } catch (error) {
      console.error('Error finding all merchants:', error);
      throw error;
    }
  }

  // Find merchants by agent ID
  static async findByAgentId(agentId) {
    try {
      const pool = await poolPromise;
      const query = `
        SELECT * 
        FROM merchants 
        WHERE agent_id = @agentId
      `;
      const result = await pool
        .request()
        .input('agentId', sql.Int, agentId)
        .query(query);

      return result.recordset;
    } catch (error) {
      console.error('Error in Merchant.findByAgentId:', error);
      throw error;
    }
  }

  // Update merchant information
  static async update(id, updates) {
    try {
      const allowedUpdates = [
        'business_name', 'business_address', 'business_phone',
        'business_email', 'business_category', 'tax_id',
        'logo_url', 'agent_id', 'approval_status',
      ];
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
      const query = `UPDATE merchants SET ${updateFields.join(', ')} WHERE id = @id`;
      const result = await request.query(query);
      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Error updating merchant:', error);
      throw error;
    }
  }

  // Delete a merchant
  static async delete(id) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('id', sql.Int, id)
        .query('DELETE FROM merchants WHERE id = @id');
      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Error deleting merchant:', error);
      throw error;
    }
  }

  // Count merchants by approval status
  static async countByStatus(status) {
    try {
      const pool = await poolPromise;
      const query = `
        SELECT COUNT(*) AS count
        FROM merchants
        WHERE approval_status = @status
      `;
      const result = await pool.request()
        .input('status', sql.NVarChar, status)
        .query(query);

      return result.recordset[0].count;
    } catch (error) {
      console.error('Error in Merchant.countByStatus:', error);
      throw error;
    }
  }
}

module.exports = Merchant;