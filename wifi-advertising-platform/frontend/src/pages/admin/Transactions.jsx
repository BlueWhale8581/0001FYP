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

// Hooks
import { useTransactions, useRevenueOverview } from '../../hooks/useAdmin';
import useAuth from '../../hooks/useAuth';

const TransactionsPage = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <DashboardTemplate
        role="guest"
        userName="Guest"
        pageTitle="Transaction Management"
      >
        <p className="text-center text-gray-500">Please log in to manage transactions.</p>
      </DashboardTemplate>
    );
  }

  const [searchTerm, setSearchTerm] = useState('');
  const [queryParams, setQueryParams] = useState({});
  
  // Fetch transactions using the hook
  const { 
    transactions, 
    loading: transactionsLoading, 
    error: transactionsError,
    params,
    setParams,
    fetchTransactions,
    approveTransaction,
    rejectTransaction
  } = useTransactions();
  
  // Fetch revenue data using the hook
  const { 
    revenue, 
    loading: revenueLoading, 
    error: revenueError 
  } = useRevenueOverview();

  const handleSearch = () => {
    setParams({
      ...params,
      search: searchTerm
    });
    fetchTransactions({
      ...params,
      search: searchTerm
    });
  };

  const handleExport = async () => {
    console.log('Export clicked');
  };

  // Handle transaction actions
  const handleApprove = async (transactionId) => {
    await approveTransaction(transactionId);
  };

  const handleReject = async (transactionId) => {
    await rejectTransaction(transactionId, 'Rejected by administrator');
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
          onClick={handleExport}
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
              <p className="text-xl font-bold text-blue-600">
                {revenueLoading ? '...' : revenue?.today?.count || 0}
              </p>
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
              <p className="text-xl font-bold text-green-600">
                {revenueLoading ? '...' : `$${revenue?.today?.amount?.toFixed(2) || '0.00'}`}
              </p>
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
              <p className="text-xl font-bold text-purple-600">
                {revenueLoading ? '...' : `$${revenue?.month?.amount?.toFixed(2) || '0.00'}`}
              </p>
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
              <p className="text-xl font-bold text-red-600">
                {revenueLoading ? '...' : `$${revenue?.refunds?.amount?.toFixed(2) || '0.00'}`}
              </p>
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
        {transactionsLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Loading transactions...</p>
          </div>
        ) : transactionsError ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-red-500">{transactionsError}</p>
          </div>
        ) : (
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
                {transactions && transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <tr key={transaction._id || transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction.transactionId || transaction.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.userName || transaction.user?.name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">${transaction.amount?.toFixed(2) || '0.00'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(transaction.createdAt || transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusIndicator 
                          status={transaction.status} 
                          color={
                            transaction.status === 'Completed' ? 'green' : 
                            transaction.status === 'Pending' ? 'yellow' : 'red'
                          } 
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          onClick={() => console.log('View transaction', transaction._id || transaction.id)}
                        >
                          View
                        </button>
                        {transaction.status === 'Pending' && (
                          <>
                            <button 
                              className="text-green-600 hover:text-green-900 mr-3"
                              onClick={() => handleApprove(transaction._id || transaction.id)}
                            >
                              Approve
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleReject(transaction._id || transaction.id)}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {transaction.status === 'Completed' && (
                          <button 
                            className="text-gray-600 hover:text-gray-900"
                            onClick={() => console.log('Generate receipt', transaction._id || transaction.id)}
                          >
                            Receipt
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </DashboardTemplate>
  );
};

export default TransactionsPage;