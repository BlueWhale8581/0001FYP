import React, { useState } from 'react';
import { Users, Store, Map, Phone, Mail, Plus } from 'lucide-react';

// Template
import DashboardTemplate from '../../templates/DashboardTemplate';

// Common components
import Card from '../../components/common/Card';
import StatusIndicator from '../../components/common/StatusIndicator';
import SearchBar from '../../components/common/SearchBar';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';

const MerchantsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data for merchants
  const merchants = [
    { 
      id: 1, 
      name: 'Cafe Deluxe', 
      address: '123 Main Street', 
      contact: 'John Smith', 
      phone: '+1-234-567-8901', 
      email: 'john@cafedeluxe.com', 
      status: 'Active',
      statusColor: 'green',
      qrCodes: 3
    },
    { 
      id: 2, 
      name: 'Books & More', 
      address: '456 Oak Avenue', 
      contact: 'Sarah Johnson', 
      phone: '+1-345-678-9012', 
      email: 'sarah@booksandmore.com', 
      status: 'Active',
      statusColor: 'green',
      qrCodes: 2
    },
    { 
      id: 3, 
      name: 'Tech Hub', 
      address: '789 Pine Road', 
      contact: 'Michael Lee', 
      phone: '+1-456-789-0123', 
      email: 'michael@techhub.com', 
      status: 'Pending',
      statusColor: 'yellow',
      qrCodes: 0
    },
    { 
      id: 4, 
      name: 'Fitness Center', 
      address: '101 Elm Boulevard', 
      contact: 'Lisa Rodriguez', 
      phone: '+1-567-890-1234', 
      email: 'lisa@fitnesscenter.com', 
      status: 'Inactive',
      statusColor: 'red',
      qrCodes: 1
    },
  ];

  // Filter merchants based on search query
  const filteredMerchants = merchants.filter(merchant => 
    merchant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    merchant.contact.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
  };

  return (
    <DashboardTemplate
      role="agent"
      userName="Agent Smith"
      notifications={[
        { id: 1, type: 'info', message: 'New merchant registration pending approval', time: '30m ago', read: false },
      ]}
      pageTitle="Manage Merchants"
    >
      <div className="mb-4 flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="mb-4 md:mb-0 md:w-2/3">
          <SearchBar
            placeholder="Search merchants..."
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
          />
        </div>
        <div>
          <Button 
            text="Add New Merchant" 
            className="bg-orange-500 hover:bg-orange-600 flex items-center"
            onClick={() => console.log('Add merchant clicked')}
          />
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-50">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-3">
              <Users size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-lg font-semibold">Active Merchants</p>
              <p className="text-2xl font-bold text-green-600">2</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-yellow-50">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 mr-3">
              <Users size={24} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-lg font-semibold">Pending Merchants</p>
              <p className="text-2xl font-bold text-yellow-600">1</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-red-50">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 mr-3">
              <Users size={24} className="text-red-600" />
            </div>
            <div>
              <p className="text-lg font-semibold">Inactive Merchants</p>
              <p className="text-2xl font-bold text-red-600">1</p>
            </div>
          </div>
        </Card>
      </div>

      {filteredMerchants.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredMerchants.map(merchant => (
            <Card key={merchant.id} className="hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-start md:w-2/5">
                  <div className="p-3 rounded-full bg-orange-100 mr-3">
                    <Store size={24} className="text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{merchant.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Map size={14} className="mr-1" /> {merchant.address}
                    </p>
                  </div>
                </div>
                
                <div className="mt-3 md:mt-0 md:w-2/5">
                  <p className="text-sm font-medium">{merchant.contact}</p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Phone size={14} className="mr-1" /> {merchant.phone}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Mail size={14} className="mr-1" /> {merchant.email}
                  </p>
                </div>
                
                <div className="mt-3 md:mt-0 flex items-center justify-between md:w-1/5">
                  <div>
                    <StatusIndicator status={merchant.status} color={merchant.statusColor} />
                    <p className="text-sm text-gray-500 mt-1">QR Codes: {merchant.qrCodes}</p>
                  </div>
                  <div>
                    <button className="p-2 rounded-lg text-orange-500 hover:bg-orange-50">
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState 
          title="No merchants found"
          description="Try adjusting your search terms or add a new merchant"
          actionText="Add New Merchant"
          onActionClick={() => console.log('Add merchant clicked')}
        />
      )}
    </DashboardTemplate>
  );
};

export default MerchantsPage;