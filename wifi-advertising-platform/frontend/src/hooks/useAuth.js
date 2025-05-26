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
      const errorMessage = typeof err === 'string' ? err : 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(authService.getStoredUser());
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());

  const login = async ({ email, password }) => {
    try {
      setLoading(true);
      setError(null);
      const { user, token } = await authService.login(email, password);
      
      setUser(user);
      setIsAuthenticated(true);
      
      return { success: true, user };
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
      if (isAuth) {
        setUser(authService.getStoredUser());
      }
    };

    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return { login, logout, loading, error, user, isAuthenticated };
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
  const { 
    user: loginUser, 
    loading: loginLoading, 
    error: loginError, 
    isAuthenticated, 
    login, 
    logout 
  } = useLogin();
  const {
    user: userProfile,
    loading: userProfileLoading,
    error: userProfileError,
    fetchCurrentUser
  } = useUserProfile();

  // Use the user from login if available, otherwise fallback to the user profile
  const user = loginUser || userProfile;

  // Derive overall loading state
  const loading = loginLoading || userProfileLoading;

  return {
    login,
    logout,
    loginError,
    isAuthenticated,
    user,
    fetchCurrentUser,
    userProfileError,
    loading
  };
};

export default useAuth;