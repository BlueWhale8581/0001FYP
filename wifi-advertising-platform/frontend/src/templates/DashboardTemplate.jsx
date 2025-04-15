// templates/DashboardTemplate.jsx
import React, { useState } from 'react';

// Layout components
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import NotificationPanel from '../components/layout/NotificationPanel';
import BottomNavigation from '../components/layout/BottomNavigation';
import Footer from '../components/layout/Footer';
import PageContainer from '../components/layout/PageContainer';

// Role configurations
import { roleColors, dashboardTitles, navigationItems } from '../utils/roleConfig';

const DashboardTemplate = ({ 
  role = 'user',
  userName = 'User Name',
  notifications = [],
  children,
  pageTitle = 'Dashboard'
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Get role-specific configurations
  const { bgColor, textColor } = roleColors[role];
  const dashboardTitle = dashboardTitles[role];
  const navItems = navigationItems[role];
  
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header 
        title={dashboardTitle}
        notificationCount={notifications.filter(n => !n.read).length}
        roleColor={bgColor}
        onMenuClick={() => setSidebarOpen(true)}
        onNotificationClick={() => setNotificationsOpen(true)}
        onProfileClick={() => console.log('Profile clicked')}
      />
      
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userName={userName}
        userRole={role}
        roleColor={bgColor}
        navigationItems={navItems}
        activeTabId={activeTab}
        onTabChange={handleTabChange}
        onSettingsClick={() => console.log('Settings clicked')}
        onLogoutClick={() => console.log('Logout clicked')}
      />
      
      <NotificationPanel 
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
      />
      
      <PageContainer title={pageTitle}>
        {children}
      </PageContainer>
      
      <BottomNavigation 
        navigationItems={navItems}
        activeTabId={activeTab}
        onTabChange={handleTabChange}
        roleColor={textColor}
      />
      
      <Footer 
        version="1.0.2"
        appName="WiFi Service Portal"
      />
    </div>
  );
};

export default DashboardTemplate;