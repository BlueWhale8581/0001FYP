import React from 'react';
import { AlertTriangle } from 'lucide-react';

// Template
import DashboardTemplate from '../../templates/DashboardTemplate';

// Common components
import Card from '../../components/common/Card';
import ChartContainer from '../../components/common/ChartContainer';
import StatusIndicator from '../../components/common/StatusIndicator';

// Custom hooks
import { useDashboardStats, useSystemMetrics, useNotifications, useAlerts } from '../../hooks/useAdmin';

const AdminDashboardPage = () => {
  // Using custom hooks to fetch data
  const { stats: dashboardStats, loading: statsLoading, error: statsError } = useDashboardStats();
  const { metrics: systemMetrics, loading: metricsLoading } = useSystemMetrics();
  const { notifications, loading: notificationsLoading } = useNotifications();
  const { alerts, loading: alertsLoading } = useAlerts();
  
  // Combine loading states
  const loading = statsLoading || metricsLoading || notificationsLoading || alertsLoading;

  // Show loading state
  if (loading) {
    return (
      <DashboardTemplate
        role="admin"
        pageTitle="System Overview"
      >
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-gray-600">Loading dashboard data...</p>
        </div>
      </DashboardTemplate>
    );
  }

  // Show error state
  if (statsError) {
    return (
      <DashboardTemplate
        role="admin"
        pageTitle="System Overview"
      >
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-red-600">{statsError}</p>
        </div>
      </DashboardTemplate>
    );
  }

  return (
    <DashboardTemplate
      role="admin"
      userName={dashboardStats?.admin?.name || "Admin"}
      notifications={notifications.slice(0, 3).map(notif => ({
        id: notif._id,
        type: notif.type,
        message: notif.message,
        time: notif.formattedTime || '5m ago',
        read: notif.read
      }))}
      pageTitle="System Overview"
    >
      {/* System Status */}
      <Card title="System Status">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Server Status</p>
              <p className="text-xl font-bold text-blue-600">
                {dashboardStats?.servers?.online || 0}/{dashboardStats?.servers?.total || 0} Online
              </p>
            </div>
            <StatusIndicator 
              status={dashboardStats?.system?.status || "Operational"} 
              color={dashboardStats?.system?.statusColor || "green"} 
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Network Load</p>
              <p className="text-xl font-bold text-blue-600">{dashboardStats?.network?.load || "0%"}</p>
            </div>
            <StatusIndicator 
              status={dashboardStats?.network?.status || "Normal"} 
              color={dashboardStats?.network?.statusColor || "blue"} 
            />
          </div>
        </div>
      </Card>

      {/* User Stats */}
      <Card title="User Statistics">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Active Users</p>
            <p className="text-xl font-bold text-blue-600">{dashboardStats?.users?.active?.toLocaleString() || "0"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">New Today</p>
            <p className="text-xl font-bold text-green-600">+{dashboardStats?.users?.newToday || "0"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-xl font-bold text-blue-600">{dashboardStats?.users?.total?.toLocaleString() || "0"}</p>
          </div>
        </div>
      </Card>

      {/* Recent Alerts */}
      <Card title="Recent Alerts" actionText="View All">
        <div className="space-y-3">
          {alerts && alerts.length > 0 ? (
            alerts.slice(0, 3).map((alert) => (
              <div key={alert._id} className={`flex items-center p-2 bg-${alert.priority}-50 rounded-md`}>
                <AlertTriangle size={20} className={`text-${alert.priority}-600 mr-3`} />
                <div>
                  <p className="text-sm font-medium">{alert.title}</p>
                  <p className="text-xs text-gray-500">{alert.formattedTime}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No alerts found</p>
          )}
        </div>
      </Card>

      {/* System Resources */}
      <ChartContainer title="System Resources" actionText="View Details">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">CPU Usage</span>
              <span className="text-sm font-medium text-gray-800">{systemMetrics?.cpu?.usage || "0%"}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: systemMetrics?.cpu?.usage || "0%" }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Memory Usage</span>
              <span className="text-sm font-medium text-gray-800">{systemMetrics?.memory?.usage || "0%"}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-600 h-2.5 rounded-full" 
                style={{ width: systemMetrics?.memory?.usage || "0%" }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Storage Usage</span>
              <span className="text-sm font-medium text-gray-800">{systemMetrics?.storage?.usage || "0%"}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-purple-600 h-2.5 rounded-full" 
                style={{ width: systemMetrics?.storage?.usage || "0%" }}
              ></div>
            </div>
          </div>
        </div>
      </ChartContainer>
    </DashboardTemplate>
  );
};

export default AdminDashboardPage;