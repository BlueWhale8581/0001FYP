import React, { useState } from 'react';
import { Users, Store, Map, Phone, Mail, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
import { useMerchants } from '../../hooks/useAgent';
import { useNotifications } from '../../hooks/useAgent';

const MerchantsPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <DashboardTemplate
        role="user"
        userName="Visitor"
        pageTitle="Manage Merchants"
      >
        <p className="text-center text-gray-500">Please log in to manage merchants.</p>
      </DashboardTemplate>
    );
  }

  const [searchQuery, setSearchQuery] = useState('');
  const { merchants, loading, error, fetchMerchants, registerMerchant } = useMerchants();
  const { notifications } = useNotifications();

  // Filter merchants based on search query
  const filteredMerchants = merchants.filter(merchant => 
    merchant.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    merchant.contactPerson?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate merchant counts by status
  const activeMerchants = merchants.filter(m => m.status === 'Active').length;
  const pendingMerchants = merchants.filter(m => m.status === 'Pending').length;
  const inactiveMerchants = merchants.filter(m => m.status === 'Inactive').length;

  const handleSearch = () => {
    fetchMerchants({
      search: searchQuery
    });
  };

  const handleAddMerchant = () => {
    navigate('/agent/createmerchant');
  };

  const handleEditMerchant = (merchantId) => {
    navigate(`/agent/editmerchant/${merchantId}`);
  };

  if (loading) {
    return (
      <DashboardTemplate
        role={user?.role}
        userName={user?.name}
        notifications={notifications}
        pageTitle="Manage Merchants"
      >
        <div className="flex justify-center items-center h-64">
          <p>Loading merchants...</p>
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
        pageTitle="Manage Merchants"
      >
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">Error loading merchants: {error}</p>
        </div>
      </DashboardTemplate>
    );
  }

  return (
    <DashboardTemplate
      role={user?.role}
      userName={user?.name}
      notifications={notifications}
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
            onClick={handleAddMerchant}
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
              <p className="text-2xl font-bold text-green-600">{activeMerchants}</p>
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
              <p className="text-2xl font-bold text-yellow-600">{pendingMerchants}</p>
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
              <p className="text-2xl font-bold text-red-600">{inactiveMerchants}</p>
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
                  <div className="p-3 rounded-full bg-orange-100 mr-3 cursor-pointer"
                       onClick={() => handleEditMerchant(merchant.id)}>
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
                  <p className="text-sm font-medium">{merchant.contactPerson}</p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Phone size={14} className="mr-1" /> {merchant.phone}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Mail size={14} className="mr-1" /> {merchant.email}
                  </p>
                </div>
                
                <div className="mt-3 md:mt-0 flex items-center justify-between md:w-1/5">
                  <div>
                    <StatusIndicator status={merchant.status} color={
                      merchant.status === 'Active' ? 'green' : 
                      merchant.status === 'Pending' ? 'yellow' : 'red'
                    } />
                    <p className="text-sm text-gray-500 mt-1">QR Codes: {merchant.qrCodeCount || 0}</p>
                  </div>
                  <div>
                    <button 
                      className="p-2 rounded-lg text-orange-500 hover:bg-orange-50"
                      onClick={() => console.log('Add QR for merchant:', merchant.id)}
                    >
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
          onActionClick={handleAddMerchant}
        />
      )}
    </DashboardTemplate>
  );
};

export default MerchantsPage;