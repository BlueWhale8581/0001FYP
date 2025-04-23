import React from 'react';
import { CreditCard, DollarSign, TrendingUp, Calendar, Download, Filter, ArrowUp, ArrowDown } from 'lucide-react';

// Template
import DashboardTemplate from '../../templates/DashboardTemplate';

// Common components
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import ChartContainer from '../../components/common/ChartContainer';

const MerchantRevenuePage = () => {
  const placeholderChart = <div className="h-48 bg-gray-100 rounded flex items-center justify-center">Revenue Chart Placeholder</div>;

  return (
    <DashboardTemplate
      role="merchant"
      userName="Coffee Shop Owner"
      notifications={[
        { id: 1, type: 'success', message: 'Payment received: $126.50', time: '30m ago', read: false },
        { id: 2, type: 'info', message: 'Monthly revenue report available', time: '2d ago', read: true },
      ]}
      pageTitle="Revenue Management"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Revenue Overview Cards */}
        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <DollarSign size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold">$8,245.60</p>
              <p className="text-xs text-green-500 flex items-center">
                <ArrowUp size={12} className="mr-1" />
                +12% from last month
              </p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <TrendingUp size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Ad Revenue</p>
              <p className="text-2xl font-bold">$2,456.30</p>
              <p className="text-xs text-green-500 flex items-center">
                <ArrowUp size={12} className="mr-1" />
                +18% from last month
              </p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-3">
              <CreditCard size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">WiFi Service</p>
              <p className="text-2xl font-bold">$1,378.90</p>
              <p className="text-xs text-red-500 flex items-center">
                <ArrowDown size={12} className="mr-1" />
                -3% from last month
              </p>
            </div>
          </div>
        </Card>
        
        {/* Revenue Analytics */}
        <ChartContainer title="Revenue Trends" actionText="Export" onActionClick={() => console.log('Export chart')} className="md:col-span-2">
          {placeholderChart}
        </ChartContainer>
        
        {/* Revenue by Source */}
        <Card title="Revenue Sources">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Ad Views</p>
              <p className="text-sm font-bold">$1,245.30</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">WiFi Premium</p>
              <p className="text-sm font-bold">$876.50</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '32%' }}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Promotions</p>
              <p className="text-sm font-bold">$624.80</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '23%' }}></div>
            </div>
          </div>
        </Card>
        
        {/* Recent Transactions */}
        <Card title="Recent Transactions" actionText="View All" onActionClick={() => console.log('View all transactions')} className="md:col-span-3">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  { date: 'Apr 23, 2025', id: 'TRX-38291', source: 'Ad Revenue', amount: '$45.60', status: 'Completed' },
                  { date: 'Apr 22, 2025', id: 'TRX-38290', source: 'WiFi Premium', amount: '$20.00', status: 'Completed' },
                  { date: 'Apr 22, 2025', id: 'TRX-38289', source: 'Promotion', amount: '$75.00', status: 'Completed' },
                  { date: 'Apr 21, 2025', id: 'TRX-38288', source: 'Ad Revenue', amount: '$32.40', status: 'Completed' },
                  { date: 'Apr 20, 2025', id: 'TRX-38287', source: 'WiFi Premium', amount: '$20.00', status: 'Pending' }
                ].map((transaction, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm text-gray-500">{transaction.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{transaction.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{transaction.source}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{transaction.amount}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        transaction.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        
        {/* Payment Actions */}
        <Card title="Payment Actions" className="md:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg bg-blue-50">
              <div className="flex items-center mb-3">
                <Download size={20} className="text-blue-600 mr-2" />
                <h4 className="font-medium text-blue-600">Download Reports</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">Download monthly or annual financial reports for your records.</p>
              <div className="flex space-x-2">
                <Button 
                  text="Monthly"
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-1 text-sm"
                  onClick={() => console.log('Download monthly report')}
                />
                <Button 
                  text="Annual"
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-1 text-sm"
                  onClick={() => console.log('Download annual report')}
                />
              </div>
            </div>
            
            <div className="p-4 border rounded-lg bg-green-50">
              <div className="flex items-center mb-3">
                <Calendar size={20} className="text-green-600 mr-2" />
                <h4 className="font-medium text-green-600">Schedule Payments</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">Set up automatic payouts to your bank account.</p>
              <Button 
                text="Schedule"
                className="bg-green-600 hover:bg-green-700 w-full"
                onClick={() => console.log('Schedule payment')}
              />
            </div>
            
            <div className="p-4 border rounded-lg bg-purple-50">
              <div className="flex items-center mb-3">
                <Filter size={20} className="text-purple-600 mr-2" />
                <h4 className="font-medium text-purple-600">Revenue Settings</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">Adjust your revenue distribution and payment preferences.</p>
              <Button 
                text="Settings"
                className="bg-purple-600 hover:bg-purple-700 w-full"
                onClick={() => console.log('Revenue settings')}
              />
            </div>
          </div>
        </Card>
      </div>
    </DashboardTemplate>
  );
};

export default MerchantRevenuePage;