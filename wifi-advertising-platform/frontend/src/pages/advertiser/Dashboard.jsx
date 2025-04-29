import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Award, PieChart, CreditCard, BarChart } from 'lucide-react';

// Template
import DashboardTemplate from '../../templates/DashboardTemplate';

// Common components
import Card from '../../components/common/Card';
import StatusIndicator from '../../components/common/StatusIndicator';
import ChartContainer from '../../components/common/ChartContainer';

const AdvertiserDashboardPage = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <DashboardTemplate
        role="guest"
        userName="Guest"
        pageTitle="Advertiser Dashboard"
      >
        <p className="text-center text-gray-500">Please log in to access the dashboard.</p>
      </DashboardTemplate>
    );
  }

  return (
    <DashboardTemplate
      role="advertiser"
      userName={user?.name || "Advertiser"}
      notifications={[
        { id: 1, type: 'info', message: 'New campaign performance report available', time: '2h ago', read: false },
        { id: 2, type: 'success', message: 'Payment processed successfully', time: '1d ago', read: true },
        { id: 3, type: 'warning', message: 'Campaign "Summer Sale" is ending soon', time: '3h ago', read: false },
      ]}
      pageTitle="Dashboard Overview"
    >
      {/* Campaign Performance Summary */}
      <Card title="Campaign Performance" actionText="View All" onActionClick={() => console.log('View all campaigns')}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Active Campaigns</p>
            <p className="text-xl font-bold text-purple-600">5</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Impressions</p>
            <p className="text-xl font-bold text-purple-600">12,450</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Click-through Rate</p>
            <p className="text-xl font-bold text-purple-600">3.2%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Conversion Rate</p>
            <p className="text-xl font-bold text-purple-600">1.8%</p>
          </div>
        </div>
      </Card>

      {/* Latest Campaign */}
      <Card title="Latest Campaign">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Award size={20} className="text-purple-600 mr-3" />
            <p className="font-medium">Summer Sale Promotion</p>
          </div>
          <StatusIndicator status="Active" color="green" />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <p className="text-sm text-gray-500">Budget Used</p>
            <p className="text-lg font-semibold">$1,250 / $2,000</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Duration</p>
            <p className="text-lg font-semibold">15 May - 15 Jun</p>
          </div>
        </div>
      </Card>

      {/* Performance Overview */}
      <ChartContainer 
        title="Performance Overview" 
        actionText="Full Report"
        onActionClick={() => console.log('View full report')}
      >
        <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
          <div className="text-center">
            <BarChart size={48} className="mx-auto text-purple-600 mb-2" />
            <p className="text-gray-500">Performance chart visualization would appear here</p>
          </div>
        </div>
      </ChartContainer>

      {/* Recent Payments */}
      <Card title="Recent Payments" actionText="View All" onActionClick={() => console.log('View all payments')}>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <div className="flex items-center">
              <CreditCard size={20} className="text-purple-600 mr-3" />
              <div>
                <p className="font-medium">Campaign Boost</p>
                <p className="text-xs text-gray-500">Apr 20, 2025</p>
              </div>
            </div>
            <p className="font-semibold">$250.00</p>
          </div>
          
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <div className="flex items-center">
              <CreditCard size={20} className="text-purple-600 mr-3" />
              <div>
                <p className="font-medium">Premium Placement</p>
                <p className="text-xs text-gray-500">Apr 15, 2025</p>
              </div>
            </div>
            <p className="font-semibold">$150.00</p>
          </div>
        </div>
      </Card>

      {/* Analytics Snapshot */}
      <Card title="Analytics Snapshot" actionText="Full Analytics" onActionClick={() => console.log('View full analytics')}>
        <div className="space-y-3">
          <div className="flex items-center">
            <PieChart size={20} className="text-purple-600 mr-3" />
            <div className="flex-1">
              <div className="flex justify-between">
                <p className="text-sm">Age Group 18-24</p>
                <p className="text-sm font-medium">35%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <PieChart size={20} className="text-purple-600 mr-3" />
            <div className="flex-1">
              <div className="flex justify-between">
                <p className="text-sm">Age Group 25-34</p>
                <p className="text-sm font-medium">45%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <PieChart size={20} className="text-purple-600 mr-3" />
            <div className="flex-1">
              <div className="flex justify-between">
                <p className="text-sm">Age Group 35-44</p>
                <p className="text-sm font-medium">20%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </DashboardTemplate>
  );
};

export default AdvertiserDashboardPage;