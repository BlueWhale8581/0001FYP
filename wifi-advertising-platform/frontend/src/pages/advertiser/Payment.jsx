import React, { useState, useEffect } from 'react';
import { CreditCard, Download, Plus, FileText, Calendar } from 'lucide-react';

// Template
import DashboardTemplate from '../../templates/DashboardTemplate';

// Common components
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatusIndicator from '../../components/common/StatusIndicator';
import SearchBar from '../../components/common/SearchBar';
import EmptyState from '../../components/common/EmptyState';
import LoadingState from '../../components/common/LoadingState';

// Hooks
import { useBudgetAndPayments } from '../../hooks/useAdvertiser';
import { useProfile } from '../../hooks/useAdvertiser';
import { useNotifications } from '../../hooks/useAdvertiser';
import useAuth from '../../hooks/useAuth';

const AdvertiserPaymentsPage = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <DashboardTemplate
        role="user"
        userName="Visitor"
        pageTitle="Payments"
      >
        <p className="text-center text-gray-500">Please log in to access payment details.</p>
      </DashboardTemplate>
    );
  }

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('payments');
  
  // Using real data from hooks
  const { 
    budgetOverview, 
    paymentHistory, 
    loading, 
    error, 
    fetchBudgetOverview, 
    fetchPaymentHistory,
    makePayment
  } = useBudgetAndPayments();
  
  // Get user profile for name display
  const { profile, loading: profileLoading } = useProfile();
  
  // Get notifications
  const { notifications } = useNotifications();
  
  // Filter based on search query
  const filteredPayments = paymentHistory?.filter(payment => 
    payment?.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment?.id?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // We'll assume invoices are part of payment history with pending status
  const filteredInvoices = paymentHistory?.filter(payment => 
    (payment?.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment?.id?.toLowerCase().includes(searchQuery.toLowerCase())) &&
    payment?.invoice
  ) || [];

  const handleDownloadInvoice = (id) => {
    console.log(`Downloading invoice ${id}`);
    // Here you would implement the actual download functionality
  };

  const handleMakePayment = async (paymentData) => {
    await makePayment(paymentData);
    // Refresh payment history after making a payment
    fetchPaymentHistory();
    fetchBudgetOverview();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'green';
      case 'PENDING': return 'yellow';
      case 'failed': return 'red';
      default: return 'gray';
    }
  };

  if (loading && !budgetOverview && !paymentHistory) {
    return <LoadingState message="Loading payment information..." />;
  }

  if (error) {
    return (
      <DashboardTemplate
        role="advertiser"
        userName={profile?.name || "Advertiser"}
        notifications={notifications}
        pageTitle="Payments & Billing"
      >
        <Card>
          <EmptyState 
            title="Error loading payment data" 
            description={error} 
          />
        </Card>
      </DashboardTemplate>
    );
  }

  return (
    <DashboardTemplate
      role="advertiser"
      userName={profile?.name || "Advertiser"}
      notifications={notifications?.map(notification => ({
        ...notification,
        time: notification.createdAt ? new Date(notification.createdAt).toLocaleDateString() : 'Unknown'
      }))}
      pageTitle="Payments & Billing"
    >
      {/* Account Summary */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Account Balance</h3>
            <p className="text-2xl font-bold text-purple-600">${budgetOverview?.balance || '0.00'}</p>
            <p className="text-sm text-gray-500">Next billing date: {budgetOverview?.nextBillingDate || 'N/A'}</p>
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mt-4 md:mt-0">
            <Button
              text="Add Funds"
              onClick={() => handleMakePayment({ amount: 0, method: 'prompt' })}
              className="flex items-center justify-center"
            />
            <Button
              text="Payment Methods"
              onClick={() => console.log('Payment methods clicked')}
              className="flex items-center justify-center bg-gray-200 text-gray-700 hover:bg-gray-300"
            />
          </div>
        </div>
      </Card>
      
      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'payments' 
            ? 'text-purple-600 border-b-2 border-purple-600' 
            : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('payments')}
        >
          Recent Payments
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'invoices' 
            ? 'text-purple-600 border-b-2 border-purple-600' 
            : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('invoices')}
        >
          Invoices
        </button>
      </div>
      
      {/* Search Bar */}
      <div className="mb-4">
        <SearchBar
          placeholder={`Search ${activeTab === 'payments' ? 'payments' : 'invoices'}...`}
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={() => console.log('Searching:', searchQuery)}
        />
      </div>
      
      {loading ? (
        <LoadingState message="Processing your request..." />
      ) : (
        activeTab === 'payments' ? (
          /* Payments List */
          <Card title="Recent Payments" actionText="Download CSV" onActionClick={() => console.log('Download CSV clicked')}>
            {filteredPayments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-4 py-3 text-sm">{payment.id}</td>
                        <td className="px-4 py-3 text-sm">{new Date(payment.date).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-sm">{payment.description}</td>
                        <td className="px-4 py-3 text-sm font-medium">${payment.amount.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm">
                          <StatusIndicator status={payment.status} color={getStatusColor(payment.status)} />
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {payment.invoice && (
                            <button 
                              className="text-purple-600 hover:text-purple-800 flex items-center"
                              onClick={() => handleDownloadInvoice(payment.id)}
                            >
                              <Download size={16} className="mr-1" />
                              Receipt
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState 
                title="No payments found" 
                description="No payments matching your search criteria" 
              />
            )}
          </Card>
        ) : (
          /* Invoices List */
          <Card title="Invoices" actionText="Download All" onActionClick={() => console.log('Download all invoices clicked')}>
            {filteredInvoices.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredInvoices.map((invoice) => (
                      <tr key={invoice.id}>
                        <td className="px-4 py-3 text-sm">{invoice.id}</td>
                        <td className="px-4 py-3 text-sm">{new Date(invoice.date).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-sm">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-sm">{invoice.description}</td>
                        <td className="px-4 py-3 text-sm font-medium">${invoice.amount.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm">
                          <StatusIndicator status={invoice.status} color={getStatusColor(invoice.status)} />
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex space-x-2">
                            <button 
                              className="text-purple-600 hover:text-purple-800 flex items-center"
                              onClick={() => handleDownloadInvoice(invoice.id)}
                            >
                              <Download size={16} className="mr-1" />
                              PDF
                            </button>
                            {invoice.status.toLowerCase() === 'PENDING' && (
                              <button 
                                className="text-green-600 hover:text-green-800 flex items-center"
                                onClick={() => handleMakePayment({ invoiceId: invoice.id, amount: invoice.amount })}
                              >
                                <CreditCard size={16} className="mr-1" />
                                Pay
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState 
                title="No invoices found" 
                description="No invoices matching your search criteria" 
              />
            )}
          </Card>
        )
      )}
      
      {/* Payment Methods - Assuming we'll add functionality to fetch these later */}
      <Card title="Payment Methods" actionText="Add Payment Method" onActionClick={() => console.log('Add payment method clicked')} className="mt-6">
        {budgetOverview?.paymentMethods?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {budgetOverview.paymentMethods.map((method, index) => (
              <div key={method.id || index} className="border rounded-lg p-4 flex items-center">
                <div className="mr-4 bg-purple-100 p-2 rounded-full">
                  <CreditCard size={24} className="text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">•••• •••• •••• {method.lastFour}</p>
                  <p className="text-sm text-gray-500">{method.type} - Expires {method.expiryMonth}/{method.expiryYear}</p>
                </div>
                <div className="ml-auto">
                  {method.isDefault ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Default
                    </span>
                  ) : (
                    <button className="text-xs text-purple-600 hover:underline" onClick={() => console.log('Set as default: ', method.id)}>
                      Make Default
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState 
            title="No payment methods" 
            description="You haven't added any payment methods yet" 
          />
        )}
      </Card>
      
      {/* Billing History Summary */}
      <Card title="Billing Summary" className="mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 border rounded-lg bg-purple-50">
            <p className="text-sm text-gray-500">Total Spent (2025)</p>
            <p className="text-xl font-bold text-purple-600">${budgetOverview?.totalSpent?.year || '0.00'}</p>
          </div>
          <div className="p-4 border rounded-lg bg-green-50">
            <p className="text-sm text-gray-500">This Month</p>
            <p className="text-xl font-bold text-green-600">${budgetOverview?.totalSpent?.month || '0.00'}</p>
          </div>
          <div className="p-4 border rounded-lg bg-blue-50">
            <p className="text-sm text-gray-500">Last Month</p>
            <p className="text-xl font-bold text-blue-600">${budgetOverview?.totalSpent?.lastMonth || '0.00'}</p>
          </div>
          <div className="p-4 border rounded-lg bg-amber-50">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-xl font-bold text-amber-600">${budgetOverview?.pendingAmount || '0.00'}</p>
          </div>
        </div>
      </Card>
    </DashboardTemplate>
  );
};

export default AdvertiserPaymentsPage;