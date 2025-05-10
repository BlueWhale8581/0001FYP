// templates/DashboardTemplate.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Layout components
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import NotificationPanel from '../components/layout/NotificationPanel';
import BottomNavigation from '../components/layout/BottomNavigation';
import Footer from '../components/layout/Footer';
import PageContainer from '../components/layout/PageContainer';

// Role configurations
import { dashboardTitles, navigationItems } from '../utils/roleConfig';

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
  const navigate = useNavigate();

  // Get role-specific configurations
  const dashboardTitle = dashboardTitles[role];
  const navItems = navigationItems[role];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSidebarOpen(false);

    // Find the route for the selected tab and navigate
    const selectedTab = navItems.find((item) => item.id === tabId);
    if (selectedTab && selectedTab.route) {
      navigate(selectedTab.route);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header 
        title={dashboardTitle}
        notificationCount={notifications.filter(n => !n.read).length}
        onMenuClick={() => setSidebarOpen(true)}
        onNotificationClick={() => setNotificationsOpen(true)}
        onProfileClick={() => console.log('Profile clicked')}
      />
      
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userName={userName}
        userRole={role}
        navigationItems={navItems}
        activeTabId={activeTab}
        onTabChange={handleTabChange}
      />
      
      <NotificationPanel 
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
      />
      
      <PageContainer>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{pageTitle}</h1>
        {children}
      </PageContainer>
      
      <BottomNavigation 
        navigationItems={navItems}
        activeTabId={activeTab}
        onTabChange={handleTabChange}
      />
      
      <Footer />
    </div>
  );
};

export default DashboardTemplate;