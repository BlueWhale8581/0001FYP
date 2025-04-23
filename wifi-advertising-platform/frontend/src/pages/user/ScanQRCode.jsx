import React from 'react';
import DashboardTemplate from '../../templates/DashboardTemplate';
import EmptyState from '../../components/common/EmptyState';

const ScanQRCodePage = () => {
  return (
    <DashboardTemplate
      role="user"
      userName="Jane Doe"
      pageTitle="Scan QR Code"
    >
      <EmptyState
        title="Scan QR Code"
        description="Point your camera at the QR code to connect to WiFi."
        actionText="Start Scanning"
        onActionClick={() => console.log('Scanning started')}
      />
    </DashboardTemplate>
  );
};

export default ScanQRCodePage;