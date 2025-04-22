import React, { useState } from 'react';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import PageContainer from '../../components/layout/PageContainer';
import Card from '../../components/common/Card';
import NotificationPanel from '../../components/layout/NotificationPanel';
import Footer from '../../components/layout/Footer';

const Dashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isNotificationPanelOpen, setNotificationPanelOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <i className="fas fa-home"></i> },
    { id: 'reports', label: 'Reports', icon: <i className="fas fa-chart-bar"></i> },
    { id: 'settings', label: 'Settings', icon: <i className="fas fa-cog"></i> },
  ];

  const notifications = [
    { id: 1, message: 'New user signed up', type: 'info', time: '2 mins ago', read: false },
    { id: 2, message: 'Server maintenance scheduled', type: 'warning', time: '1 hour ago', read: true },
  ];

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header
        title="Admin Dashboard"
        notificationCount={notifications.filter(n => !n.read).length}
        onMenuClick={() => setSidebarOpen(true)}
        onNotificationClick={() => setNotificationPanelOpen(true)}
      />

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setSidebarOpen(false)}
          navigationItems={navigationItems}
          activeTabId="dashboard"
          onTabChange={(id) => console.log(`Navigated to ${id}`)}
        />

        {/* Page Content */}
        <PageContainer title="Overview">
          <Card title="Total Users" actionText="View Details" onActionClick={() => console.log('View Users')}>
            <p className="text-lg font-bold">1,234</p>
          </Card>
          <Card title="Active Campaigns" actionText="Manage" onActionClick={() => console.log('Manage Campaigns')}>
            <p className="text-lg font-bold">12</p>
          </Card>
          <Card title="Revenue" actionText="View Report" onActionClick={() => console.log('View Report')}>
            <p className="text-lg font-bold">$45,678</p>
          </Card>
        </PageContainer>
      </div>

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={isNotificationPanelOpen}
        onClose={() => setNotificationPanelOpen(false)}
        notifications={notifications}
      />

      {/* Footer */}
      <Footer version="1.0.0" appName="WiFi Advertising Platform" />
    </div>
  );
};

export default Dashboard;