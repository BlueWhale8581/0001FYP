// pages/MerchantDashboardPage.jsx
import React from 'react';
import { User, CreditCard } from 'lucide-react';

// Template
import DashboardTemplate from '../templates/DashboardTemplate';

// Common components
import Card from '../components/common/Card';

// Sample data
const sampleNotifications = [
  { id: 1, type: 'critical', message: 'System maintenance in 30 minutes', time: '5m ago', read: false },
  { id: 2, type: 'info', message: 'New feature available: Export to PDF', time: '2h ago', read: false },
];

const MerchantDashboardPage = () => {
  return (
    <DashboardTemplate
      role="merchant"
      userName="John Smith"
      notifications={sampleNotifications}
      pageTitle="Overview"
    >
      {/* Your dashboard content here */}
      <Card title="Status Overview">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-xl font-bold text-blue-600">127</div>
            <div className="text-xs text-gray-500">Active Users</div>
          </div>
          <div>
            <div className="text-xl font-bold text-green-600">99.8%</div>
            <div className="text-xs text-gray-500">Uptime</div>
          </div>
          <div>
            <div className="text-xl font-bold text-purple-600">842</div>
            <div className="text-xs text-gray-500">Sessions</div>
          </div>
        </div>
      </Card>
      
      <Card title="Recent Activity" actionText="View All" onActionClick={() => console.log('View all clicked')}>
        <div className="space-y-3">
          <div className="flex items-center border-b pb-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <User size={16} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm">New user registered</p>
              <p className="text-xs text-gray-500">10 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <CreditCard size={16} className="text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm">Transaction completed</p>
              <p className="text-xs text-gray-500">25 minutes ago</p>
            </div>
          </div>
        </div>
      </Card>
      
      <Card title="Performance Metrics">
        <div className="h-32 bg-gray-100 rounded flex items-center justify-center text-gray-400">
          Chart Placeholder
        </div>
      </Card>
    </DashboardTemplate>
  );
};

export default MerchantDashboardPage;