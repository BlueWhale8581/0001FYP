import React, { useEffect, useState } from 'react';
import { Wifi, User, MapPin } from 'lucide-react';

// Template
import DashboardTemplate from '../../templates/DashboardTemplate';

// Common components
import Card from '../../components/common/Card';
import StatusIndicator from '../../components/common/StatusIndicator';

// Hooks
import { useWiFiDetails } from '../../hooks/usePublic';

const UserDashboardPage = () => {
  const { wifiDetails, loading, error, getDetails } = useWiFiDetails();
  const [wifiSpeed, setWifiSpeed] = useState(null);
  const [ipAddress, setIpAddress] = useState(null);

  useEffect(() => {
    // Fetch WiFi details from backend
    getDetails('qrCodeId'); // Replace 'qrCodeId' with the actual QR code ID

    // Simulate fetching WiFi speed and IP address from the device
    const fetchDeviceData = async () => {
      // Simulated WiFi speed check
      setWifiSpeed('46 Mbps'); // Replace with actual logic to fetch WiFi speed
      setIpAddress('192.168.1.1'); // Replace with actual logic to fetch IP address
    };

    fetchDeviceData();
  }, [getDetails]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <DashboardTemplate
      role="user"
      userName="Visitor"
      pageTitle="WiFi Dashboard"
    >
      {/* Current WiFi Status */}
      <Card title="Current WiFi Status">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">WiFi Speed</p>
            <p className="text-xl font-bold text-blue-600">{wifiSpeed || 'N/A'}</p>
          </div>
          <StatusIndicator status="Connected" color="green" />
        </div>
      </Card>

      {/* WiFi Profile */}
      <Card title="WiFi Profile">
        <div>
          <p className="text-sm text-gray-500">SSID</p>
          <p className="text-lg font-semibold">{wifiDetails?.ssid || 'N/A'}</p>
          <p className="text-sm text-gray-500 mt-2">IP Address</p>
          <p className="text-lg font-semibold">{ipAddress || 'N/A'}</p>
        </div>
      </Card>

      {/* Nearby Shops */}
      <Card title="Nearby Shops">
        <div className="space-y-3">
          {wifiDetails?.nearbyShops?.map((shop, index) => (
            <div key={index} className="flex items-center">
              <MapPin size={20} className="text-blue-600 mr-3" />
              <p className="text-sm">{shop.name} - {shop.distance} away</p>
            </div>
          ))}
        </div>
      </Card>
    </DashboardTemplate>
  );
};

export default UserDashboardPage;