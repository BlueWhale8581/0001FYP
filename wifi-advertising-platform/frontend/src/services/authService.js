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
}

const storeUser = (user, token) => {
  try {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  } catch (error) {
    console.error('Failed to store user data:', error);
  }
};

const getStoredUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null; // Return null if user is not found
  } catch (error) {
    console.error('Failed to parse stored user:', error);
    return null; // Return null if parsing fails
  }
};

const getToken = () => {
  try {
    return localStorage.getItem('token') || null; // Return null if token is not found
  } catch (error) {
    console.error('Failed to retrieve token:', error);
    return null;
  }
};

const login = async (email, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const { data } = await response.json();
  const { user, token } = data;
  return { user, token };
};

export default {
  storeUser,
  getStoredUser,
  getToken,
  login,
};