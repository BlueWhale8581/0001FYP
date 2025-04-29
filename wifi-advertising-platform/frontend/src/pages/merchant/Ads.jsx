import React from 'react';
import { PieChart, Award, Target, Zap, PlayCircle, Image, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

// Template
import DashboardTemplate from '../../templates/DashboardTemplate';

// Common components
import Card from '../../components/common/Card';
import StatusIndicator from '../../components/common/StatusIndicator';
import Button from '../../components/common/Button';
import ChartContainer from '../../components/common/ChartContainer';

const MerchantAdsPage = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <DashboardTemplate
        role="user"
        userName="Visitor"
        pageTitle="Ads"
      >
        <p className="text-center text-gray-500">Please log in to access the ads page.</p>
      </DashboardTemplate>
    );
  }

  const placeholderChart = <div className="h-48 bg-gray-100 rounded flex items-center justify-center">Performance Chart Placeholder</div>;

  return (
    <DashboardTemplate
      role="merchant"
      userName={user?.name || "Merchant"}
      notifications={[
        { id: 1, type: 'success', message: 'New ad campaign created!', time: '2h ago', read: false },
        { id: 2, type: 'info', message: 'Your monthly ad report is ready', time: '1d ago', read: true },
      ]}
      pageTitle="Ads Management"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ad Performance Overview */}
        <Card title="Performance Overview" actionText="Full Report" onActionClick={() => console.log('View full report')}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Impressions</p>
              <p className="text-xl font-bold">2,456</p>
              <p className="text-xs text-green-500">+12% from last week</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Clicks</p>
              <p className="text-xl font-bold">342</p>
              <p className="text-xs text-green-500">+8% from last week</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Conversion Rate</p>
              <p className="text-xl font-bold">13.9%</p>
              <p className="text-xs text-green-500">+2.1% from last week</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Revenue Generated</p>
              <p className="text-xl font-bold">$245.80</p>
              <p className="text-xs text-green-500">+15% from last week</p>
            </div>
          </div>
        </Card>
        
        {/* Active Campaigns */}
        <Card title="Active Campaigns" actionText="Create New" onActionClick={() => console.log('Create new campaign')}>
          <div className="space-y-3">
            {[
              { name: 'Summer Special', status: 'Active', impressions: 1245, clicks: 186 },
              { name: 'Happy Hour Promo', status: 'Active', impressions: 823, clicks: 97 },
              { name: 'New Menu Items', status: 'Paused', impressions: 388, clicks: 59 }
            ].map((campaign, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Award size={18} className="text-green-600 mr-2" />
                    <p className="font-medium">{campaign.name}</p>
                  </div>
                  <StatusIndicator 
                    status={campaign.status} 
                    color={campaign.status === 'Active' ? 'green' : 'yellow'} 
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <div>
                    <p className="text-gray-500">Impressions</p>
                    <p className="font-medium">{campaign.impressions}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Clicks</p>
                    <p className="font-medium">{campaign.clicks}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">CTR</p>
                    <p className="font-medium">{Math.round(campaign.clicks / campaign.impressions * 100)}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        {/* Performance Analytics */}
        <ChartContainer title="Campaign Performance" className="md:col-span-2">
          {placeholderChart}
        </ChartContainer>
        
        {/* Create New Ad */}
        <Card title="Create New Advertisement">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input 
                type="text" 
                placeholder="Enter ad title" 
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                placeholder="Enter ad description" 
                className="w-full p-2 border border-gray-300 rounded-md h-24"
              ></textarea>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                text="Upload Image" 
                className="flex-1 bg-gray-500 hover:bg-gray-600" 
                onClick={() => console.log('Upload image clicked')} 
              />
              <Button 
                text="Create Ad" 
                className="flex-1" 
                onClick={() => console.log('Create ad clicked')} 
              />
            </div>
          </div>
        </Card>
        
        {/* Ad Templates */}
        <Card title="Ad Templates" actionText="See All" onActionClick={() => console.log('See all templates')}>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'Special Offer', icon: <Zap size={24} /> },
              { name: 'Product Showcase', icon: <Image size={24} /> },
              { name: 'Video Ad', icon: <PlayCircle size={24} /> },
              { name: 'Targeted Promotion', icon: <Target size={24} /> }
            ].map((template, index) => (
              <div key={index} className="p-3 border rounded-lg flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  {React.cloneElement(template.icon, { className: 'text-green-600' })}
                </div>
                <p className="text-sm font-medium">{template.name}</p>
              </div>
            ))}
          </div>
        </Card>
        
        {/* Advertisement Tips */}
        <Card title="Ad Performance Tips" className="md:col-span-2">
          <div className="space-y-3">
            <div className="flex items-start">
              <CheckCircle size={18} className="text-green-600 mr-2 mt-0.5" />
              <div>
                <p className="font-medium">Target specific customer demographics</p>
                <p className="text-sm text-gray-500">Focus on customers who are most likely to engage with your products.</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle size={18} className="text-green-600 mr-2 mt-0.5" />
              <div>
                <p className="font-medium">Use eye-catching visuals</p>
                <p className="text-sm text-gray-500">Clear, high-quality images get more engagement than text-heavy ads.</p>
              </div>
            </div>
            <div className="flex items-start">
              <AlertCircle size={18} className="text-yellow-500 mr-2 mt-0.5" />
              <div>
                <p className="font-medium">Don't overuse promotional language</p>
                <p className="text-sm text-gray-500">Avoid terms like "best ever" or "amazing deal" as they can reduce credibility.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardTemplate>
  );
};

export default MerchantAdsPage;