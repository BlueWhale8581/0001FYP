import React, { useEffect } from 'react';
import { Home, Users, CreditCard, FileText, User } from 'lucide-react';

// Template
import DashboardTemplate from '../../templates/DashboardTemplate';

// Common components
import Card from '../../components/common/Card';
import StatusIndicator from '../../components/common/StatusIndicator';
import MetricsChart from '../../components/dashboard/MetricsChart';
import QuickActions from '../../components/dashboard/QuickActions';
import ActivityFeed from '../../components/dashboard/ActivityFeed';
import LoadingState from '../../components/common/LoadingState';

// Custom hooks
import useAgent from '../../hooks/useAgent';
import useAuth from '../../hooks/useAuth';

const AgentDashboardPage = () => {
  const { user, isAuthenticated, fetchCurrentUser } = useAuth();
  const { useDashboardStats, useNotifications, useMerchants, useQRCodes } = useAgent();
  const { stats, loading: statsLoading, error: statsError } = useDashboardStats();
  const { notifications, loading: notifLoading } = useNotifications();
  const { merchants, loading: merchantsLoading } = useMerchants();
  const { qrCodes, loading: qrLoading } = useQRCodes();

  useEffect(() => {
    if (isAuthenticated && !user) {
      fetchCurrentUser();
    }
  }, [isAuthenticated, user, fetchCurrentUser]);

  const isLoading = statsLoading || notifLoading || merchantsLoading || qrLoading || !user;

  if (!isAuthenticated) {
    return (
      <DashboardTemplate
        role="agent"
        userName="Guest"
        notifications={[]}
        pageTitle="Agent Dashboard"
      >
        <p className="text-center text-gray-500">Please log in to access the dashboard.</p>
      </DashboardTemplate>
    );
  }

  if (isLoading) {
    return (
      <DashboardTemplate
        role="agent"
        userName={user?.name || "Agent"}
        notifications={[]}
        pageTitle="Agent Dashboard"
      >
        <LoadingState message="Loading dashboard data..." />
      </DashboardTemplate>
    );
  }

  return (
    <DashboardTemplate
      role="agent"
      userName={user?.name || stats?.agentName || "Agent"}
      notifications={notifications || []}
      pageTitle="Agent Dashboard"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Merchant Stats */}
        <Card title="Merchant Stats">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-500">Total Merchants</p>
              <p className="text-xl font-bold text-orange-500">{stats?.totalMerchants || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Merchants</p>
              <p className="text-xl font-bold text-green-500">{stats?.activeMerchants || 0}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Approval</p>
              <p className="text-xl font-bold text-yellow-500">{stats?.pendingMerchants || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Inactive</p>
              <p className="text-xl font-bold text-red-500">{stats?.inactiveMerchants || 0}</p>
            </div>
          </div>
        </Card>

        {/* QR Code Stats */}
        <Card title="QR Code Stats">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-500">Total Generated</p>
              <p className="text-xl font-bold text-orange-500">{stats?.totalQRCodes || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Active QR Codes</p>
              <p className="text-xl font-bold text-green-500">{stats?.activeQRCodes || 0}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Scanned Today</p>
              <p className="text-xl font-bold text-blue-500">{stats?.scannedToday || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Conversion Rate</p>
              <p className="text-xl font-bold text-purple-500">{stats?.conversionRate || 0}%</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Earnings Summary */}
        <Card title="Earnings Summary" className="md:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-500">This Month</p>
              <p className="text-xl font-bold text-green-500">${stats?.earningsThisMonth || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Month</p>
              <p className="text-xl font-bold text-gray-500">${stats?.earningsLastMonth || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Growth</p>
              <p className="text-xl font-bold text-blue-500">{stats?.growth || 0}%</p>
            </div>
          </div>
          <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Earnings Chart Placeholder</p>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card title="Quick Actions">
          <div className="space-y-2">
            {stats?.quickActions?.map((action, index) => (
              <button
                key={index}
                className="w-full p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                onClick={action.onClick}
              >
                {action.label}
              </button>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Performance Overview */}
        <Card title="Performance Overview">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Merchant Acquisition</p>
              <div className="w-32 h-4 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500" style={{ width: `${stats?.merchantAcquisition || 0}%` }}></div>
              </div>
              <p className="text-sm font-medium">{stats?.merchantAcquisition || 0}%</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">QR Code Generation</p>
              <div className="w-32 h-4 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500" style={{ width: `${stats?.qrCodeGeneration || 0}%` }}></div>
              </div>
              <p className="text-sm font-medium">{stats?.qrCodeGeneration || 0}%</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Commission Rate</p>
              <div className="w-32 h-4 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500" style={{ width: `${stats?.commissionRate || 0}%` }}></div>
              </div>
              <p className="text-sm font-medium">{stats?.commissionRate || 0}%</p>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card title="Recent Activity">
          <div className="space-y-3">
            {notifications?.map((activity, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center">
                  {activity.icon}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardTemplate>
  );
};

export default AgentDashboardPage;