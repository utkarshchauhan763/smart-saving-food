import React, { useState, useEffect } from 'react';
import { adminAPI, menuAPI, notificationsAPI, authUtils } from './services/api';

const AdminPage = () => {
  // State for dashboard data from backend
  const [todayStats, setTodayStats] = useState({
    totalStudents: 150,
    registeredForBreakfast: 120,
    registeredForLunch: 140,
    registeredForSnacks: 85,
    registeredForDinner: 135,
    totalFoodWastage: '12%',
    estimatedSavings: '₹2,500'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    type: 'announcement'
  });

  // Load data on component mount
  useEffect(() => {
    const user = authUtils.getCurrentUser();
    setCurrentUser(user);
    
    if (user && user.role === 'admin') {
      console.log('Admin user loaded:', user);
    } else {
      setError('Access denied. Admin privileges required.');
    }
  }, []);

  // Send notification to all students
  const sendNotification = async () => {
    if (!notificationForm.title || !notificationForm.message) {
      setError('Please fill in both title and message.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await notificationsAPI.sendNotification({
        title: notificationForm.title,
        message: notificationForm.message,
        type: notificationForm.type
      });

      if (response.success) {
        setSuccess(`📢 Notification sent to all students successfully!`);
        setNotificationForm({ title: '', message: '', type: 'announcement' });
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to send notification: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading admin panel...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Success State */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {success}
        </div>
      )}

      {/* Check if user is admin */}
      {!currentUser || currentUser.role !== 'admin' ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded text-center">
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p>You need admin privileges to access this page.</p>
        </div>
      ) : (
        <div>
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h2>
            <p className="text-gray-600">Manage menus and monitor food consumption</p>
            {currentUser && (
              <p className="text-sm text-blue-600 mt-2">
                Welcome, {currentUser.name}! (Admin)
              </p>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
            {['dashboard', 'menu-management', 'notifications', 'reports'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab === 'dashboard' && '📊 Dashboard'}
                {tab === 'menu-management' && '🍽️ Menu Management'}
                {tab === 'notifications' && '🔔 Notifications'}
                {tab === 'reports' && '📈 Reports'}
              </button>
            ))}
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-100 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Total Students</h3>
                <p className="text-3xl font-bold text-blue-600">{todayStats.totalStudents}</p>
              </div>
              <div className="bg-green-100 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Today's Registrations</h3>
                <p className="text-3xl font-bold text-green-600">
                  {todayStats.registeredForBreakfast + todayStats.registeredForLunch + 
                   todayStats.registeredForSnacks + todayStats.registeredForDinner}
                </p>
              </div>
              <div className="bg-yellow-100 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Food Wastage</h3>
                <p className="text-3xl font-bold text-yellow-600">{todayStats.totalFoodWastage}</p>
              </div>
              <div className="bg-purple-100 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">Estimated Savings</h3>
                <p className="text-3xl font-bold text-purple-600">{todayStats.estimatedSavings}</p>
              </div>
            </div>
          )}

          {/* Menu Management Tab */}
          {activeTab === 'menu-management' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Menu Management</h3>
              <p className="text-gray-600 mb-4">Manage today's menu items and availability</p>
              
              <div className="text-center py-8 text-gray-500">
                <p>Menu management features will be implemented here.</p>
                <p className="text-sm mt-2">This will allow admins to add, edit, and remove menu items.</p>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Send Notification</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={notificationForm.title}
                    onChange={(e) => setNotificationForm({...notificationForm, title: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Enter notification title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={notificationForm.message}
                    onChange={(e) => setNotificationForm({...notificationForm, message: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 h-32"
                    placeholder="Enter notification message"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={notificationForm.type}
                    onChange={(e) => setNotificationForm({...notificationForm, type: e.target.value})}
                    className="border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="announcement">Announcement</option>
                    <option value="menu">Menu Update</option>
                    <option value="timing">Timing Change</option>
                    <option value="important">Important</option>
                  </select>
                </div>
                <button
                  onClick={sendNotification}
                  disabled={loading}
                  className={`w-full py-2 rounded-md font-semibold transition ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                >
                  {loading ? 'Sending...' : 'Send Notification to All Students'}
                </button>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Reports & Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Food Waste Report</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>This Week</span>
                      <span className="text-red-600 font-semibold">12%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>This Month</span>
                      <span className="text-yellow-600 font-semibold">15%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Target</span>
                      <span className="text-green-600 font-semibold">&lt;10%</span>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Cost Savings</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>This Week</span>
                      <span className="text-green-600 font-semibold">₹15,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>This Month</span>
                      <span className="text-green-600 font-semibold">₹65,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total Saved</span>
                      <span className="text-green-600 font-semibold">₹1,25,000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
