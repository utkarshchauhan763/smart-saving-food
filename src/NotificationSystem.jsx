import React, { useState, useEffect } from 'react';
import { notificationsAPI, authUtils } from './services/api';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);

  // Load notifications on component mount
  useEffect(() => {
    const user = authUtils.getCurrentUser();
    setCurrentUser(user);
    
    if (user) {
      loadNotifications();
    }
  }, []);

  // Calculate unread notifications count
  useEffect(() => {
    const unread = notifications.filter(notif => !notif.isRead).length;
    setUnreadCount(unread);
  }, [notifications]);

  // Load user notifications from backend
  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationsAPI.getUserNotifications();
      
      if (response.success && response.notifications) {
        setNotifications(response.notifications);
      } else {
        // Use default notifications if none from backend
        setNotifications([
          {
            id: 1,
            title: "Welcome to Smart Saving Food!",
            message: "Start by setting your meal preferences to help reduce food waste.",
            time: new Date().toISOString(),
            type: "announcement",
            isRead: false
          },
          {
            id: 2,
            title: "Menu Available",
            message: "Today's menu is now available. Check it out and set your preferences!",
            time: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
            type: "menu",
            isRead: false
          }
        ]);
      }
    } catch (err) {
      setError('Failed to load notifications');
      console.error('Notification loading error:', err);
      
      // Use default notifications on error
      setNotifications([
        {
          id: 1,
          title: "Welcome!",
          message: "Welcome to Smart Saving Food App!",
          time: new Date().toISOString(),
          type: "announcement",
          isRead: false
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const response = await notificationsAPI.markAsRead(notificationId);
      
      if (response.success) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, isRead: true }
              : notif
          )
        );
      }
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
      // Still update UI optimistically
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, isRead: true }
            : notif
        )
      );
    }
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  // Delete notification
  const deleteNotification = (notificationId) => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'menu': return '🍽️';
      case 'timing': return '⏰';
      case 'achievement': return '🏆';
      default: return '📢';
    }
  };

  // Add new notification (for demo purposes)
  const addSampleNotification = () => {
    const sampleNotifications = [
      {
        title: "Breakfast Menu Updated",
        message: "Added fresh fruit salad to today's breakfast menu.",
        type: "menu"
      },
      {
        title: "Special Announcement",
        message: "Tomorrow is National Food Day! Special menu planned.",
        type: "announcement"
      },
      {
        title: "Timing Update",
        message: "Snacks time extended by 30 minutes today.",
        type: "timing"
      }
    ];

    const randomNotif = sampleNotifications[Math.floor(Math.random() * sampleNotifications.length)];
    const newNotification = {
      id: Date.now(),
      title: randomNotif.title,
      message: randomNotif.message,
      time: "Just now",
      type: randomNotif.type,
      isRead: false
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  return (
    <div className="relative">
      {/* Notification Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:bg-blue-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
          />
        </svg>
        
        {/* Notification Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-4xl mb-2">🔔</div>
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                        <h4 className={`font-semibold ${!notification.isRead ? 'text-blue-800' : 'text-gray-800'}`}>
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                      <p className="text-gray-400 text-xs">{notification.time}</p>
                    </div>
                    <div className="flex gap-1 ml-2">
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 rounded hover:bg-blue-100"
                          title="Mark as read"
                        >
                          ✓
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-red-600 hover:text-red-800 text-xs px-2 py-1 rounded hover:bg-red-100"
                        title="Delete"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Demo Button */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={addSampleNotification}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
            >
              🔔 Simulate New Notification (Demo)
            </button>
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default NotificationSystem;
