import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/styles.css';

// User Pages
import ProfilePage from './pages/user/Profile';
import ScanQRCodePage from './pages/user/ScanQRCode';
import AboutUsPage from './pages/user/AboutUs';

// Admin Pages
import AdminDashboardPage from './pages/admin/Dashboard';
import AdminSettingsPage from './pages/admin/Settings';
import AdminUsersPage from './pages/admin/Users';
import AdminTransactionsPage from './pages/admin/Transactions';

// Agent Pages
import AgentDashboardPage from './pages/agent/Dashboard';
import AgentMerchantsPage from './pages/agent/Merchants';
import AgentQRCodePage from './pages/agent/QRCode';
import AgentEarningsPage from './pages/agent/Earning';

// Advertiser Pages
import AdvertiserDashboardPage from './pages/advertiser/Dashboard';
import AdvertiserCampaignsPage from './pages/advertiser/Campaigns';
import AdvertiserAnalyticsPage from './pages/advertiser/Analytics';
import AdvertiserPaymentsPage from './pages/advertiser/Payment';

// Merchant Pages
import MerchantDashboardPage from './pages/merchant/Dashboard';
import MerchantWiFiPage from './pages/merchant/WiFi';
import MerchantAdsPage from './pages/merchant/Ads';
import MerchantRevenuePage from './pages/merchant/Revenue';

// Public Pages
import UserDashboardPage from './pages/public/Dashboard';
import RegisterOrLoginPage from './pages/public/RegisterOrLogin';
import RegisterPage from './pages/public/Register';
import LoginPage from './pages/public/Login';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/transactions" element={<AdminTransactionsPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />

        {/* Agent Routes */}
        <Route path="/agent" element={<AgentDashboardPage />} />
        <Route path="/agent/merchants" element={<AgentMerchantsPage />} />
        <Route path="/agent/qrcode" element={<AgentQRCodePage />} />
        <Route path="/agent/earnings" element={<AgentEarningsPage />} />

        {/* Advertiser Routes */}
        <Route path="/advertiser" element={<AdvertiserDashboardPage />} />
        <Route path="/advertiser/campaigns" element={<AdvertiserCampaignsPage />} />
        <Route path="/advertiser/analytics" element={<AdvertiserAnalyticsPage />} />
        <Route path="/advertiser/payments" element={<AdvertiserPaymentsPage />} />

        {/* Merchant Routes */}
        <Route path="/merchant" element={<MerchantDashboardPage />} />
        <Route path="/merchant/wifi" element={<MerchantWiFiPage />} />
        <Route path="/merchant/ads" element={<MerchantAdsPage />} />
        <Route path="/merchant/revenue" element={<MerchantRevenuePage />} />

        {/* User Routes */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/scan-qrcode" element={<ScanQRCodePage />} />
        <Route path="/about-us" element={<AboutUsPage />} />

        {/* Public Routes */}
        <Route path="/" element={<UserDashboardPage />} />
        <Route path="/register-or-login" element={<RegisterOrLoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;