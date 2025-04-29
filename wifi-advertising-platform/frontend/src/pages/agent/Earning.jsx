import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, Calendar, Download, Filter, ArrowUpRight, TrendingUp, Users } from 'lucide-react';

// Template
import DashboardTemplate from '../../templates/DashboardTemplate';

// Common components
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import ChartContainer from '../../components/common/ChartContainer';
import StatusIndicator from '../../components/common/StatusIndicator';
import EmptyState from '../../components/common/EmptyState';
import LoadingState from '../../components/common/LoadingState';

// Custom hooks
import useAgent from '../../hooks/useAgent';
import useAuth from '../../hooks/useAuth';

const EarningsPage = () => {
  const { isAuthenticated, user, fetchCurrentUser } = useAuth();
  const [filterPeriod, setFilterPeriod] = useState('month');
  const [isLoading, setIsLoading] = useState(false);

  // Use custom hooks for real data
  const { useEarnings, useTransactions, useNotifications } = useAgent();
  const { earnings, loading: earningsLoading, fetchEarnings, params, setParams } = useEarnings();
  const { transactions, loading: transactionsLoading, fetchTransactions } = useTransactions();
  const { notifications, loading: notificationsLoading } = useNotifications();

  useEffect(() => {
    if (isAuthenticated && !user) {
      fetchCurrentUser();
    }
  }, [isAuthenticated, user, fetchCurrentUser]);

  if (!isAuthenticated) {
    return (
      <DashboardTemplate
        role="user"
        userName="Visitor"
        pageTitle="Earnings"
      >
        <p className="text-center text-gray-500">Please log in to view earnings.</p>
      </DashboardTemplate>
    );
  }

  // Filter transactions based on selected period
  const handleFilterChange = (period) => {
    setIsLoading(true);
    setFilterPeriod(period);

    // Update params for data fetching
    const updatedParams = { period };
    setParams(updatedParams);

    // Fetch with new params
    Promise.all([
      fetchEarnings(updatedParams),
      fetchTransactions(updatedParams)
    ]).finally(() => {
      setIsLoading(false);
    });
  };

  // Format date for better readability
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Check if any data is loading
  const dataLoading = earningsLoading || transactionsLoading || notificationsLoading || isLoading;

  if (dataLoading && (!earnings || !transactions)) {
    return (
      <DashboardTemplate
        role="agent"
        userName={user?.name || "Agent"}
        notifications={[]}
        pageTitle="Earnings"
      >
        <LoadingState message="Loading earnings data..." />
      </DashboardTemplate>
    );
  }

  return (
    <DashboardTemplate
      role="agent"
      userName={user?.name || earnings?.agentName || "Agent"}
      notifications={notifications || []}
      pageTitle="Earnings"
    >
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Earnings Summary</h2>
          <p className="text-sm text-gray-500">View your commission earnings and transaction history</p>
        </div>
        <div className="flex space-x-2 mt-2 sm:mt-0">
          <Button 
            text="Download Report" 
            className="bg-orange-500 hover:bg-orange-600 flex items-center"
            onClick={() => console.log('Download report clicked')}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-orange-50">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 mr-3">
              <DollarSign size={24} className="text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Month</p>
              <p className="text-2xl font-bold text-orange-600">${earnings?.currentMonth?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-green-50">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-3">
              <ArrowUpRight size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Monthly Growth</p>
              <p className="text-2xl font-bold text-green-600">+{earnings?.growth?.toFixed(1) || '0.0'}%</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-blue-50">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-3">
              <Calendar size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Projected</p>
              <p className="text-2xl font-bold text-blue-600">${earnings?.projected?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-purple-50">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-3">
              <TrendingUp size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Year to Date</p>
              <p className="text-2xl font-bold text-purple-600">${earnings?.ytd?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts and Data */}
      <div className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartContainer 
          title="Monthly Earnings"
          actionText="View Details"
          onActionClick={() => console.log('View details clicked')}
          className="lg:col-span-2"
        >
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            {/* Placeholder for chart - would be replaced with actual chart component */}
            <div className="text-center">
              <div className="flex flex-col items-center">
                <div className="w-full h-48 bg-gradient-to-r from-orange-100 to-orange-300 rounded-lg relative">
                  {/* Simple chart mockup */}
                  <div className="absolute bottom-0 left-0 w-full h-full flex items-end">
                    <div className="h-20% w-1/6 bg-orange-500 mx-1"></div>
                    <div className="h-40% w-1/6 bg-orange-500 mx-1"></div>
                    <div className="h-30% w-1/6 bg-orange-500 mx-1"></div>
                    <div className="h-60% w-1/6 bg-orange-500 mx-1"></div>
                    <div className="h-50% w-1/6 bg-orange-500 mx-1"></div>
                    <div className="h-80% w-1/6 bg-orange-500 mx-1"></div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Monthly earnings trend</p>
              </div>
            </div>
          </div>
        </ChartContainer>

        <Card title="Merchant Performance">
          <div className="space-y-3">
            {earnings?.merchantPerformance?.map((merchant) => (
              <div key={merchant.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-orange-100 mr-2">
                    <Users size={16} className="text-orange-600" />
                  </div>
                  <span className="text-sm">{merchant.name}</span>
                </div>
                <span className="font-semibold">${merchant.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card title="Recent Transactions" className="mb-6">
        <div className="mb-4 flex flex-wrap gap-2">
          <button 
            className={`px-3 py-1 text-sm rounded-full ${filterPeriod === 'week' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
            onClick={() => handleFilterChange('week')}
          >
            This Week
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded-full ${filterPeriod === 'month' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
            onClick={() => handleFilterChange('month')}
          >
            This Month
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded-full ${filterPeriod === 'quarter' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
            onClick={() => handleFilterChange('quarter')}
          >
            This Quarter
          </button>
        </div>

        {transactionsLoading ? (
          <LoadingState message="Loading transactions..." />
        ) : transactions?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b">
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Merchant</th>
                  <th className="pb-2">Description</th>
                  <th className="pb-2 text-right">Amount</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100">
                    <td className="py-3 text-sm">{formatDate(transaction.date)}</td>
                    <td className="py-3 text-sm">{transaction.merchant}</td>
                    <td className="py-3 text-sm">{transaction.description}</td>
                    <td className="py-3 text-sm text-right font-medium">${transaction.amount.toFixed(2)}</td>
                    <td className="py-3 text-sm text-right">
                      <StatusIndicator status={transaction.status} color="green" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState 
            title="No Transactions"
            description="There are no transactions for the selected period."
          />
        )}
      </Card>

      {/* Payment Information */}
      <Card title="Payment Information" className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <p className="text-sm text-gray-500">Next Payment Date</p>
            <p className="font-medium">{earnings?.nextPaymentDate || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Payment Method</p>
            <div className="flex items-center">
              <CreditCard size={16} className="mr-2 text-gray-600" />
              <p className="font-medium">{earnings?.paymentMethod || 'N/A'}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending Amount</p>
            <p className="font-medium text-orange-600">${earnings?.pending?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="mt-3 sm:mt-0">
            <Button 
              text="Update Payment Info" 
              className="bg-gray-200 hover:bg-gray-300 text-gray-800"
              onClick={() => console.log('Update payment info clicked')}
            />
          </div>
        </div>
      </Card>
    </DashboardTemplate>
  );
};

export default EarningsPage;