// utils/roleConfig.js
import { Home, Users, CreditCard, Settings, Wifi, PieChart, Award, BarChart, User, FileText } from 'lucide-react';

// Role-specific colors
export const roleColors = {
  admin: {
    bgColor: 'bg-blue-600',
    textColor: 'blue'
  },
  merchant: {
    bgColor: 'bg-green-600',
    textColor: 'green'
  },
  agent: {
    bgColor: 'bg-orange-500',
    textColor: 'orange'
  },
  advertiser: {
    bgColor: 'bg-purple-600',
    textColor: 'purple'
  },
  user: {
    bgColor: 'bg-teal-500',
    textColor: 'teal'
  },
};

// Role-specific dashboard titles
export const dashboardTitles = {
  admin: 'Admin Dashboard',
  merchant: 'Merchant Dashboard',
  agent: 'Agent Dashboard',
  advertiser: 'Advertiser Dashboard',
  user: 'User Dashboard',
};

// Role-specific navigation items
export const navigationItems = {
  admin: [
    { id: 'dashboard', icon: <Home size={20} />, label: 'Overview' },
    { id: 'users', icon: <Users size={20} />, label: 'Users' },
    { id: 'transactions', icon: <CreditCard size={20} />, label: 'Transactions' },
    { id: 'settings', icon: <Settings size={20} />, label: 'Settings' },
  ],
  merchant: [
    { id: 'dashboard', icon: <Home size={20} />, label: 'Overview' },
    { id: 'wifi', icon: <Wifi size={20} />, label: 'WiFi' },
    { id: 'ads', icon: <PieChart size={20} />, label: 'Ads' },
    { id: 'revenue', icon: <CreditCard size={20} />, label: 'Revenue' },
  ],
  agent: [
    { id: 'dashboard', icon: <Home size={20} />, label: 'Overview' },
    { id: 'merchants', icon: <Users size={20} />, label: 'Merchants' },
    { id: 'qrcodes', icon: <FileText size={20} />, label: 'QR Codes' },
    { id: 'earnings', icon: <CreditCard size={20} />, label: 'Earnings' },
  ],
  advertiser: [
    { id: 'dashboard', icon: <Home size={20} />, label: 'Overview' },
    { id: 'campaigns', icon: <Award size={20} />, label: 'Campaigns' },
    { id: 'analytics', icon: <BarChart size={20} />, label: 'Analytics' },
    { id: 'payments', icon: <CreditCard size={20} />, label: 'Payments' },
  ],
  user: [
    { id: 'dashboard', icon: <Home size={20} />, label: 'Dashboard' },
    { id: 'profile', icon: <User size={20} />, label: 'Profile' },
    { id: 'transactions', icon: <CreditCard size={20} />, label: 'Transactions' },
    { id: 'settings', icon: <Settings size={20} />, label: 'Settings' },
  ],
};