import React from 'react';
import { Wifi, WifiOff, Settings, Users, Clock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

// Template
import DashboardTemplate from '../../templates/DashboardTemplate';

// Common components
import Card from '../../components/common/Card';
import StatusIndicator from '../../components/common/StatusIndicator';
import Button from '../../components/common/Button';
import ChartContainer from '../../components/common/ChartContainer';

const MerchantWiFiPage = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <DashboardTemplate
        role="user"
        userName="Visitor"
        pageTitle="WiFi"
      >
        <p className="text-center text-gray-500">Please log in to access the WiFi page.</p>
      </DashboardTemplate>
    );
  }

  const placeholderChart = <div className="h-48 bg-gray-100 rounded flex items-center justify-center">Usage Chart Placeholder</div>;

  return (
    <DashboardTemplate
      role="merchant"
      userName={user?.name || "Merchant"}
      notifications={[
        { id: 1, type: 'warning', message: 'WiFi usage approaching limit', time: '15m ago', read: false },
        { id: 2, type: 'info', message: 'New WiFi features available', time: '1d ago', read: true },
      ]}
      pageTitle="WiFi Management"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* WiFi Status Card */}
        <Card title="WiFi Network Status">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Wifi size={24} className="text-green-600 mr-3" />
              <div>
                <p className="font-semibold">CoffeeShop_Free</p>
                <p className="text-sm text-gray-500">2.4GHz + 5GHz</p>
              </div>
            </div>
            <StatusIndicator status="Active" color="green" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-sm text-gray-500">Bandwidth</p>
              <p className="font-semibold">100 Mbps</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Usage</p>
              <p className="font-semibold">64 Mbps</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">IP Address</p>
              <p className="font-semibold">192.168.1.1</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Security</p>
              <p className="font-semibold">WPA3</p>
            </div>
          </div>
          
          <div className="mt-4 flex space-x-2">
            <Button text="Configure" onClick={() => console.log('Configure clicked')} className="bg-green-600 hover:bg-green-700" />
            <Button text="Restart" onClick={() => console.log('Restart clicked')} className="bg-gray-500 hover:bg-gray-600" />
          </div>
        </Card>
        
        {/* Connected Users */}
        <Card title="Connected Users" actionText="View All" onActionClick={() => console.log('View all users')}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users size={18} className="text-green-600 mr-2" />
                <p className="font-semibold">Current Users</p>
              </div>
              <p className="text-xl font-bold">24</p>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium">Recent Connections</p>
                <p className="text-xs text-gray-500">Last Hour</p>
              </div>
              
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between py-2 border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                      <Users size={16} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm">User{item}23</p>
                      <p className="text-xs text-gray-500">Device: iPhone {10 + item}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    <Clock size={14} className="inline mr-1" />
                    {item * 12}m ago
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
        
        {/* Usage Analytics */}
        <ChartContainer title="Daily Usage Analytics" className="md:col-span-2">
          {placeholderChart}
        </ChartContainer>
        
        {/* WiFi Settings */}
        <Card title="WiFi Settings">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Settings size={18} className="text-green-600 mr-2" />
                <p className="text-sm">Auto-restart Daily</p>
              </div>
              <div className="w-12 h-6 bg-green-600 rounded-full flex items-center px-1">
                <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Settings size={18} className="text-green-600 mr-2" />
                <p className="text-sm">Visitor Portal</p>
              </div>
              <div className="w-12 h-6 bg-green-600 rounded-full flex items-center px-1">
                <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Settings size={18} className="text-green-600 mr-2" />
                <p className="text-sm">Show Ads to Users</p>
              </div>
              <div className="w-12 h-6 bg-green-600 rounded-full flex items-center px-1">
                <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <WifiOff size={18} className="text-green-600 mr-2" />
                <p className="text-sm">Bandwidth Limit</p>
              </div>
              <div className="w-12 h-6 bg-gray-300 rounded-full flex items-center px-1">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          
          <Button text="Save Settings" onClick={() => console.log('Save settings clicked')} className="mt-4 w-full" />
        </Card>
        
        {/* Schedule */}
        <Card title="Schedule">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock size={18} className="text-green-600 mr-2" />
                <p className="text-sm">Operating Hours</p>
              </div>
              <p className="text-sm font-medium">7:00 AM - 9:00 PM</p>
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                <div key={index} className={`h-8 rounded-full flex items-center justify-center ${index < 5 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  {day}
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock size={18} className="text-green-600 mr-2" />
                <p className="text-sm">Auto-shutdown</p>
              </div>
              <div className="w-12 h-6 bg-green-600 rounded-full flex items-center px-1">
                <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
              </div>
            </div>
          </div>
          
          <Button text="Configure Schedule" onClick={() => console.log('Configure schedule clicked')} className="mt-4 w-full" />
        </Card>
      </div>
    </DashboardTemplate>
  );
};

export default MerchantWiFiPage;