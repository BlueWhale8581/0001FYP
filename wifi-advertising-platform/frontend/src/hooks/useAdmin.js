// src/hooks/useAdmin.js
import { useState, useEffect, useCallback } from 'react';
import adminService from '../services/adminService';

/**
 * Custom hook for fetching dashboard statistics
 */
export const useDashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getDashboardStats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
};

/**
 * Custom hook for fetching system metrics
 */
export const useSystemMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getSystemMetrics();
      setMetrics(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load system metrics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return { metrics, loading, error, refetch: fetchMetrics };
};

/**
 * Custom hook for fetching admin notifications
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getNotifications();
      setNotifications(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return { notifications, loading, error, refetch: fetchNotifications };
};

/**
 * Custom hook for fetching system alerts
 */
export const useAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getAlerts();
      setAlerts(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load alerts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  return { alerts, loading, error, refetch: fetchAlerts };
};

/**
 * Custom hook for user management operations
 */
export const useUsers = (initialParams = {}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchUsers = useCallback(async (queryParams = params) => {
    try {
      setLoading(true);
      const data = await adminService.getAllUsers(queryParams);
      setUsers(data.users || []);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
      return null;
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = async (userData) => {
    try {
      setLoading(true);
      const result = await adminService.createUser(userData);
      await fetchUsers();
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId, userData) => {
    try {
      setLoading(true);
      const result = await adminService.updateUser(userId, userData);
      await fetchUsers();
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    try {
      setLoading(true);
      const result = await adminService.deleteUser(userId);
      await fetchUsers();
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const changeUserStatus = async (userId, status) => {
    try {
      setLoading(true);
      const result = await adminService.changeUserStatus(userId, status);
      await fetchUsers();
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change user status');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getUserById = async (userId) => {
    try {
      setLoading(true);
      const result = await adminService.getUserById(userId);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get user details');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    error,
    params,
    setParams,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    changeUserStatus,
    getUserById
  };
};

/**
 * Custom hook for transaction management
 */
export const useTransactions = (initialParams = {}) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchTransactions = useCallback(async (queryParams = params) => {
    try {
      setLoading(true);
      const data = await adminService.getTransactions(queryParams);
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

  const approveTransaction = async (transactionId) => {
    try {
      setLoading(true);
      const result = await adminService.approveTransaction(transactionId);
      await fetchTransactions();
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve transaction');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const rejectTransaction = async (transactionId, reason) => {
    try {
      setLoading(true);
      const result = await adminService.rejectTransaction(transactionId, reason);
      await fetchTransactions();
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject transaction');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getTransactionById = async (transactionId) => {
    try {
      setLoading(true);
      const result = await adminService.getTransactionById(transactionId);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get transaction details');
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
    approveTransaction,
    rejectTransaction,
    getTransactionById
  };
};

/**
 * Custom hook for revenue overview
 */
export const useRevenueOverview = (initialParams = {}) => {
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchRevenue = useCallback(async (queryParams = params) => {
    try {
      setLoading(true);
      const data = await adminService.getRevenueOverview(queryParams);
      setRevenue(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load revenue overview');
      return null;
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchRevenue();
  }, [fetchRevenue]);

  return { revenue, loading, error, params, setParams, refetch: fetchRevenue };
};

/**
 * Custom hook for system reports
 */
export const useSystemReports = (initialParams = {}) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const generateReport = useCallback(async (queryParams = params) => {
    try {
      setLoading(true);
      const data = await adminService.generateSystemReport(queryParams);
      setReport(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate system report');
      return null;
    } finally {
      setLoading(false);
    }
  }, [params]);

  const exportReport = async (exportParams = params) => {
    try {
      setLoading(true);
      const blob = await adminService.exportReportData(exportParams);
      
      // Create a download link for the blob
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `report-${new Date().toISOString()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setError(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to export report');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    report,
    loading,
    error,
    params,
    setParams,
    generateReport,
    exportReport
  };
};

/**
 * Custom hook for analytics data
 */
export const useAnalytics = (initialParams = {}) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchAnalytics = useCallback(async (queryParams = params) => {
    try {
      setLoading(true);
      const data = await adminService.getSystemAnalytics(queryParams);
      setAnalytics(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load analytics');
      return null;
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { analytics, loading, error, params, setParams, refetch: fetchAnalytics };
};

/**
 * Custom hook for performance metrics
 */
export const usePerformanceMetrics = (initialParams = {}) => {
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchPerformanceMetrics = useCallback(async (queryParams = params) => {
    try {
      setLoading(true);
      const data = await adminService.getPerformanceMetrics(queryParams);
      setPerformanceMetrics(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load performance metrics');
      return null;
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchPerformanceMetrics();
  }, [fetchPerformanceMetrics]);

  return {
    performanceMetrics,
    loading,
    error,
    params,
    setParams,
    refetch: fetchPerformanceMetrics
  };
};

/**
 * Custom hook for audit logs
 */
export const useAuditLogs = (initialParams = {}) => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchAuditLogs = useCallback(async (queryParams = params) => {
    try {
      setLoading(true);
      const data = await adminService.getAuditLogs(queryParams);
      setAuditLogs(data.logs || []);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load audit logs');
      return null;
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const getAuditLogById = async (logId) => {
    try {
      setLoading(true);
      const result = await adminService.getAuditLogById(logId);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get audit log details');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    auditLogs,
    loading,
    error,
    params,
    setParams,
    fetchAuditLogs,
    getAuditLogById
  };
};

/**
 * Custom hook for system settings
 */
export const useSystemSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getSystemSettings();
      setSettings(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load system settings');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = async (newSettings) => {
    try {
      setLoading(true);
      const result = await adminService.updateSystemSettings(newSettings);
      await fetchSettings();
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update system settings');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { settings, loading, error, refetch: fetchSettings, updateSettings };
};

/**
 * Custom hook for merchant management
 */
export const useMerchants = (initialParams = {}) => {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchMerchants = useCallback(async (queryParams = params) => {
    try {
      setLoading(true);
      const data = await adminService.getMerchants(queryParams);
      setMerchants(data.merchants || []);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load merchants');
      return null;
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchMerchants();
  }, [fetchMerchants]);

  return { merchants, loading, error, params, setParams, refetch: fetchMerchants };
};

/**
 * Custom hook for advertiser management
 */
export const useAdvertisers = (initialParams = {}) => {
  const [advertisers, setAdvertisers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchAdvertisers = useCallback(async (queryParams = params) => {
    try {
      setLoading(true);
      const data = await adminService.getAdvertisers(queryParams);
      setAdvertisers(data.advertisers || []);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load advertisers');
      return null;
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchAdvertisers();
  }, [fetchAdvertisers]);

  return { advertisers, loading, error, params, setParams, refetch: fetchAdvertisers };
};

/**
 * Custom hook for agent management
 */
export const useAgents = (initialParams = {}) => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchAgents = useCallback(async (queryParams = params) => {
    try {
      setLoading(true);
      const data = await adminService.getAgents(queryParams);
      setAgents(data.agents || []);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load agents');
      return null;
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  return { agents, loading, error, params, setParams, refetch: fetchAgents };
};

/**
 * Custom hook for campaign management
 */
export const useCampaigns = (initialParams = {}) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchCampaigns = useCallback(async (queryParams = params) => {
    try {
      setLoading(true);
      const data = await adminService.getCampaigns(queryParams);
      setCampaigns(data.campaigns || []);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load campaigns');
      return null;
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return { campaigns, loading, error, params, setParams, refetch: fetchCampaigns };
};