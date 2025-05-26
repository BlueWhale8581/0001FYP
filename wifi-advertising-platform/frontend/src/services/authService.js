// src/services/authService.js
import axios from 'axios';

class AuthService {
  async login(email, password) {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { data } = response.data;
      
      if (data.user && data.token) {
        // Store in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        
        // Set default auth header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        
        return data;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  isAuthenticated() {
    const token = this.getToken();
    const user = this.getStoredUser();
    return !!(token && user);
  }

  // Create axios instance for auth requests
  authAxios = axios.create();

  constructor() {
    const token = this.getToken();
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
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
   * Logout user (client-side)
   */
  logout() {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Failed to clear user data:', error);
    }
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

  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} - Profile update response
   */
  async updateProfile(profileData) {
    try {
      const response = await this.authAxios.put('/api/auth/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} - Registration response
   */
  async register(userData) {
    try {
      const response = await axios.post('/api/auth/register', {
        ...userData,
        role: userData.role.toUpperCase()
      });
      
      // Check if we have the response and user ID
      if (response.data && response.data.userId) {
        return {
          success: true,
          id: response.data.userId
        };
      }
      throw new Error('Registration failed - Invalid server response');
    } catch (error) {
      console.error('Registration error:', error);
      throw error.response?.data?.message || 'Registration failed';
    }
  }

  getStoredUser() {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch (error) {
      return null;
    }
  }

  getToken() {
    return localStorage.getItem('token');
  }
}

// Export a single instance
const authService = new AuthService();
export default authService;