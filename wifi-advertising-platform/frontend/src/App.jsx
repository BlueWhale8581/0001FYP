import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MerchantDashboardPage from './pages/merchant/MerchantDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Set MerchantDashboardPage as the default landing page */}
        <Route path="/" element={<MerchantDashboardPage />} />
        {/* Add other routes here if needed */}
      </Routes>
    </Router>
  );
};

export default App;