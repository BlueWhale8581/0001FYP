import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/styles.css';

// User Pages
import ScanQRCodePage from './pages/user/ScanQRCode';
import AboutUsPage from './pages/user/AboutUs';

// Admin Pages
import AdminDashboardPage from './pages/admin/Dashboard';
import AdminSettingsPage from './pages/admin/Settings';
import AdminUsersPage from './pages/admin/Users';
import AdminCreateUserPage from './pages/admin/UsersCreate';
import AdminEditUserPage from './pages/admin/UsersEdit';
import AdminTransactionsPage from './pages/admin/Transactions';
import AdminProfilePage from './pages/admin/Profile';

// Agent Pages
import AgentDashboardPage from './pages/agent/Dashboard';
import AgentMerchantsPage from './pages/agent/Merchants';
import AgentCreateMerchantPage from './pages/agent/MerchantsCreate';
import AgentEditMerchantPage from './pages/agent/MerchantsEdit';
import AgentQRCodePage from './pages/agent/QRCode';
import AgentEarningsPage from './pages/agent/Earning';
import AgentProfilePage from './pages/agent/Profile';

// Advertiser Pages
import AdvertiserDashboardPage from './pages/advertiser/Dashboard';
import AdvertiserCampaignsPage from './pages/advertiser/Campaigns';
import AdvertiserCampaignsCreatePage from './pages/advertiser/CampaignsCreate';
import AdvertiserCampaignsEditPage from './pages/advertiser/CampaignsEdit';
import AdvertiserAnalyticsPage from './pages/advertiser/Analytics';
import AdvertiserPaymentsPage from './pages/advertiser/Payment';
import AdvertiserProfilePage from './pages/advertiser/Profile';
import AdvertiserDetailsPage from './pages/advertiser/Details';

// Merchant Pages
import MerchantDashboardPage from './pages/merchant/Dashboard';
import MerchantWiFiPage from './pages/merchant/WiFi';
import MerchantAdsPage from './pages/merchant/Ads';
import MerchantRevenuePage from './pages/merchant/Revenue';
import MerchantProfilePage from './pages/merchant/Profile';
import MerchantDetailsPage from './pages/merchant/Details';

// Public Pages
import UserDashboardPage from './pages/public/Dashboard';
import RegisterPage from './pages/public/RegisterAccount';
import LoginPage from './pages/public/Login';
import RegisterMerchant from './pages/public/RegisterMerchant';
import RegisterAdvertiser from './pages/public/RegisterAdvertiser';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/createuser" element={<AdminCreateUserPage />} />
        <Route path="/admin/edituser/:id" element={<AdminEditUserPage />} />
        <Route path="/admin/transactions" element={<AdminTransactionsPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />
        <Route path="/admin/profile" element={<AdminProfilePage />} />

        {/* Agent Routes */}
        <Route path="/agent" element={<AgentDashboardPage />} />
        <Route path="/agent/merchants" element={<AgentMerchantsPage />} />
        <Route path="/agent/createmerchant" element={<AgentCreateMerchantPage />} />
        <Route path="/agent/editmerchant/:id" element={<AgentEditMerchantPage />} />
        <Route path="/agent/qrcode" element={<AgentQRCodePage />} />
        <Route path="/agent/earnings" element={<AgentEarningsPage />} />
        <Route path="/agent/profile" element={<AgentProfilePage />} />

        {/* Advertiser Routes */}
        <Route path="/advertiser" element={<AdvertiserDashboardPage />} />
        <Route path="/advertiser/campaigns" element={<AdvertiserCampaignsPage />} />
        <Route path="/advertiser/campaigns/create" element={<AdvertiserCampaignsCreatePage />} />
        <Route path="/advertiser/campaigns/edit/:id" element={<AdvertiserCampaignsEditPage />} />
        <Route path="/advertiser/analytics" element={<AdvertiserAnalyticsPage />} />
        <Route path="/advertiser/payments" element={<AdvertiserPaymentsPage />} />
        <Route path="/advertiser/profile" element={<AdvertiserProfilePage />} />
        <Route path="/advertiser/details" element={<AdvertiserDetailsPage />} />

        {/* Merchant Routes */}
        <Route path="/merchant" element={<MerchantDashboardPage />} />
        <Route path="/merchant/wifi" element={<MerchantWiFiPage />} />
        <Route path="/merchant/ads" element={<MerchantAdsPage />} />
        <Route path="/merchant/revenue" element={<MerchantRevenuePage />} />
        <Route path="/merchant/profile" element={<MerchantProfilePage />} />
        <Route path="/merchant/details" element={<MerchantDetailsPage />} />

        {/* User Routes */}
        <Route path="/scan" element={<ScanQRCodePage />} />
        <Route path="/aboutus" element={<AboutUsPage />} />

        {/* Public Routes */}
        <Route path="/" element={<UserDashboardPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/merchant/:userId" element={<RegisterMerchant />} />
        <Route path="/register/advertiser/:userId" element={<RegisterAdvertiser />} />
        
      </Routes>
    </Router>
  );
};

export default App;