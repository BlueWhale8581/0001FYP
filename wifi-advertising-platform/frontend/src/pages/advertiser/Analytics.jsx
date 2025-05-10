import React, { useState, useEffect } from 'react';
import { BarChart2, PieChart, Calendar, Filter } from 'lucide-react';

// Template
import DashboardTemplate from '../../templates/DashboardTemplate';

// Common components
import Card from '../../components/common/Card';
import ChartContainer from '../../components/common/ChartContainer';
import Button from '../../components/common/Button';

// Hooks
import { useNotifications, useAnalyticsAndReporting } from '../../hooks/useAdvertiser';
import { useAuth } from '../../hooks/useAuth';

const AdvertiserAnalyticsPage = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <DashboardTemplate
        role="user"
        userName="Visitor"
        pageTitle="Analytics"
      >
        <p className="text-center text-gray-500">Please log in to view analytics.</p>
      </DashboardTemplate>
    );
  }

  // Date range state
  const [dateRange, setDateRange] = useState('This Month');
  
  // Sample date range options
  const dateRanges = [
    'Today',
    'This Week',
    'This Month',
    'Last Month',
    'Custom Range'
  ];

  // Convert date range to API parameters
  const getDateRangeParams = (range) => {
    const today = new Date();
    let startDate = new Date();
    let endDate = new Date();
    
    switch(range) {
      case 'Today':
        // Start and end are both today
        break;
      case 'This Week':
        startDate.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
        break;
      case 'This Month':
        startDate.setDate(1); // First day of current month
        break;
      case 'Last Month':
        startDate.setMonth(today.getMonth() - 1);
        startDate.setDate(1); // First day of previous month
        endDate.setDate(0); // Last day of previous month
        break;
      case 'Custom Range':
        // Would typically be set by a date picker UI
        startDate.setDate(today.getDate() - 30); // Default to last 30 days
        break;
      default:
        startDate.setDate(today.getDate() - 30); // Default to last 30 days
    }
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  };

  // Fetch notifications for the template
  const { notifications } = useNotifications();
  
  // Analytics data
  const { 
    analyticsOverview, 
    loading, 
    error, 
    setParams, 
    fetchAnalyticsOverview,
    getImpressionAnalytics,
    getPerformanceAnalytics
  } = useAnalyticsAndReporting();

  // Campaign comparison data
  const [campaignComparison, setCampaignComparison] = useState([]);
  const [geographicData, setGeographicData] = useState(null);
  
  // Charts data
  const [performanceData, setPerformanceData] = useState(null);
  const [demographicsData, setDemographicsData] = useState(null);

  // Handle date range change
  useEffect(() => {
    const params = getDateRangeParams(dateRange);
    setParams(params);
    fetchAnalyticsOverview(params);
  }, [dateRange, setParams, fetchAnalyticsOverview]);

  // Fetch additional data after overview loads
  useEffect(() => {
    if (analyticsOverview) {
      // Get campaign comparison data
      const campaignData = analyticsOverview.campaigns || [];
      setCampaignComparison(campaignData);

      // Fetch performance data
      const fetchPerformance = async () => {
        const params = getDateRangeParams(dateRange);
        const performance = await getPerformanceAnalytics(params);
        if (performance) {
          setPerformanceData(performance);
        }
      };
      fetchPerformance();

      // Fetch demographics data
      const fetchDemographics = async () => {
        const params = getDateRangeParams(dateRange);
        const demographics = await getImpressionAnalytics({
          ...params,
          groupBy: 'demographics'
        });
        if (demographics) {
          setDemographicsData(demographics);
        }
      };
      fetchDemographics();

      // Fetch geographic data
      const fetchGeographic = async () => {
        const params = getDateRangeParams(dateRange);
        const geographic = await getImpressionAnalytics({
          ...params,
          groupBy: 'geography'
        });
        if (geographic) {
          setGeographicData(geographic);
        }
      };
      fetchGeographic();
    }
  }, [analyticsOverview, dateRange, getPerformanceAnalytics, getImpressionAnalytics]);

  // Empty states
  if (loading && !analyticsOverview) {
    return (
      <DashboardTemplate
        role="advertiser"
        userName={user?.name || "Advertiser"}
        notifications={notifications || []}
        pageTitle="Analytics Dashboard"
      >
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-gray-600">Loading analytics data...</p>
        </div>
      </DashboardTemplate>
    );
  }

  if (error && !analyticsOverview) {
    return (
      <DashboardTemplate
        role="advertiser"
        userName={user?.name || "Advertiser"}
        notifications={notifications || []}
        pageTitle="Analytics Dashboard"
      >
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-red-600">Error loading analytics data. Please try again later.</p>
        </div>
      </DashboardTemplate>
    );
  }

  // Get metrics from the analytics overview
  const metrics = analyticsOverview?.metrics || {};

  return (
    <DashboardTemplate
      role="advertiser"
      userName={user?.name || "Advertiser"}
      notifications={notifications || []}
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
          <p className="text-2xl font-bold text-purple-600">{metrics.impressions?.toLocaleString() || '0'}</p>
          <p className={`text-xs ${metrics.impressionsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {metrics.impressionsChange >= 0 ? '↑' : '↓'} {Math.abs(metrics.impressionsChange || 0)}% from previous period
          </p>
        </Card>
        <Card>
          <h3 className="text-sm text-gray-500 mb-1">Total Clicks</h3>
          <p className="text-2xl font-bold text-purple-600">{metrics.clicks?.toLocaleString() || '0'}</p>
          <p className={`text-xs ${metrics.clicksChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {metrics.clicksChange >= 0 ? '↑' : '↓'} {Math.abs(metrics.clicksChange || 0)}% from previous period
          </p>
        </Card>
        <Card>
          <h3 className="text-sm text-gray-500 mb-1">Click-Through Rate</h3>
          <p className="text-2xl font-bold text-purple-600">{metrics.ctr?.toFixed(2) || '0.00'}%</p>
          <p className={`text-xs ${metrics.ctrChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {metrics.ctrChange >= 0 ? '↑' : '↓'} {Math.abs(metrics.ctrChange || 0)}% from previous period
          </p>
        </Card>
        <Card>
          <h3 className="text-sm text-gray-500 mb-1">Conversion Rate</h3>
          <p className="text-2xl font-bold text-purple-600">{metrics.conversionRate?.toFixed(2) || '0.00'}%</p>
          <p className={`text-xs ${metrics.conversionRateChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {metrics.conversionRateChange >= 0 ? '↑' : '↓'} {Math.abs(metrics.conversionRateChange || 0)}% from previous period
          </p>
        </Card>
      </div>
      
      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartContainer title="Campaign Performance">
          {performanceData ? (
            <div className="h-64">
              {/* Performance chart visualization would be implemented here */}
              {/* For now showing a placeholder */}
              <div className="flex items-center justify-center h-full bg-gray-100 rounded">
                <div className="text-center">
                  <BarChart2 size={48} className="mx-auto text-purple-600 mb-2" />
                  <p className="text-gray-500">Performance data loaded successfully</p>
                </div>
              </div>
            </div>
          ) : loading ? (
            <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
              <p className="text-gray-500">Loading performance data...</p>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
              <div className="text-center">
                <BarChart2 size={48} className="mx-auto text-purple-600 mb-2" />
                <p className="text-gray-500">No performance data available</p>
              </div>
            </div>
          )}
        </ChartContainer>
        
        <ChartContainer title="Audience Demographics">
          {demographicsData ? (
            <div className="h-64">
              {/* Demographics chart visualization would be implemented here */}
              {/* For now showing a placeholder */}
              <div className="flex items-center justify-center h-full bg-gray-100 rounded">
                <div className="text-center">
                  <PieChart size={48} className="mx-auto text-purple-600 mb-2" />
                  <p className="text-gray-500">Demographics data loaded successfully</p>
                </div>
              </div>
            </div>
          ) : loading ? (
            <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
              <p className="text-gray-500">Loading demographics data...</p>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
              <div className="text-center">
                <PieChart size={48} className="mx-auto text-purple-600 mb-2" />
                <p className="text-gray-500">No demographics data available</p>
              </div>
            </div>
          )}
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
        
        {geographicData ? (
          <div className="h-96">
            {/* Geographic map visualization would be implemented here */}
            {/* For now showing a placeholder */}
            <div className="flex items-center justify-center h-full bg-gray-100 rounded">
              <div className="text-center">
                <p className="text-gray-500">Geographic data loaded successfully</p>
              </div>
            </div>
          </div>
        ) : loading ? (
          <div className="h-96 flex items-center justify-center bg-gray-100 rounded">
            <p className="text-gray-500">Loading geographic data...</p>
          </div>
        ) : (
          <div className="h-96 flex items-center justify-center bg-gray-100 rounded">
            <div className="text-center">
              <p className="text-gray-500">No geographic data available</p>
            </div>
          </div>
        )}
      </ChartContainer>
      
      {/* Campaign Comparison */}
      <Card title="Campaign Comparison" actionText="Customize" onActionClick={() => console.log('Customize comparison')}>
        {campaignComparison.length > 0 ? (
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
                {campaignComparison.map(campaign => (
                  <tr key={campaign.id}>
                    <td className="px-4 py-3 text-sm">{campaign.name}</td>
                    <td className="px-4 py-3 text-sm">{campaign.impressions.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm">{campaign.clicks.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm">{campaign.ctr.toFixed(2)}%</td>
                    <td className="px-4 py-3 text-sm">{campaign.conversionRate.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : loading ? (
          <div className="py-10 text-center">
            <p className="text-gray-500">Loading campaign data...</p>
          </div>
        ) : (
          <div className="py-10 text-center">
            <p className="text-gray-500">No campaign data available for the selected period.</p>
          </div>
        )}
      </Card>
    </DashboardTemplate>
  );
};

export default AdvertiserAnalyticsPage;