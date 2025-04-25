const { sql, poolPromise } = require('../config/database');

class Agent {
  constructor(agentData) {
    this.id = agentData.id;
    this.commission_rate = agentData.commission_rate;
    this.territory = agentData.territory;
    this.created_at = agentData.created_at;
    this.updated_at = agentData.updated_at;
  }

  // Create a new agent
  static async create(agentData) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('id', sql.Int, agentData.id)
        .input('commission_rate', sql.Decimal(10, 2), agentData.commission_rate || 0.0)
        .input('territory', sql.NVarChar, agentData.territory)
        .query(`
          INSERT INTO agents (id, commission_rate, territory)
          OUTPUT INSERTED.id
          VALUES (@id, @commission_rate, @territory)
        `);
      return { id: result.recordset[0].id, ...agentData };
    } catch (error) {
      console.error('Error creating agent:', error);
      throw error;
    }
  }

  // Find agent by ID
  static async findById(id) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM agents WHERE id = @id');
      if (result.recordset.length === 0) return null;
      return new Agent(result.recordset[0]);
    } catch (error) {
      console.error('Error finding agent by ID:', error);
      throw error;
    }
  }

  // Get all agents with optional filtering and pagination
  static async findAll(filters = {}, page = 1, limit = 10) {
    try {
      const pool = await poolPromise;
      let query = 'SELECT * FROM agents WHERE 1=1';
      const request = pool.request();

      if (filters.territory) {
        query += ' AND territory = @territory';
        request.input('territory', sql.NVarChar, filters.territory);
      }

      const offset = (page - 1) * limit;
      query += ' ORDER BY id OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY';
      request.input('offset', sql.Int, offset);
      request.input('limit', sql.Int, limit);

      const result = await request.query(query);
      return result.recordset.map((row) => new Agent(row));
    } catch (error) {
      console.error('Error finding all agents:', error);
      throw error;
    }
  }
}

module.exports = Agent;