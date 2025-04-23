// utils/roleConfig.js
import { Home, Users, CreditCard, Settings, Wifi, PieChart, Award, BarChart, User, FileText, Scan } from 'lucide-react';

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
  user: 'WiFi Linking',
};

// Role-specific navigation items
export const navigationItems = {
  admin: [
    { id: 'dashboard', icon: <Home size={20} />, label: 'Dashboard' , route:"/admin"},
    { id: 'users', icon: <Users size={20} />, label: 'Users', route:"/users"},
    { id: 'transactions', icon: <CreditCard size={20} />, label: 'Transactions', route:"/transactions"},
    { id: 'settings', icon: <Settings size={20} />, label: 'Settings', route:"/settings"},
    { id: 'profile', icon: <User size={20} />, label: 'Profile', route:"/profile"},
  ],
  merchant: [
    { id: 'dashboard', icon: <Home size={20} />, label: 'Dashboard' , route:"/merchant"},
    { id: 'wifi', icon: <Wifi size={20} />, label: 'WiFi', route:"/WiFi"},
    { id: 'ads', icon: <PieChart size={20} />, label: 'Ads', route:"/ads"},
    { id: 'revenue', icon: <CreditCard size={20} />, label: 'Revenue', route:"/revenue"},
    { id: 'profile', icon: <User size={20} />, label: 'Profile', route:"/profile"},
  ],
  agent: [
    { id: 'dashboard', icon: <Home size={20} />, label: 'Dashboard' , route:"/agent"},
    { id: 'merchants', icon: <Users size={20} />, label: 'Merchants' , route:"/merchants"},
    { id: 'qrcodes', icon: <FileText size={20} />, label: 'QR Codes' , route:"/QRcode"},
    { id: 'earnings', icon: <CreditCard size={20} />, label: 'Earnings' , route:"/earning"},
    { id: 'profile', icon: <User size={20} />, label: 'Profile' , route:"/profile"},
  ],
  advertiser: [
    { id: 'dashboard', icon: <Home size={20} />, label: 'Dashboard' , route:"/advertiser"},
    { id: 'campaigns', icon: <Award size={20} />, label: 'Campaigns'  , route:"/campaigns"},
    { id: 'analytics', icon: <BarChart size={20} />, label: 'Analytics' , route:"/analytics"},
    { id: 'payments', icon: <CreditCard size={20} />, label: 'Payments' , route:"/payments"},
    { id: 'profile', icon: <User size={20} />, label: 'Profile' , route:"/profile"},
  ],
  user: [
    { id: 'dashboard', icon: <Home size={20} />, label: 'Dashboard', route: '/' },
    { id: 'scan', icon: <Scan size={20} />, label: 'Scan QR', route: '/scan' },
    { id: 'register', icon: <User size={20} />, label: 'Register/Login', route: '/register' },
    { id: 'aboutus', icon: <Settings size={20} />, label: 'About Us', route: '/aboutus' },
  ],
};