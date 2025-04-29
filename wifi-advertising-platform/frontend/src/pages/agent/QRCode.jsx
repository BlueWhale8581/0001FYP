import React, { useState } from 'react';
import { QrCode, Store, Printer, Download, Share2 } from 'lucide-react';

// Template
import DashboardTemplate from '../../templates/DashboardTemplate';

// Common components
import Card from '../../components/common/Card';
import StatusIndicator from '../../components/common/StatusIndicator';
import SearchBar from '../../components/common/SearchBar';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';

// Hooks
import useAuth from '../../hooks/useAuth';
import { useQRCodes, useNotifications } from '../../hooks/useAgent';

const QRCodesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const { qrCodes, loading, error, fetchAllQRCodes, downloadQRCode } = useQRCodes();
  const { notifications } = useNotifications();
  
  // Filter QR codes based on search query
  const filteredQRCodes = qrCodes.filter(qrCode => 
    qrCode.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    qrCode.merchantName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate statistics
  const totalQRCodes = qrCodes.length;
  const totalScans = qrCodes.reduce((total, qr) => total + (qr.scanCount || 0), 0);
  const uniqueMerchants = new Set(qrCodes.map(qr => qr.merchantId)).size;

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
  };

  const handleGenerateQR = () => {
    console.log('Generate QR clicked');
  };

  const handleDownload = async (qrCodeId) => {
    try {
      await downloadQRCode(qrCodeId);
    } catch (err) {
      console.error('Error downloading QR code:', err);
    }
  };

  const handlePrint = (qrCodeId) => {
    console.log('Print QR code:', qrCodeId);
  };

  const handleShare = (qrCodeId) => {
    console.log('Share QR code:', qrCodeId);
  };

  if (loading) {
    return (
      <DashboardTemplate
        role={user?.role}
        userName={user?.name}
        notifications={notifications}
        pageTitle="QR Codes"
      >
        <div className="flex justify-center items-center h-64">
          <p>Loading QR codes...</p>
        </div>
      </DashboardTemplate>
    );
  }

  if (error) {
    return (
      <DashboardTemplate
        role={user?.role}
        userName={user?.name}
        notifications={notifications}
        pageTitle="QR Codes"
      >
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">Error loading QR codes: {error}</p>
        </div>
      </DashboardTemplate>
    );
  }

  return (
    <DashboardTemplate
      role={user?.role}
      userName={user?.name}
      notifications={notifications}
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
              <p className="text-2xl font-bold text-orange-600">{totalQRCodes}</p>
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
              <p className="text-2xl font-bold text-blue-600">{totalScans}</p>
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
              <p className="text-2xl font-bold text-green-600">{uniqueMerchants}</p>
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
                    {qrCode.imageUrl ? (
                      <img 
                        src={qrCode.imageUrl} 
                        alt={qrCode.name} 
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <QrCode size={64} className="text-gray-600" />
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-lg">{qrCode.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Store size={14} className="mr-1" /> {qrCode.merchantName}
                    </p>
                    <p className="text-xs text-gray-500">Generated: {new Date(qrCode.createdAt).toLocaleDateString()}</p>
                    <StatusIndicator 
                      status={qrCode.active ? 'Active' : 'Inactive'} 
                      color={qrCode.active ? 'green' : 'red'} 
                      className="mt-1" 
                    />
                  </div>
                </div>
                
                <div className="mt-3 md:mt-0 md:w-1/3">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Total Scans</p>
                    <p className="text-2xl font-bold text-blue-600">{qrCode.scanCount || 0}</p>
                    <p className="text-xs text-gray-500">
                      Last scan: {qrCode.lastScanDate ? 
                        new Date(qrCode.lastScanDate).toLocaleDateString() + ' ' + 
                        new Date(qrCode.lastScanDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
                        'Never'}
                    </p>
                  </div>
                </div>
                
                <div className="mt-3 md:mt-0 flex justify-end space-x-2 md:w-1/3">
                  <button 
                    className="p-2 rounded-lg text-gray-600 hover:bg-gray-100" 
                    title="Print QR Code"
                    onClick={() => handlePrint(qrCode.id)}
                  >
                    <Printer size={20} />
                  </button>
                  <button 
                    className="p-2 rounded-lg text-gray-600 hover:bg-gray-100" 
                    title="Download QR Code"
                    onClick={() => handleDownload(qrCode.id)}
                  >
                    <Download size={20} />
                  </button>
                  <button 
                    className="p-2 rounded-lg text-gray-600 hover:bg-gray-100" 
                    title="Share QR Code"
                    onClick={() => handleShare(qrCode.id)}
                  >
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