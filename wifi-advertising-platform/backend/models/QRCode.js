const mysql = require('mysql2/promise');
const db = require('../config/database');

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
      const query = `
        INSERT INTO qr_codes (
          merchant_id, code_image_url, activation_status, created_by
        ) VALUES (?, ?, ?, ?)
      `;
      
      const [result] = await db.execute(query, [
        qrCodeData.merchant_id,
        qrCodeData.code_image_url,
        qrCodeData.activation_status || 'active',
        qrCodeData.created_by
      ]);
      
      return { id: result.insertId, ...qrCodeData };
    } catch (error) {
      throw error;
    }
  }

  // Find QR code by ID
  static async findById(id) {
    try {
      const query = 'SELECT * FROM qr_codes WHERE id = ?';
      const [rows] = await db.execute(query, [id]);
      
      if (rows.length === 0) return null;
      
      const qrCodeData = rows[0];
      return new QRCode(qrCodeData);
    } catch (error) {
      throw error;
    }
  }

  // Get all QR codes for a merchant
  static async findByMerchantId(merchantId) {
    try {
      const query = 'SELECT * FROM qr_codes WHERE merchant_id = ?';
      const [rows] = await db.execute(query, [merchantId]);
      
      return rows.map(row => new QRCode(row));
    } catch (error) {
      throw error;
    }
  }

  // Get all QR codes created by an agent
  static async findByAgentId(agentId) {
    try {
      const query = 'SELECT * FROM qr_codes WHERE created_by = ?';
      const [rows] = await db.execute(query, [agentId]);
      
      return rows.map(row => new QRCode(row));
    } catch (error) {
      throw error;
    }
  }

  // Update QR code status
  static async updateStatus(id, status) {
    try {
      const query = 'UPDATE qr_codes SET activation_status = ? WHERE id = ?';
      const [result] = await db.execute(query, [status, id]);
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get QR code with merchant data joined
  static async findWithMerchantData(qrCodeId) {
    try {
      const query = `
        SELECT q.*, m.business_name, m.business_address, m.business_category
        FROM qr_codes q
        JOIN merchants m ON q.merchant_id = m.id
        WHERE q.id = ?
      `;
      
      const [rows] = await db.execute(query, [qrCodeId]);
      
      if (rows.length === 0) return null;
      
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get active QR code for merchant
  static async findActiveMerchantQRCode(merchantId) {
    try {
      const query = `
        SELECT * FROM qr_codes 
        WHERE merchant_id = ? AND activation_status = 'active'
        ORDER BY created_at DESC LIMIT 1
      `;
      
      const [rows] = await db.execute(query, [merchantId]);
      
      if (rows.length === 0) return null;
      
      const qrCodeData = rows[0];
      return new QRCode(qrCodeData);
    } catch (error) {
      throw error;
    }
  }

  // Delete a QR code
  static async delete(id) {
    try {
      const query = 'DELETE FROM qr_codes WHERE id = ?';
      const [result] = await db.execute(query, [id]);
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = QRCode;