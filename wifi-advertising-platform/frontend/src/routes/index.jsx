// src/routes/index.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';
import RegisterMerchant from '../pages/public/RegisterMerchant';
import RegisterAdvertiser from '../pages/public/RegisterAdvertiser';
import DashboardPage from '../pages/DashboardPage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/register/merchant/:userId" element={<RegisterMerchant />} />
      <Route path="/register/advertiser/:userId" element={<RegisterAdvertiser />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;