const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const db = require('../config/database');

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
    this.status = userData.status || 'pending';
  }

  // Create a new user
  static async create(userData) {
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const query = `
        INSERT INTO users (username, email, password, role, first_name, last_name, phone, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const [result] = await db.execute(query, [
        userData.username,
        userData.email,
        hashedPassword,
        userData.role,
        userData.first_name,
        userData.last_name,
        userData.phone,
        userData.status || 'pending'
      ]);
      
      return { id: result.insertId, ...userData, password: undefined };
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const query = 'SELECT * FROM users WHERE id = ?';
      const [rows] = await db.execute(query, [id]);
      
      if (rows.length === 0) return null;
      
      const userData = rows[0];
      return new User(userData);
    } catch (error) {
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const query = 'SELECT * FROM users WHERE email = ?';
      const [rows] = await db.execute(query, [email]);
      
      if (rows.length === 0) return null;
      
      const userData = rows[0];
      return new User(userData);
    } catch (error) {
      throw error;
    }
  }

  // Find user by username
  static async findByUsername(username) {
    try {
      const query = 'SELECT * FROM users WHERE username = ?';
      const [rows] = await db.execute(query, [username]);
      
      if (rows.length === 0) return null;
      
      const userData = rows[0];
      return new User(userData);
    } catch (error) {
      throw error;
    }
  }

  // Get all users with optional filtering and pagination
  static async findAll(filters = {}, page = 1, limit = 10) {
    try {
      let query = 'SELECT * FROM users WHERE 1=1';
      const params = [];
      
      if (filters.role) {
        query += ' AND role = ?';
        params.push(filters.role);
      }
      
      if (filters.status) {
        query += ' AND status = ?';
        params.push(filters.status);
      }
      
      // Add pagination
      const offset = (page - 1) * limit;
      query += ' LIMIT ? OFFSET ?';
      params.push(parseInt(limit), parseInt(offset));
      
      const [rows] = await db.execute(query, params);
      
      return rows.map(row => new User(row));
    } catch (error) {
      throw error;
    }
  }

  // Update user information
  static async update(id, updates) {
    try {
      const allowedUpdates = ['username', 'email', 'first_name', 'last_name', 'phone', 'status'];
      const updateFields = [];
      const updateValues = [];
      
      for (const [key, value] of Object.entries(updates)) {
        if (allowedUpdates.includes(key) && value !== undefined) {
          updateFields.push(`${key} = ?`);
          updateValues.push(value);
        }
      }
      
      if (updateFields.length === 0) {
        return false;
      }
      
      const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
      updateValues.push(id);
      
      const [result] = await db.execute(query, updateValues);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Update password
  static async updatePassword(id, newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const query = 'UPDATE users SET password = ? WHERE id = ?';
      
      const [result] = await db.execute(query, [hashedPassword, id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete a user
  static async delete(id) {
    try {
      const query = 'DELETE FROM users WHERE id = ?';
      const [result] = await db.execute(query, [id]);
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Authenticate user
  static async authenticate(usernameOrEmail, password) {
    try {
      const query = 'SELECT * FROM users WHERE username = ? OR email = ?';
      const [rows] = await db.execute(query, [usernameOrEmail, usernameOrEmail]);
      
      if (rows.length === 0) return null;
      
      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) return null;
      
      // Update last login timestamp
      const updateQuery = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?';
      await db.execute(updateQuery, [user.id]);
      
      return new User(user);
    } catch (error) {
      throw error;
    }
  }

  // Count users by role
  static async countByRole() {
    try {
      const query = 'SELECT role, COUNT(*) as count FROM users GROUP BY role';
      const [rows] = await db.execute(query);
      
      return rows;
    } catch (error) {
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