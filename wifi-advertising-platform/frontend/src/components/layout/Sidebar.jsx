// components/layout/Sidebar.jsx
import React from 'react';
import { User, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ 
  isOpen, 
  onClose, 
  userName = 'User Name',
  userRole = 'user',
  roleColor = 'bg-blue-600',
  navigationItems = [],
  activeTabId = '',
  onTabChange,
  onLogoutClick
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    if (onLogoutClick) {
      onLogoutClick();
    }
    navigate('/');
  };

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-30 bg-black/50" onClick={onClose}>
      <div 
        className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform z-40"
        onClick={e => e.stopPropagation()}
      >
        <div className={`${roleColor} p-4 text-white`}>
          <div className="w-16 h-16 rounded-full bg-white/20 mx-auto mb-2 flex items-center justify-center">
            <User size={32} />
          </div>
          <h3 className="text-center font-semibold">{userName}</h3>
          <p className="text-center text-sm opacity-80 capitalize">{userRole}</p>
        </div>
        
        <div className="p-4">
          <h4 className="text-xs uppercase text-gray-500 font-bold mb-2">Main Menu</h4>
          <nav className="mb-8">
            {navigationItems.map(item => (
              <button
                key={item.id}
                className={`flex items-center w-full px-4 py-3 mb-1 rounded-lg ${
                  activeTabId === item.id 
                    ? `${roleColor} text-white` 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => onTabChange(item.id)}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </button>
            ))}
          </nav>
          
          <h4 className="text-xs uppercase text-gray-500 font-bold mb-2">Account</h4>
          <button 
            className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;