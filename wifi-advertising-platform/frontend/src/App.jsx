import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserDashboardPage from './pages/user/UserDashboard';
import ScanQRCodePage from './pages/user/ScanQRCode';
import RegisterOrLoginPage from './pages/user/RegisterOrLogin';
import AboutUsPage from './pages/user/AboutUs';
import './styles/styles.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserDashboardPage />} />
        <Route path="/scan" element={<ScanQRCodePage />} />
        <Route path="/register" element={<RegisterOrLoginPage />} />
        <Route path="/aboutus" element={<AboutUsPage />} />
      </Routes>
    </Router>
  );
};

export default App;