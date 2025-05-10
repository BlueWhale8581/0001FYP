// components/layout/Header.jsx
import React from 'react';
import { Menu, Bell, User } from 'lucide-react';

const Header = ({ 
  title, 
  notificationCount = 0,
  roleColor = 'bg-blue-600',
  onMenuClick,
  onNotificationClick,
  onProfileClick 
}) => {
  return (
    <>
      {/* App Bar */}
      <div className={`flex items-center justify-between px-4 py-3 shadow-sm ${roleColor} text-white`}>
        <button onClick={onMenuClick} className="focus:outline-none">
          <Menu size={24} />
        </button>
        <h1 className="text-lg font-semibold">{title}</h1>
        <div className="flex gap-4">
          <button onClick={onNotificationClick} className="relative focus:outline-none">
            <Bell size={24} />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>
          <button onClick={onProfileClick} className="focus:outline-none">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default Header;