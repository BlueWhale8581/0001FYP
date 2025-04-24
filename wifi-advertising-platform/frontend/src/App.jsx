import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/styles.css';

import ProfilePage from './pages/user/Profile';
import ScanQRCodePage from './pages/user/ScanQRCode';
import AboutUsPage from './pages/user/AboutUs';

import AdminDashboardPage from './pages/admin/Dashboard';
import AdminSettingsPage from './pages/admin/Settings';
import AdminUsersPage from './pages/admin/Users';
import AdminTransactionsPage from './pages/admin/Transactions';

import AgentDashboardPage from './pages/agent/Dashboard';
import AgentMerchantsPage from './pages/agent/Merchants';
import AgentQRCodePage from './pages/agent/QRCode';
import AgentEarningsPage from './pages/agent/Earning';

import AdvertiserDashboardPage from './pages/advertiser/Dashboard';
import AdvertiserCampaignsPage from './pages/advertiser/Campaigns';
import AdvertiserAnalyticsPage from './pages/advertiser/Analytics';
import AdvertiserPaymentsPage from './pages/advertiser/Payment';

import MerchantDashboardPage from './pages/merchant/Dashboard';
import MerchantWiFiPage from './pages/merchant/WiFi';
import MerchantAdsPage from './pages/merchant/Ads';
import MerchantRevenuePage from './pages/merchant/Revenue';

import UserDashboardPage from './pages/public/Dashboard';
import RegisterOrLoginPage from './pages/public/RegisterOrLogin';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/users" element={<AdminUsersPage />} />
        <Route path="/transactions" element={<AdminTransactionsPage />} />
        <Route path="/settings" element={<AdminSettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
};

export default App;