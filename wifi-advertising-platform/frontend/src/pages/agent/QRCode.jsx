import React, { useState } from 'react';
import { FileText, QrCode, Store, Printer, Download, Share2 } from 'lucide-react';

// Template
import DashboardTemplate from '../../templates/DashboardTemplate';

// Common components
import Card from '../../components/common/Card';
import StatusIndicator from '../../components/common/StatusIndicator';
import SearchBar from '../../components/common/SearchBar';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';

const QRCodesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data for QR codes
  const qrCodes = [
    { 
      id: 1, 
      name: 'Cafe Deluxe - Front Counter', 
      merchant: 'Cafe Deluxe', 
      generated: '2023-09-15', 
      scans: 145,
      lastScan: '2 hours ago',
      status: 'Active',
      statusColor: 'green',
    },
    { 
      id: 2, 
      name: 'Cafe Deluxe - Outdoor Seating', 
      merchant: 'Cafe Deluxe', 
      generated: '2023-09-15', 
      scans: 87,
      lastScan: '5 hours ago',
      status: 'Active',
      statusColor: 'green',
    },
    { 
      id: 3, 
      name: 'Books & More - Entrance', 
      merchant: 'Books & More', 
      generated: '2023-10-02', 
      scans: 92,
      lastScan: '1 day ago',
      status: 'Active',
      statusColor: 'green',
    },
    { 
      id: 4, 
      name: 'Fitness Center - Reception', 
      merchant: 'Fitness Center', 
      generated: '2023-08-28', 
      scans: 0,
      lastScan: 'Never',
      status: 'Inactive',
      statusColor: 'red',
    },
  ];

  // Filter QR codes based on search query
  const filteredQRCodes = qrCodes.filter(qrCode => 
    qrCode.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    qrCode.merchant.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
  };

  const handleGenerateQR = () => {
    console.log('Generate QR clicked');
  };

  return (
    <DashboardTemplate
      role="agent"
      userName="Agent Smith"
      notifications={[
        { id: 1, type: 'info', message: 'New merchant registration pending approval', time: '30m ago', read: false },
      ]}
      pageTitle="QR Codes"
    >
      <div className="mb-4 flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="mb-4 md:mb-0 md:w-2/3">
          <SearchBar
            placeholder="Search QR codes..."
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
          />
        </div>
        <div>
          <Button 
            text="Generate New QR Code" 
            className="bg-orange-500 hover:bg-orange-600 flex items-center"
            onClick={handleGenerateQR}
          />
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-orange-50">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 mr-3">
              <QrCode size={24} className="text-orange-600" />
            </div>
            <div>
              <p className="text-lg font-semibold">Total QR Codes</p>
              <p className="text-2xl font-bold text-orange-600">{qrCodes.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-blue-50">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-3">
              <QrCode size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-semibold">Total Scans</p>
              <p className="text-2xl font-bold text-blue-600">
                {qrCodes.reduce((total, qr) => total + qr.scans, 0)}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-green-50">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-3">
              <Store size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-lg font-semibold">Merchants Using QR</p>
              <p className="text-2xl font-bold text-green-600">
                {new Set(qrCodes.map(qr => qr.merchant)).size}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {filteredQRCodes.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredQRCodes.map(qrCode => (
            <Card key={qrCode.id} className="hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-start md:w-1/3">
                  <div className="flex-shrink-0 w-24 h-24 bg-gray-200 flex items-center justify-center rounded-lg">
                    <QrCode size={64} className="text-gray-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-lg">{qrCode.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Store size={14} className="mr-1" /> {qrCode.merchant}
                    </p>
                    <p className="text-xs text-gray-500">Generated: {qrCode.generated}</p>
                    <StatusIndicator status={qrCode.status} color={qrCode.statusColor} className="mt-1" />
                  </div>
                </div>
                
                <div className="mt-3 md:mt-0 md:w-1/3">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Total Scans</p>
                    <p className="text-2xl font-bold text-blue-600">{qrCode.scans}</p>
                    <p className="text-xs text-gray-500">Last scan: {qrCode.lastScan}</p>
                  </div>
                </div>
                
                <div className="mt-3 md:mt-0 flex justify-end space-x-2 md:w-1/3">
                  <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100" title="Print QR Code">
                    <Printer size={20} />
                  </button>
                  <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100" title="Download QR Code">
                    <Download size={20} />
                  </button>
                  <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100" title="Share QR Code">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState 
          title="No QR codes found"
          description="Try adjusting your search terms or generate a new QR code"
          actionText="Generate QR Code"
          onActionClick={handleGenerateQR}
        />
      )}
    </DashboardTemplate>
  );
};

export default QRCodesPage;