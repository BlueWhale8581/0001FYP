// components/layout/NotificationPanel.jsx
import React from 'react';
import { X } from 'lucide-react';
import NotificationItem from '../notifications/NotificationItem';
import NotificationCounter from '../notifications/NotificationCounter';

const NotificationPanel = ({ 
  isOpen,
  onClose,
  notifications = []
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <div className="fixed inset-0 z-30 bg-black/50" onClick={onClose}>
      <div 
        className="fixed inset-y-0 right-0 w-64 bg-white shadow-lg transform z-40"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold flex items-center">
            Notifications
            {unreadCount > 0 && (
              <NotificationCounter count={unreadCount} />
            )}
          </h3>
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
                <NotificationItem
                  key={notification.id}
                  type={notification.type}
                  message={notification.message}
                  time={notification.time}
                  read={notification.read}
                />
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