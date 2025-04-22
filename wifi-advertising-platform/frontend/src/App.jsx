import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MerchantDashboardPage from './pages/merchant/MerchantDashboard';
import AdminDashboard from './pages/admin/Dashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MerchantDashboardPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;