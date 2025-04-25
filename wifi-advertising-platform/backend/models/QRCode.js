const { sql, poolPromise } = require('../config/database');

class QRCode {
  constructor(qrCodeData) {
    this.id = qrCodeData.id;
    this.merchant_id = qrCodeData.merchant_id;
    this.code_image_url = qrCodeData.code_image_url;
    this.activation_status = qrCodeData.activation_status || 'active';
    this.created_by = qrCodeData.created_by;
    this.created_at = qrCodeData.created_at;
    this.updated_at = qrCodeData.updated_at;
  }

  // Create a new QR code
  static async create(qrCodeData) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('merchant_id', sql.Int, qrCodeData.merchant_id)
        .input('code_image_url', sql.NVarChar, qrCodeData.code_image_url)
        .input('activation_status', sql.NVarChar, qrCodeData.activation_status || 'active')
        .input('created_by', sql.Int, qrCodeData.created_by)
        .query(`
          INSERT INTO qr_codes (
            merchant_id, code_image_url, activation_status, created_by
          )
          OUTPUT INSERTED.id
          VALUES (@merchant_id, @code_image_url, @activation_status, @created_by)
        `);
      return { id: result.recordset[0].id, ...qrCodeData };
    } catch (error) {
      console.error('Error creating QR code:', error);
      throw error;
    }
  }

  // Find QR code by ID
  static async findById(id) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM qr_codes WHERE id = @id');
      
      if (result.recordset.length === 0) return null;
      
      const qrCodeData = result.recordset[0];
      return new QRCode(qrCodeData);
    } catch (error) {
      console.error('Error finding QR code by ID:', error);
      throw error;
    }
  }

  // Get all QR codes for a merchant
  static async findByMerchantId(merchantId) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('merchant_id', sql.Int, merchantId)
        .query('SELECT * FROM qr_codes WHERE merchant_id = @merchant_id');
      
      return result.recordset.map(row => new QRCode(row));
    } catch (error) {
      console.error('Error finding QR codes by merchant ID:', error);
      throw error;
    }
  }

  // Get all QR codes created by an agent
  static async findByAgentId(agentId) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('created_by', sql.Int, agentId)
        .query('SELECT * FROM qr_codes WHERE created_by = @created_by');
      
      return result.recordset.map(row => new QRCode(row));
    } catch (error) {
      console.error('Error finding QR codes by agent ID:', error);
      throw error;
    }
  }

  // Update QR code status
  static async updateStatus(id, status) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('id', sql.Int, id)
        .input('activation_status', sql.NVarChar, status)
        .query('UPDATE qr_codes SET activation_status = @activation_status WHERE id = @id');
      
      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Error updating QR code status:', error);
      throw error;
    }
  }

  // Get QR code with merchant data joined
  static async findWithMerchantData(qrCodeId) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('id', sql.Int, qrCodeId)
        .query(`
          SELECT q.*, m.business_name, m.business_address, m.business_category
          FROM qr_codes q
          JOIN merchants m ON q.merchant_id = m.id
          WHERE q.id = @id
        `);
      
      if (result.recordset.length === 0) return null;
      
      return result.recordset[0];
    } catch (error) {
      console.error('Error finding QR code with merchant data:', error);
      throw error;
    }
  }

  // Get active QR code for merchant
  static async findActiveMerchantQRCode(merchantId) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('merchant_id', sql.Int, merchantId)
        .query(`
          SELECT * FROM qr_codes 
          WHERE merchant_id = @merchant_id AND activation_status = 'active'
          ORDER BY created_at DESC
        `);
      
      if (result.recordset.length === 0) return null;
      
      const qrCodeData = result.recordset[0];
      return new QRCode(qrCodeData);
    } catch (error) {
      console.error('Error finding active QR code for merchant:', error);
      throw error;
    }
  }

  // Delete a QR code
  static async delete(id) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('id', sql.Int, id)
        .query('DELETE FROM qr_codes WHERE id = @id');
      
      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Error deleting QR code:', error);
      throw error;
    }
  }
}

module.exports = QRCode;