import React from 'react';
import { Wifi, User, MapPin } from 'lucide-react';

// Template
import DashboardTemplate from '../../templates/DashboardTemplate';

// Common components
import Card from '../../components/common/Card';
import StatusIndicator from '../../components/common/StatusIndicator';
import '../../../tailwind.config.js';

const UserDashboardPage = () => {
  return (
    <DashboardTemplate
      role="user"
      userName="Jane Doe"
      notifications={[
        { id: 1, type: 'info', message: 'New shop added nearby!', time: '10m ago', read: false },
        { id: 2, type: 'success', message: 'WiFi linked successfully.', time: '1h ago', read: true },
      ]}
      pageTitle="WiFi Dashboard"
    >
      {/* Current WiFi Status */}
      <Card title="Current WiFi Status">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">WiFi Speed</p>
            <p className="text-xl font-bold text-blue-600">50 Mbps</p>
          </div>
          <StatusIndicator status="Connected" color="green" />
        </div>
      </Card>

      {/* WiFi Profile */}
      <Card title="WiFi Profile">
        <div>
          <p className="text-sm text-gray-500">SSID</p>
          <p className="text-lg font-semibold">Public_WiFi_123</p>
          <p className="text-sm text-gray-500 mt-2">IP Address</p>
          <p className="text-lg font-semibold">192.168.1.1</p>
        </div>
      </Card>

      {/* Nearby Shops */}
      <Card title="Nearby Shops">
        <div className="space-y-3">
          <div className="flex items-center">
            <MapPin size={20} className="text-blue-600 mr-3" />
            <p className="text-sm">Coffee Shop - 200m away</p>
          </div>
          <div className="flex items-center">
            <MapPin size={20} className="text-blue-600 mr-3" />
            <p className="text-sm">Bookstore - 500m away</p>
          </div>
        </div>
      </Card>
    </DashboardTemplate>
  );
};

export default UserDashboardPage;