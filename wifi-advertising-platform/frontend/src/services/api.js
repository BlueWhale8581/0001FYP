// src/services/api.js
import axios from 'axios';

// Create axios instance with base URL and common configs
const API = axios.create({
  baseURL: 'http://localhost:6419/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for adding auth token
API.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor for handling common errors
API.interceptors.response.use(
  response => response,
  error => {
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      // Redirect to login or refresh token
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;