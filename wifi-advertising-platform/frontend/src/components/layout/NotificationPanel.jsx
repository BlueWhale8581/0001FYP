// components/layout/NotificationPanel.jsx
import React from 'react';
import { X } from 'lucide-react';

const NotificationPanel = ({ 
  isOpen,
  onClose,
  notifications = []
}) => {
  if (!isOpen) return null;
  
  const getNotificationStyle = (type) => {
    switch (type) {
      case 'critical':
        return 'border-red-500 bg-red-50';
      case 'warning':
        return 'border-amber-500 bg-amber-50';
      case 'info':
        return 'border-blue-500 bg-blue-50';
      case 'success':
        return 'border-green-500 bg-green-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };
  
  return (
    <div className="fixed inset-0 z-30 bg-black/50" onClick={onClose}>
      <div 
        className="fixed inset-y-0 right-0 w-64 bg-white shadow-lg transform z-40"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">Notifications</h3>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No new notifications</p>
            </div>
          ) : (
            <>
              {notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-3 mb-3 rounded-lg border-l-4 ${
                    getNotificationStyle(notification.type)
                  } ${notification.read ? 'opacity-70' : ''}`}
                >
                  <p className="text-sm font-medium">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                </div>
              ))}
              
              <button className="w-full text-center text-sm text-blue-600 mt-2">
                View all notifications
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;