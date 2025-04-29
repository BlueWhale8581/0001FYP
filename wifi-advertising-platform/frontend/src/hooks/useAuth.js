// src/hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

/**
 * Custom hook for handling user registration
 */
export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.register(userData);
      setSuccess(true);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
      setSuccess(false);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error, success };
};

/**
 * Custom hook for handling user login
 */
export const useLogin = () => {
  const [user, setUser] = useState(authService.getStoredUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.login(credentials);
      setUser(result.user);
      setIsAuthenticated(true); // Ensure this is set to true
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    const result = authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    return result;
  };

  return { user, loading, error, isAuthenticated, login, logout };
};

/**
 * Custom hook for password reset functionality
 */
export const usePasswordReset = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.forgotPassword(email);
      setSuccess(true);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email');
      setSuccess(false);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (resetData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.resetPassword(resetData);
      setSuccess(true);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
      setSuccess(false);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { 
    forgotPassword, 
    resetPassword, 
    loading, 
    error, 
    success 
  };
};

/**
 * Custom hook for handling user profile operations
 */
export const useUserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCurrentUser = useCallback(async () => {
    try {
      setLoading(true);
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setError(null);
      return userData;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user profile');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only fetch if user is authenticated
    if (authService.isAuthenticated()) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [fetchCurrentUser]);

  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      const result = await authService.changePassword(passwordData);
      setError(null);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    fetchCurrentUser,
    changePassword
  };
};

/**
 * Custom hook for authentication verification
 */
export const useAuthVerification = () => {
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const verifyAuth = useCallback(async () => {
    // Don't even attempt to verify if there's no token
    if (!authService.isAuthenticated()) {
      setVerified(false);
      setLoading(false);
      return false;
    }
    
    try {
      setLoading(true);
      const result = await authService.verifyToken();
      setVerified(result.valid);
      setError(null);
      return result.valid;
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication verification failed');
      setVerified(false);
      // Clear invalid authentication
      authService.logout();
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  return {
    verified,
    loading,
    error,
    verifyAuth
  };
};

/**
 * Main auth hook that combines all the individual auth hooks
 */
export const useAuth = () => {
  const { register, loading: registerLoading, error: registerError, success: registerSuccess } = useRegister();
  const { 
    user, 
    loading: loginLoading, 
    error: loginError, 
    isAuthenticated, 
    login, 
    logout 
  } = useLogin();
  const { 
    forgotPassword, 
    resetPassword, 
    loading: passwordResetLoading, 
    error: passwordResetError,
    success: passwordResetSuccess 
  } = usePasswordReset();
  const {
    user: userProfile,
    loading: userProfileLoading,
    error: userProfileError,
    fetchCurrentUser,
    changePassword
  } = useUserProfile();
  const {
    verified,
    loading: verificationLoading,
    error: verificationError,
    verifyAuth
  } = useAuthVerification();

  // Derive overall loading state
  const loading = registerLoading || loginLoading || passwordResetLoading || userProfileLoading || verificationLoading;

  return {
    // Registration
    register,
    registerError,
    registerSuccess,
    
    // Login/Logout
    login,
    logout,
    loginError,
    isAuthenticated,
    
    // Password management
    forgotPassword,
    resetPassword,
    passwordResetError,
    passwordResetSuccess,
    changePassword,
    
    // User data
    user: user || userProfile,
    fetchCurrentUser,
    userProfileError,
    
    // Verification
    verified,
    verifyAuth,
    verificationError,
    
    // Overall state
    loading
  };
};

export default useAuth;