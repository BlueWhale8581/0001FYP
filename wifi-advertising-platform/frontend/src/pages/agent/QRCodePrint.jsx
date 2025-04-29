import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import DashboardTemplate from '../../templates/DashboardTemplate';

const QRCodePrintPage = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <DashboardTemplate
        role="guest"
        userName="Guest"
        pageTitle="Print QR Code"
      >
        <p className="text-center text-gray-500">Please log in to print a QR code.</p>
      </DashboardTemplate>
    );
  }

  return (
    <DashboardTemplate
      role="agent"
      userName={user?.name || "Agent"}
      pageTitle="Print QR Code"
    >
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">QR Code Print functionality coming soon...</p>
      </div>
    </DashboardTemplate>
  );
};

export default QRCodePrintPage;