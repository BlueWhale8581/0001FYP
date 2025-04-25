const { sql, poolPromise } = require('../config/database');

class Transaction {
  constructor(transactionData) {
    this.id = transactionData.id;
    this.type = transactionData.type;
    this.amount = transactionData.amount;
    this.status = transactionData.status || 'pending';
    this.reference_id = transactionData.reference_id;
    this.merchant_id = transactionData.merchant_id;
    this.advertiser_id = transactionData.advertiser_id;
    this.agent_id = transactionData.agent_id;
    this.campaign_id = transactionData.campaign_id;
    this.description = transactionData.description;
    this.created_at = transactionData.created_at;
    this.updated_at = transactionData.updated_at;
  }

  // Create a new transaction
  static async create(transactionData) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('type', sql.NVarChar, transactionData.type)
        .input('amount', sql.Decimal(10, 2), transactionData.amount)
        .input('status', sql.NVarChar, transactionData.status || 'pending')
        .input('reference_id', sql.NVarChar, transactionData.reference_id)
        .input('merchant_id', sql.Int, transactionData.merchant_id)
        .input('advertiser_id', sql.Int, transactionData.advertiser_id)
        .input('agent_id', sql.Int, transactionData.agent_id)
        .input('campaign_id', sql.Int, transactionData.campaign_id)
        .input('description', sql.NVarChar, transactionData.description)
        .query(`
          INSERT INTO transactions (type, amount, status, reference_id, merchant_id, advertiser_id, agent_id, campaign_id, description)
          OUTPUT INSERTED.id
          VALUES (@type, @amount, @status, @reference_id, @merchant_id, @advertiser_id, @agent_id, @campaign_id, @description)
        `);
      return { id: result.recordset[0].id, ...transactionData };
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  // Find transaction by ID
  static async findById(id) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM transactions WHERE id = @id');
      if (result.recordset.length === 0) return null;
      return new Transaction(result.recordset[0]);
    } catch (error) {
      console.error('Error finding transaction by ID:', error);
      throw error;
    }
  }

  // Update transaction status
  static async updateStatus(id, status, referenceId = null) {
    try {
      const pool = await poolPromise;
      const request = pool.request();
      request.input('id', sql.Int, id).input('status', sql.NVarChar, status);
      if (referenceId) {
        request.input('reference_id', sql.NVarChar, referenceId);
      }
      const query = `
        UPDATE transactions
        SET status = @status ${referenceId ? ', reference_id = @reference_id' : ''}
        WHERE id = @id
      `;
      const result = await request.query(query);
      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Error updating transaction status:', error);
      throw error;
    }
  }
}

module.exports = Transaction;