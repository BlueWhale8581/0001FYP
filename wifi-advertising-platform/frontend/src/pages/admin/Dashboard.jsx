import React from 'react';
import { Users, Server, Activity, AlertTriangle } from 'lucide-react';

// Template
import DashboardTemplate from '../../templates/DashboardTemplate';

// Common components
import Card from '../../components/common/Card';
import StatusIndicator from '../../components/common/StatusIndicator';
import ChartContainer from '../../components/common/ChartContainer';

const AdminDashboardPage = () => {
  return (
    <DashboardTemplate
      role="admin"
      userName="John Admin"
      notifications={[
        { id: 1, type: 'warning', message: 'System update required', time: '5m ago', read: false },
        { id: 2, type: 'error', message: 'Server #3 is offline', time: '30m ago', read: false },
        { id: 3, type: 'info', message: 'New user registrations: 15', time: '2h ago', read: true },
      ]}
      pageTitle="System Overview"
    >
      {/* System Status */}
      <Card title="System Status">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Server Status</p>
              <p className="text-xl font-bold text-blue-600">5/6 Online</p>
            </div>
            <StatusIndicator status="Operational" color="green" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Network Load</p>
              <p className="text-xl font-bold text-blue-600">68%</p>
            </div>
            <StatusIndicator status="Normal" color="blue" />
          </div>
        </div>
      </Card>

      {/* User Stats */}
      <Card title="User Statistics">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Active Users</p>
            <p className="text-xl font-bold text-blue-600">1,245</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">New Today</p>
            <p className="text-xl font-bold text-green-600">+28</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-xl font-bold text-blue-600">12,456</p>
          </div>
        </div>
      </Card>

      {/* Recent Alerts */}
      <Card title="Recent Alerts" actionText="View All">
        <div className="space-y-3">
          <div className="flex items-center p-2 bg-red-50 rounded-md">
            <AlertTriangle size={20} className="text-red-600 mr-3" />
            <div>
              <p className="text-sm font-medium">Server #3 Offline</p>
              <p className="text-xs text-gray-500">30 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center p-2 bg-yellow-50 rounded-md">
            <AlertTriangle size={20} className="text-yellow-600 mr-3" />
            <div>
              <p className="text-sm font-medium">System Update Required</p>
              <p className="text-xs text-gray-500">5 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center p-2 bg-blue-50 rounded-md">
            <Activity size={20} className="text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium">Unusual Traffic Detected</p>
              <p className="text-xs text-gray-500">1 hour ago</p>
            </div>
          </div>
        </div>
      </Card>

      {/* System Resources */}
      <ChartContainer title="System Resources" actionText="View Details">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">CPU Usage</span>
              <span className="text-sm font-medium text-gray-800">45%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Memory Usage</span>
              <span className="text-sm font-medium text-gray-800">68%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '68%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Storage Usage</span>
              <span className="text-sm font-medium text-gray-800">32%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '32%' }}></div>
            </div>
          </div>
        </div>
      </ChartContainer>
    </DashboardTemplate>
  );
};

export default AdminDashboardPage;