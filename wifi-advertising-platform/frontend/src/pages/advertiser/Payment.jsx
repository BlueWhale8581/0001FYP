import React, { useState } from 'react';
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

const AdvertiserPaymentsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('payments');
  const [isLoading, setIsLoading] = useState(false);
  
  // Sample payment data
  const payments = [
    {
      id: 'INV-2025-042',
      date: 'Apr 20, 2025',
      amount: '$250.00',
      description: 'Campaign Boost',
      status: 'Paid',
    },
    {
      id: 'INV-2025-037',
      date: 'Apr 15, 2025',
      amount: '$150.00',
      description: 'Premium Placement',
      status: 'Paid',
    },
    {
      id: 'INV-2025-029',
      date: 'Apr 05, 2025',
      amount: '$500.00',
      description: 'Monthly Subscription',
      status: 'Paid',
    },
    {
      id: 'INV-2025-023',
      date: 'Mar 25, 2025',
      amount: '$75.00',
      description: 'Additional Analytics',
      status: 'Pending',
    },
  ];

  // Sample invoices data
  const invoices = [
    {
      id: 'INV-2025-042',
      date: 'Apr 20, 2025',
      dueDate: 'Apr 30, 2025',
      amount: '$250.00',
      description: 'Campaign Boost',
      status: 'Paid',
    },
    {
      id: 'INV-2025-037',
      date: 'Apr 15, 2025',
      dueDate: 'Apr 25, 2025',
      amount: '$150.00',
      description: 'Premium Placement',
      status: 'Paid',
    },
    {
      id: 'INV-2025-029',
      date: 'Apr 05, 2025',
      dueDate: 'Apr 15, 2025',
      amount: '$500.00',
      description: 'Monthly Subscription',
      status: 'Paid',
    },
    {
      id: 'INV-2025-023',
      date: 'Mar 25, 2025',
      dueDate: 'Apr 05, 2025',
      amount: '$75.00',
      description: 'Additional Analytics',
      status: 'Pending',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'green';
      case 'Pending': return 'yellow';
      case 'Failed': return 'red';
      default: return 'gray';
    }
  };

  // Filter based on search query
  const filteredPayments = payments.filter(payment => 
    payment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInvoices = invoices.filter(invoice => 
    invoice.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownloadInvoice = (id) => {
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      console.log(`Downloading invoice ${id}`);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <DashboardTemplate
      role="advertiser"
      userName="Mark Johnson"
      notifications={[
        { id: 1, type: 'success', message: 'Payment processed successfully', time: '1d ago', read: true },
        { id: 2, type: 'info', message: 'New invoice available', time: '3d ago', read: false },
      ]}
      pageTitle="Payments & Billing"
    >
      {/* Account Summary */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Account Balance</h3>
            <p className="text-2xl font-bold text-purple-600">$1,200.00</p>
            <p className="text-sm text-gray-500">Next billing date: May 5, 2025</p>
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mt-4 md:mt-0">
            <Button
              text="Add Funds"
              onClick={() => console.log('Add funds clicked')}
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
      
      {isLoading ? (
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
                        <td className="px-4 py-3 text-sm">{payment.date}</td>
                        <td className="px-4 py-3 text-sm">{payment.description}</td>
                        <td className="px-4 py-3 text-sm font-medium">{payment.amount}</td>
                        <td className="px-4 py-3 text-sm">
                          <StatusIndicator status={payment.status} color={getStatusColor(payment.status)} />
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <button 
                            className="text-purple-600 hover:text-purple-800 flex items-center"
                            onClick={() => handleDownloadInvoice(payment.id)}
                          >
                            <Download size={16} className="mr-1" />
                            Receipt
                          </button>
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
                        <td className="px-4 py-3 text-sm">{invoice.date}</td>
                        <td className="px-4 py-3 text-sm">{invoice.dueDate}</td>
                        <td className="px-4 py-3 text-sm">{invoice.description}</td>
                        <td className="px-4 py-3 text-sm font-medium">{invoice.amount}</td>
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
                            {invoice.status === 'Pending' && (
                              <button 
                                className="text-green-600 hover:text-green-800 flex items-center"
                                onClick={() => console.log(`Pay invoice ${invoice.id}`)}
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
      
      {/* Payment Methods */}
      <Card title="Payment Methods" actionText="Add Payment Method" onActionClick={() => console.log('Add payment method clicked')} className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4 flex items-center">
            <div className="mr-4 bg-purple-100 p-2 rounded-full">
              <CreditCard size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="font-medium">•••• •••• •••• 4242</p>
              <p className="text-sm text-gray-500">Visa - Expires 09/26</p>
            </div>
            <div className="ml-auto">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Default
              </span>
            </div>
          </div>
          
          <div className="border rounded-lg p-4 flex items-center">
            <div className="mr-4 bg-purple-100 p-2 rounded-full">
              <CreditCard size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="font-medium">•••• •••• •••• 8888</p>
              <p className="text-sm text-gray-500">Mastercard - Expires 12/25</p>
            </div>
            <div className="ml-auto">
              <button className="text-xs text-purple-600 hover:underline">
                Make Default
              </button>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Billing History Summary */}
      <Card title="Billing Summary" className="mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 border rounded-lg bg-purple-50">
            <p className="text-sm text-gray-500">Total Spent (2025)</p>
            <p className="text-xl font-bold text-purple-600">$3,250.00</p>
          </div>
          <div className="p-4 border rounded-lg bg-green-50">
            <p className="text-sm text-gray-500">This Month</p>
            <p className="text-xl font-bold text-green-600">$975.00</p>
          </div>
          <div className="p-4 border rounded-lg bg-blue-50">
            <p className="text-sm text-gray-500">Last Month</p>
            <p className="text-xl font-bold text-blue-600">$1,250.00</p>
          </div>
          <div className="p-4 border rounded-lg bg-amber-50">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-xl font-bold text-amber-600">$75.00</p>
          </div>
        </div>
      </Card>
    </DashboardTemplate>
  );
};

export default AdvertiserPaymentsPage;