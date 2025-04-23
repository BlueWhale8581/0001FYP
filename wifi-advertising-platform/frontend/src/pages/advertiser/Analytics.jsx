import React, { useState } from 'react';
import { BarChart2, PieChart, Calendar, Filter } from 'lucide-react';

// Template
import DashboardTemplate from '../../templates/DashboardTemplate';

// Common components
import Card from '../../components/common/Card';
import ChartContainer from '../../components/common/ChartContainer';
import Button from '../../components/common/Button';

const AdvertiserAnalyticsPage = () => {
  const [dateRange, setDateRange] = useState('This Month');
  
  // Sample date range options
  const dateRanges = [
    'Today',
    'This Week',
    'This Month',
    'Last Month',
    'Custom Range'
  ];

  return (
    <DashboardTemplate
      role="advertiser"
      userName="Mark Johnson"
      notifications={[
        { id: 1, type: 'info', message: 'New campaign performance report available', time: '2h ago', read: false },
      ]}
      pageTitle="Analytics Dashboard"
    >
      {/* Date Range Selector */}
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Calendar size={20} className="text-purple-600 mr-2" />
            <p className="font-medium">Date Range:</p>
          </div>
          <div className="flex space-x-2">
            {dateRanges.map((range) => (
              <Button
                key={range}
                text={range}
                onClick={() => setDateRange(range)}
                className={`text-sm px-3 py-1 ${
                  dateRange === range 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </Card>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <h3 className="text-sm text-gray-500 mb-1">Total Impressions</h3>
          <p className="text-2xl font-bold text-purple-600">24,150</p>
          <p className="text-xs text-green-600">↑ 12% from previous period</p>
        </Card>
        <Card>
          <h3 className="text-sm text-gray-500 mb-1">Total Clicks</h3>
          <p className="text-2xl font-bold text-purple-600">1,245</p>
          <p className="text-xs text-green-600">↑ 8% from previous period</p>
        </Card>
        <Card>
          <h3 className="text-sm text-gray-500 mb-1">Click-Through Rate</h3>
          <p className="text-2xl font-bold text-purple-600">5.15%</p>
          <p className="text-xs text-red-600">↓ 2% from previous period</p>
        </Card>
        <Card>
          <h3 className="text-sm text-gray-500 mb-1">Conversion Rate</h3>
          <p className="text-2xl font-bold text-purple-600">2.3%</p>
          <p className="text-xs text-green-600">↑ 5% from previous period</p>
        </Card>
      </div>
      
      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartContainer title="Campaign Performance">
          <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
            <div className="text-center">
              <BarChart2 size={48} className="mx-auto text-purple-600 mb-2" />
              <p className="text-gray-500">Performance chart would appear here</p>
            </div>
          </div>
        </ChartContainer>
        
        <ChartContainer title="Audience Demographics">
          <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
            <div className="text-center">
              <PieChart size={48} className="mx-auto text-purple-600 mb-2" />
              <p className="text-gray-500">Demographics chart would appear here</p>
            </div>
          </div>
        </ChartContainer>
      </div>
      
      {/* Geographic Performance */}
      <ChartContainer 
        title="Geographic Performance" 
        actionText="View Full Report"
        onActionClick={() => console.log('View full geographic report')}
      >
        <div className="flex mb-3">
          <Button
            text="Filter"
            onClick={() => console.log('Filter clicked')}
            className="text-sm px-3 py-1 flex items-center bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            <Filter size={14} className="mr-1" />
            Filter
          </Button>
        </div>
        
        <div className="h-96 flex items-center justify-center bg-gray-100 rounded">
          <div className="text-center">
            <p className="text-gray-500">Geographic map visualization would appear here</p>
          </div>
        </div>
      </ChartContainer>
      
      {/* Campaign Comparison */}
      <Card title="Campaign Comparison" actionText="Customize" onActionClick={() => console.log('Customize comparison')}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impressions</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CTR</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conv. Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-sm">Summer Sale Promotion</td>
                <td className="px-4 py-3 text-sm">8,540</td>
                <td className="px-4 py-3 text-sm">320</td>
                <td className="px-4 py-3 text-sm">3.75%</td>
                <td className="px-4 py-3 text-sm">2.1%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm">New Product Launch</td>
                <td className="px-4 py-3 text-sm">12,350</td>
                <td className="px-4 py-3 text-sm">540</td>
                <td className="px-4 py-3 text-sm">4.37%</td>
                <td className="px-4 py-3 text-sm">2.8%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm">Flash Sale Weekend</td>
                <td className="px-4 py-3 text-sm">5,230</td>
                <td className="px-4 py-3 text-sm">195</td>
                <td className="px-4 py-3 text-sm">3.73%</td>
                <td className="px-4 py-3 text-sm">1.9%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardTemplate>
  );
};

export default AdvertiserAnalyticsPage;