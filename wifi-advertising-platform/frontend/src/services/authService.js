// src/services/authService.js
import axios from 'axios';

class AuthService {
  async login(email, password) {
    console.log('Sending login request:', { email, password });
    const response = await axios.post('/api/auth/login', { email, password });
    console.log('Login response:', response.data);
    return response.data.data;
  }

  // Create axios instance for auth requests
  authAxios = axios.create();

  constructor() {
    // Add auth token to requests
    this.authAxios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} - Registration response
   */
  async register(userData) {
    const response = await axios.post('/api/auth/register', userData);
    return response.data;
  }

  /**
   * Logout user (client-side)
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: true, message: 'Logout successful' };
  }

  /**
   * Request password reset
   * @param {Object} email - User email
   * @returns {Promise<Object>} - Password reset request response
   */
  async forgotPassword(email) {
    const response = await axios.post('/api/auth/forgot-password', { email });
    return response.data;
  }

  /**
   * Reset password with token
   * @param {Object} resetData - Password reset data with token
   * @returns {Promise<Object>} - Password reset response
   */
  async resetPassword(resetData) {
    const response = await axios.post('/api/auth/reset-password', resetData);
    return response.data;
  }

  /**
   * Change password for authenticated user
   * @param {Object} passwordData - Old and new password
   * @returns {Promise<Object>} - Password change response
   */
  async changePassword(passwordData) {
    const response = await this.authAxios.post('/api/auth/change-password', passwordData);
    return response.data;
  }

  /**
   * Verify if token is valid
   * @returns {Promise<Object>} - Token verification response
   */
  async verifyToken() {
    const response = await this.authAxios.get('/api/auth/verify-token');
    return response.data;
  }

  /**
   * Get current user data
   * @returns {Promise<Object>} - Current user data
   */
  async getCurrentUser() {
    const response = await this.authAxios.get('/api/auth/me');
    return response.data;
  }

  // Get user from localStorage
  getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return localStorage.getItem('token') !== null;
  }

  // Store user and token in localStorage
  storeUser(user, token) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  }

  // Get token from localStorage
  getToken() {
    return localStorage.getItem('token');
  }
}

export default new AuthService();