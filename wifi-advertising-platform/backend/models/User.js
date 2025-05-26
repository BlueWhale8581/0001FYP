const { sql, poolPromise } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  constructor(userData) {
    this.id = userData.id;
    this.username = userData.username;
    this.email = userData.email;
    this.password = userData.password;
    this.role = userData.role;
    this.first_name = userData.first_name;
    this.last_name = userData.last_name;
    this.phone = userData.phone;
    this.created_at = userData.created_at;
    this.updated_at = userData.updated_at;
    this.last_login = userData.last_login;
    this.status = userData.status || 'ACTIVE';
  }

  // Create a new user
  static async create(userData) {
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('username', sql.NVarChar, userData.username)
        .input('email', sql.NVarChar, userData.email)
        .input('password', sql.NVarChar, hashedPassword)
        .input('role', sql.NVarChar, userData.role.toUpperCase())
        .input('first_name', sql.NVarChar, userData.first_name)
        .input('last_name', sql.NVarChar, userData.last_name)
        .input('phone', sql.NVarChar, userData.phone)
        .input('status', sql.NVarChar, userData.status.toUpperCase() || 'PENDING')
        .query(`
          INSERT INTO users (username, email, password, role, first_name, last_name, phone, status)
          OUTPUT INSERTED.id
          VALUES (@username, @email, @password, @role, @first_name, @last_name, @phone, @status)
        `);
      
      return { id: result.recordset[0].id, ...userData, password: undefined };
    } catch (error) {
      console.error('Error in User.create:', error);
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM users WHERE id = @id');

      if (result.recordset.length === 0) return null;

      return new User(result.recordset[0]);
    } catch (error) {
      console.error('Error in User.findById:', error);
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('email', sql.NVarChar, email)
        .query('SELECT * FROM users WHERE email = @email');

      if (result.recordset.length === 0) return null;

      return new User(result.recordset[0]);
    } catch (error) {
      console.error('Error in User.findByEmail:', error);
      throw error;
    }
  }

  // Find user by username
  static async findByUsername(username) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('username', sql.NVarChar, username)
        .query('SELECT * FROM users WHERE username = @username');

      if (result.recordset.length === 0) return null;

      return new User(result.recordset[0]);
    } catch (error) {
      console.error('Error in User.findByUsername:', error);
      throw error;
    }
  }

  // Get all users with optional filtering and pagination
  static async findAll(filters = {}, page = 1, limit = 10) {
    try {
      let query = 'SELECT * FROM users WHERE 1=1';
      const params = [];
      
      if (filters.role) {
        query += ' AND role = @role';
        params.push({ name: 'role', type: sql.NVarChar, value: filters.role });
      }
      
      if (filters.status) {
        query += ' AND status = @status';
        params.push({ name: 'status', type: sql.NVarChar, value: filters.status });
      }
      
      // Add pagination
      const offset = (page - 1) * limit;
      query += ' ORDER BY id OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY';
      params.push({ name: 'offset', type: sql.Int, value: offset });
      params.push({ name: 'limit', type: sql.Int, value: limit });
      
      const pool = await poolPromise;
      const request = pool.request();
      params.forEach(param => request.input(param.name, param.type, param.value));
      const result = await request.query(query);
      
      return result.recordset.map(row => new User(row));
    } catch (error) {
      console.error('Error in User.findAll:', error);
      throw error;
    }
  }

  // Update user information
  static async update(id, updates) {
    try {
      const allowedUpdates = ['username', 'email', 'first_name', 'last_name', 'phone', 'status'];
      const updateFields = [];
      const params = [];
      
      for (const [key, value] of Object.entries(updates)) {
        if (allowedUpdates.includes(key) && value !== undefined) {
          updateFields.push(`${key} = @${key}`);
          params.push({ name: key, type: sql.NVarChar, value });
        }
      }
      
      if (updateFields.length === 0) {
        return false;
      }
      
      const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = @id`;
      params.push({ name: 'id', type: sql.Int, value: id });
      
      const pool = await poolPromise;
      const request = pool.request();
      params.forEach(param => request.input(param.name, param.type, param.value));
      const result = await request.query(query);
      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Error in User.update:', error);
      throw error;
    }
  }

  // Update user last login
  static async updateLogin(id) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('id', sql.Int, id)
        .query('UPDATE users SET last_login = GETDATE() WHERE id = @id');
      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Error in User.updateLogin:', error);
      throw error;
    }
  }

  // Update password
  static async updatePassword(id, newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('password', sql.NVarChar, hashedPassword)
        .input('id', sql.Int, id)
        .query('UPDATE users SET password = @password WHERE id = @id');
      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Error in User.updatePassword:', error);
      throw error;
    }
  }

  // Delete a user
  static async delete(id) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('id', sql.Int, id)
        .query('DELETE FROM users WHERE id = @id');
      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Error in User.delete:', error);
      throw error;
    }
  }

  // Authenticate user
  static async authenticate(email, password) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('email', sql.NVarChar, email)
        .query('SELECT * FROM users WHERE email = @email');

      if (result.recordset.length === 0) return null;

      const user = result.recordset[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) return null;

      // Update last login timestamp
      await pool
        .request()
        .input('id', sql.Int, user.id)
        .query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = @id');

      return new User(user);
    } catch (error) {
      console.error('Error in User.authenticate:', error);
      throw error;
    }
  }

  // Count users by role
  static async countByRole() {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .query('SELECT role, COUNT(*) as count FROM users GROUP BY role');
      return result.recordset;
    } catch (error) {
      console.error('Error in User.countByRole:', error);
      throw error;
    }
  }

  // Get user profile data (excluding sensitive info)
  getProfileData() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      role: this.role,
      first_name: this.first_name,
      last_name: this.last_name,
      phone: this.phone,
      status: this.status,
      created_at: this.created_at,
      last_login: this.last_login
    };
  }
}

module.exports = User;