// src/hooks/useUser.js
import { useState, useEffect, useCallback } from 'react';
import userService from '../services/userService';

/**
 * Custom hook for user dashboard data
 */
export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const data = await userService.getDashboard();
      setDashboardData(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    dashboardData,
    loading,
    error,
    refetch: fetchDashboard
  };
};

/**
 * Custom hook for user profile management
 */
export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const data = await userService.getUserProfile();
      setProfile(data.profile || null);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load user profile');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const result = await userService.updateUserProfile(profileData);
      setProfile(result.profile || null);
      setError(null);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user profile');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      const result = await userService.changePassword(passwordData);
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
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    changePassword
  };
};

/**
 * Custom hook for user notifications
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await userService.getUserNotifications();
      setNotifications(data.notifications || []);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load notifications');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (notificationId) => {
    try {
      setLoading(true);
      const result = await userService.markNotificationRead(notificationId);
      // Update local state to mark notification as read
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
      setError(null);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark notification as read');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      setLoading(true);
      const result = await userService.markAllNotificationsRead();
      // Update all notifications in local state to read
      setNotifications(prevNotifications =>
        prevNotifications.map(notification => ({ ...notification, read: true }))
      );
      setError(null);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark all notifications as read');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      setLoading(true);
      const result = await userService.deleteNotification(notificationId);
      // Remove deleted notification from local state
      setNotifications(prevNotifications =>
        prevNotifications.filter(notification => notification.id !== notificationId)
      );
      setError(null);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete notification');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    notifications,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
};

/**
 * Custom hook for user settings
 */
export const useSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateSettings = async (settingsData) => {
    try {
      setLoading(true);
      const result = await userService.updateUserSettings(settingsData);
      setSettings(result.settings || null);
      setError(null);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update settings');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    settings,
    loading,
    error,
    updateSettings
  };
};

/**
 * Custom hook for user feedback
 */
export const useFeedback = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submitFeedback = async (feedbackData) => {
    try {
      setLoading(true);
      setSuccess(false);
      const result = await userService.submitFeedback(feedbackData);
      setSuccess(true);
      setError(null);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback');
      setSuccess(false);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    loading,
    error,
    success,
    submitFeedback,
    resetState
  };
};

/**
 * Custom hook for user transactions
 */
export const useTransactions = (initialParams = {}) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchTransactions = useCallback(async (queryParams = params) => {
    try {
      setLoading(true);
      const data = await userService.getUserTransactions(queryParams);
      setTransactions(data.transactions || []);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load transactions');
      return null;
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const getTransactionDetails = async (transactionId) => {
    try {
      setLoading(true);
      const data = await userService.getTransactionDetails(transactionId);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load transaction details');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    transactions,
    loading,
    error,
    params,
    setParams,
    fetchTransactions,
    getTransactionDetails
  };
};

export default {
  useDashboard,
  useProfile,
  useNotifications,
  useSettings,
  useFeedback,
  useTransactions
};