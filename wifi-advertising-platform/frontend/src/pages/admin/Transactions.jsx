import React, { useState } from 'react';
import { CreditCard, DollarSign, Calendar, Download } from 'lucide-react';

// Template
import DashboardTemplate from '../../templates/DashboardTemplate';

// Common components
import Card from '../../components/common/Card';
import SearchBar from '../../components/common/SearchBar';
import StatusIndicator from '../../components/common/StatusIndicator';
import ChartContainer from '../../components/common/ChartContainer';
import Button from '../../components/common/Button';

const TransactionsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock transaction data
  const transactions = [
    { id: 'TRX-001', user: 'Jane Doe', amount: 129.99, date: '2025-04-22', type: 'Payment', status: 'Completed' },
    { id: 'TRX-002', user: 'John Smith', amount: 89.50, date: '2025-04-22', type: 'Subscription', status: 'Completed' },
    { id: 'TRX-003', user: 'Emily Johnson', amount: 45.75, date: '2025-04-21', type: 'Payment', status: 'Pending' },
    { id: 'TRX-004', user: 'Michael Brown', amount: 199.99, date: '2025-04-21', type: 'Upgrade', status: 'Completed' },
    { id: 'TRX-005', user: 'Sarah Wilson', amount: 64.25, date: '2025-04-20', type: 'Payment', status: 'Failed' },
  ];

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
    // Implement search logic
  };

  return (
    <DashboardTemplate
      role="admin"
      userName="John Admin"
      notifications={[
        { id: 1, type: 'warning', message: 'System update required', time: '5m ago', read: false },
        { id: 2, type: 'error', message: 'Server #3 is offline', time: '30m ago', read: false },
      ]}
      pageTitle="Transaction Management"
    >
      {/* Search and Export */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <SearchBar
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={setSearchTerm}
          onSearch={handleSearch}
          className="flex-grow"
        />
        <Button
          text="Export"
          className="bg-green-600 hover:bg-green-700 flex items-center"
          onClick={() => console.log('Export clicked')}
        />
      </div>

      {/* Transaction Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <CreditCard size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Today's Transactions</p>
              <p className="text-xl font-bold text-blue-600">28</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <DollarSign size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Today's Revenue</p>
              <p className="text-xl font-bold text-green-600">$1,249.50</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <Calendar size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Monthly Revenue</p>
              <p className="text-xl font-bold text-purple-600">$24,518.75</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 mr-4">
              <Download size={24} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Refunds (Monthly)</p>
              <p className="text-xl font-bold text-red-600">$875.25</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Transaction Chart */}
      <ChartContainer title="Transaction Overview" actionText="View Details">
        <div className="h-64 w-full bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">Transaction chart would appear here</p>
        </div>
      </ChartContainer>

      {/* Recent Transactions */}
      <Card title="Recent Transactions" actionText="View All" className="mt-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">${transaction.amount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusIndicator 
                      status={transaction.status} 
                      color={transaction.status === 'Completed' ? 'green' : transaction.status === 'Pending' ? 'yellow' : 'red'} 
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                    <button className="text-gray-600 hover:text-gray-900">Receipt</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardTemplate>
  );
};

export default TransactionsPage;