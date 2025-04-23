import React from 'react';
import { Home, Users, CreditCard, FileText, User } from 'lucide-react';

// Template
import DashboardTemplate from '../../templates/DashboardTemplate';

// Common components
import Card from '../../components/common/Card';
import StatusIndicator from '../../components/common/StatusIndicator';
import MetricsChart from '../../components/common/MetricsChart';
import QuickActions from '../../components/common/QuickActions';
import ActivityFeed from '../../components/common/ActivityFeed';

const AgentDashboardPage = () => {
  // Mock data for agent dashboard
  const recentActivities = [
    { icon: <Users size={16} />, title: 'New merchant registered', time: '2 hours ago' },
    { icon: <CreditCard size={16} />, title: 'Commission received', time: '1 day ago' },
    { icon: <FileText size={16} />, title: 'QR code generated', time: '2 days ago' },
  ];

  const quickActionItems = [
    { label: 'Add New Merchant', onClick: () => console.log('Add merchant clicked') },
    { label: 'Generate QR Code', onClick: () => console.log('Generate QR clicked') },
    { label: 'View Earnings', onClick: () => console.log('View earnings clicked') },
  ];

  return (
    <DashboardTemplate
      role="agent"
      userName="Agent Smith"
      notifications={[
        { id: 1, type: 'info', message: 'New merchant registration pending approval', time: '30m ago', read: false },
        { id: 2, type: 'success', message: 'Commission payment processed.', time: '1d ago', read: true },
      ]}
      pageTitle="Agent Dashboard"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Merchant Stats */}
        <Card title="Merchant Stats">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-500">Total Merchants</p>
              <p className="text-xl font-bold text-orange-500">24</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Merchants</p>
              <p className="text-xl font-bold text-green-500">18</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Approval</p>
              <p className="text-xl font-bold text-yellow-500">3</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Inactive</p>
              <p className="text-xl font-bold text-red-500">3</p>
            </div>
          </div>
        </Card>

        {/* QR Code Stats */}
        <Card title="QR Code Stats">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-500">Total Generated</p>
              <p className="text-xl font-bold text-orange-500">87</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Active QR Codes</p>
              <p className="text-xl font-bold text-green-500">72</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Scanned Today</p>
              <p className="text-xl font-bold text-blue-500">15</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Conversion Rate</p>
              <p className="text-xl font-bold text-purple-500">68%</p>
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
              <p className="text-xl font-bold text-green-500">$1,248.50</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Month</p>
              <p className="text-xl font-bold text-gray-500">$1,082.75</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Growth</p>
              <p className="text-xl font-bold text-blue-500">+15.3%</p>
            </div>
          </div>
          <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Earnings Chart Placeholder</p>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card title="Quick Actions">
          <div className="space-y-2">
            {quickActionItems.map((action, index) => (
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
                <div className="h-full bg-orange-500" style={{ width: '75%' }}></div>
              </div>
              <p className="text-sm font-medium">75%</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">QR Code Generation</p>
              <div className="w-32 h-4 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500" style={{ width: '82%' }}></div>
              </div>
              <p className="text-sm font-medium">82%</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Commission Rate</p>
              <div className="w-32 h-4 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500" style={{ width: '68%' }}></div>
              </div>
              <p className="text-sm font-medium">68%</p>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card title="Recent Activity">
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
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