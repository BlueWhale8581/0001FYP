import React from 'react';
import { Wifi, CreditCard, Store, Users } from 'lucide-react';

// Template
import DashboardTemplate from '../../templates/DashboardTemplate';

// Common components
import Card from '../../components/common/Card';
import StatusIndicator from '../../components/common/StatusIndicator';
import ChartContainer from '../../components/common/ChartContainer';
import QuickActions from '../../components/dashboard/QuickActions';
import MetricsChart from '../../components/dashboard/MetricsChart';

const MerchantDashboardPage = () => {
  const placeholderChart = <div className="h-48 bg-gray-100 rounded flex items-center justify-center">Chart Placeholder</div>;
  
  const quickActions = [
    { label: 'Configure WiFi', onClick: () => console.log('Configure WiFi clicked') },
    { label: 'View Analytics', onClick: () => console.log('View Analytics clicked') },
    { label: 'Manage Promotions', onClick: () => console.log('Manage Promotions clicked') }
  ];

  return (
    <DashboardTemplate
      role="merchant"
      userName="Coffee Shop Owner"
      notifications={[
        { id: 1, type: 'info', message: 'New ad campaign available!', time: '15m ago', read: false },
        { id: 2, type: 'success', message: 'WiFi usage increased by 15%.', time: '3h ago', read: true },
        { id: 3, type: 'warning', message: 'WiFi service will be updated tonight.', time: '5h ago', read: false },
      ]}
      pageTitle="Business Dashboard"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* WiFi Status */}
        <Card title="WiFi Status" actionText="Configure" onActionClick={() => console.log('Configure WiFi')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Current Status</p>
              <p className="text-xl font-bold text-green-600">Online</p>
            </div>
            <StatusIndicator status="Active" color="green" />
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">Users Connected</p>
            <p className="text-xl font-bold">24</p>
          </div>
        </Card>

        {/* Today's Revenue */}
        <Card title="Today's Revenue" actionText="Details" onActionClick={() => console.log('View Revenue Details')}>
          <div>
            <p className="text-sm text-gray-500">Revenue Generated</p>
            <p className="text-2xl font-bold text-green-600">$123.45</p>
            <p className="text-xs text-green-500 mt-1">+15% from yesterday</p>
          </div>
        </Card>

        {/* Weekly Performance */}
        <ChartContainer title="Weekly Performance" className="md:col-span-2">
          {placeholderChart}
        </ChartContainer>
        
        {/* Shop Information */}
        <Card title="Shop Information">
          <div className="space-y-2">
            <div className="flex items-center">
              <Store size={20} className="text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium">Coffee Shop</p>
                <p className="text-xs text-gray-500">Downtown Branch</p>
              </div>
            </div>
            <div className="flex items-center">
              <Users size={20} className="text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium">247 Registered Users</p>
                <p className="text-xs text-gray-500">+12 this week</p>
              </div>
            </div>
            <div className="flex items-center">
              <Wifi size={20} className="text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium">WiFi Network: CoffeeShop_Free</p>
                <p className="text-xs text-gray-500">100 Mbps</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <QuickActions actions={quickActions} />
        
        {/* Ad Performance */}
        <MetricsChart title="Ad Performance" chart={placeholderChart} />
        
        {/* Recent Transactions */}
        <Card title="Recent Transactions" actionText="View All" onActionClick={() => console.log('View All Transactions')} className="md:col-span-2">
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between p-2 border-b">
                <div className="flex items-center">
                  <CreditCard size={16} className="text-green-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium">Ad Revenue</p>
                    <p className="text-xs text-gray-500">Today, 10:3{item} AM</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-green-600">${Math.floor(Math.random() * 20) + 5}.99</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardTemplate>
  );
};

export default MerchantDashboardPage;