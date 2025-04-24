// src/services/authService.js
import axios from 'axios';

const API_URL = '/api/auth';

// Create axios instance for auth requests
const authAxios = axios.create();

// Add auth token to requests
authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} - Registration response
 */
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

/**
 * Login user
 * @param {Object} credentials - User login credentials
 * @returns {Promise<Object>} - Login response with user data and token
 */
const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

/**
 * Logout user (client-side)
 */
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return { success: true, message: 'Logout successful' };
};

/**
 * Request password reset
 * @param {Object} email - User email
 * @returns {Promise<Object>} - Password reset request response
 */
const forgotPassword = async (email) => {
  const response = await axios.post(`${API_URL}/forgot-password`, { email });
  return response.data;
};

/**
 * Reset password with token
 * @param {Object} resetData - Password reset data with token
 * @returns {Promise<Object>} - Password reset response
 */
const resetPassword = async (resetData) => {
  const response = await axios.post(`${API_URL}/reset-password`, resetData);
  return response.data;
};

/**
 * Change password for authenticated user
 * @param {Object} passwordData - Old and new password
 * @returns {Promise<Object>} - Password change response
 */
const changePassword = async (passwordData) => {
  const response = await authAxios.post(`${API_URL}/change-password`, passwordData);
  return response.data;
};

/**
 * Verify if token is valid
 * @returns {Promise<Object>} - Token verification response
 */
const verifyToken = async () => {
  const response = await authAxios.get(`${API_URL}/verify-token`);
  return response.data;
};

/**
 * Get current user data
 * @returns {Promise<Object>} - Current user data
 */
const getCurrentUser = async () => {
  const response = await authAxios.get(`${API_URL}/me`);
  return response.data;
};

// Get user from localStorage
const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Check if user is authenticated
const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

const authService = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyToken,
  getCurrentUser,
  getStoredUser,
  isAuthenticated
};

export default authService;