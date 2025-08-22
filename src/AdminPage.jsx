import React, { useState, useEffect } from 'react';
import { adminAPI, menuAPI, notificationsAPI, authUtils } from './services/api';

const AdminPage = () => {
  // State for dashboard data from backend
  const [dashboardData, setDashboardData] = useState(null);
  const [usersData, setUsersData] = useState([]);
  const [menusData, setMenusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [weeklyReport, setWeeklyReport] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [newMenuData, setNewMenuData] = useState({
    date: '',
    meals: {
      breakfast: { items: [], isAvailable: true },
      lunch: { items: [], isAvailable: true },
      snacks: { items: [], isAvailable: true },
      dinner: { items: [], isAvailable: true }
    }
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    type: 'announcement'
  });

  // Load dashboard data from backend
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching dashboard data...');
      const response = await adminAPI.getDashboard();
      
      if (response.success) {
        setDashboardData(response.data);
        console.log('Dashboard data loaded:', response.data);
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (err) {
      console.error('Dashboard data error:', err);
      setError('Error loading dashboard data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    const user = authUtils.getCurrentUser();
    setCurrentUser(user);
    
    if (user && user.role === 'admin') {
      console.log('Admin user loaded:', user);
      loadDashboardData();
    } else {
      setError('Access denied. Admin privileges required.');
      setLoading(false);
    }
  }, []);

  // Load users data from backend
  const loadUsersData = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching users data...');
      const response = await adminAPI.getAllUsers();
      
      if (response.success) {
        setUsersData(response.users || []);
        console.log('Users data loaded:', response.users);
      } else {
        setError('Failed to load users data');
      }
    } catch (err) {
      console.error('Users data error:', err);
      setError('Error loading users data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load menus data from backend
  const loadMenusData = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching menus data...');
      const response = await adminAPI.getAllMenus(1, 20);
      
      if (response.success) {
        setMenusData(response.menus || []);
        console.log('Menus data loaded:', response.menus);
      } else {
        setError('Failed to load menus data');
      }
    } catch (err) {
      console.error('Menus data error:', err);
      setError('Error loading menus data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete user function
  const handleDeleteUser = async (userId, userName) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await adminAPI.deleteUser(userId);
      
      if (response.success) {
        setSuccess(`User "${userName}" deleted successfully!`);
        // Remove user from local state
        setUsersData(usersData.filter(user => user._id !== userId));
        setShowDeleteConfirm(null);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to delete user: ' + response.message);
      }
    } catch (err) {
      setError('Error deleting user: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create new menu function
  const handleCreateMenu = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await adminAPI.createMenu(newMenuData);
      
      if (response.success) {
        setSuccess('Menu created successfully!');
        setShowMenuForm(false);
        setNewMenuData({
          date: '',
          meals: {
            breakfast: { items: [], isAvailable: true },
            lunch: { items: [], isAvailable: true },
            snacks: { items: [], isAvailable: true },
            dinner: { items: [], isAvailable: true }
          }
        });
        loadMenusData(); // Reload menus
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to create menu: ' + response.message);
      }
    } catch (err) {
      setError('Error creating menu: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete menu function
  const handleDeleteMenu = async (menuId, menuDate) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await adminAPI.deleteMenu(menuId);
      
      if (response.success) {
        setSuccess(`Menu for ${menuDate} deleted successfully!`);
        // Remove menu from local state
        setMenusData(menusData.filter(menu => menu._id !== menuId));
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to delete menu: ' + response.message);
      }
    } catch (err) {
      setError('Error deleting menu: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load weekly report data
  const loadWeeklyReport = async () => {
    try {
      const response = await adminAPI.getWeeklyReport();
      if (response.success) {
        setWeeklyReport(response.data);
      }
    } catch (err) {
      console.error('Weekly report error:', err);
    }
  };
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
            {['dashboard', 'users', 'menu-management', 'notifications', 'reports'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  if (tab === 'users' && usersData.length === 0) {
                    loadUsersData();
                  }
                  if (tab === 'menu-management' && menusData.length === 0) {
                    loadMenusData();
                  }
                }}
                className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab === 'dashboard' && '📊 Dashboard'}
                {tab === 'users' && '👥 Users'}
                {tab === 'menu-management' && '🍽️ Menu Management'}
                {tab === 'notifications' && '🔔 Notifications'}
                {tab === 'reports' && '📈 Reports'}
              </button>
            ))}
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div>
              {dashboardData ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-blue-100 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-blue-800 mb-2">Total Students</h3>
                      <p className="text-3xl font-bold text-blue-600">{dashboardData.users.totalStudents}</p>
                      <p className="text-sm text-blue-600 mt-1">Active students in system</p>
                    </div>
                    <div className="bg-green-100 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-green-800 mb-2">Today's Registrations</h3>
                      <p className="text-3xl font-bold text-green-600">{dashboardData.todayRegistrations.total}</p>
                      <p className="text-sm text-green-600 mt-1">Total meal registrations</p>
                    </div>
                    <div className="bg-yellow-100 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-yellow-800 mb-2">Food Wastage</h3>
                      <p className="text-3xl font-bold text-yellow-600">{dashboardData.metrics.foodWastagePercentage}%</p>
                      <p className="text-sm text-yellow-600 mt-1">Estimated wastage today</p>
                    </div>
                    <div className="bg-purple-100 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-purple-800 mb-2">Estimated Savings</h3>
                      <p className="text-3xl font-bold text-purple-600">{dashboardData.metrics.estimatedSavings}</p>
                      <p className="text-sm text-purple-600 mt-1">Cost saved today</p>
                    </div>
                  </div>

                  {/* Detailed Meal Registration Stats */}
                  <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h3 className="text-xl font-bold mb-4">Today's Meal Registrations</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <h4 className="font-semibold text-orange-800">🌅 Breakfast</h4>
                        <p className="text-2xl font-bold text-orange-600">{dashboardData.todayRegistrations.breakfast}</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <h4 className="font-semibold text-green-800">🍽️ Lunch</h4>
                        <p className="text-2xl font-bold text-green-600">{dashboardData.todayRegistrations.lunch}</p>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <h4 className="font-semibold text-yellow-800">🥪 Snacks</h4>
                        <p className="text-2xl font-bold text-yellow-600">{dashboardData.todayRegistrations.snacks}</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-800">🌙 Dinner</h4>
                        <p className="text-2xl font-bold text-blue-600">{dashboardData.todayRegistrations.dinner}</p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h4 className="font-semibold mb-2">📊 System Stats</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Total Users:</span>
                          <span className="font-semibold">{dashboardData.users.totalUsers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Admins:</span>
                          <span className="font-semibold">{dashboardData.users.totalAdmins}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Registration Rate:</span>
                          <span className="font-semibold">{dashboardData.metrics.registrationRate}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h4 className="font-semibold mb-2">🔔 Recent Activity</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Recent Notifications:</span>
                          <span className="font-semibold">{dashboardData.metrics.recentNotifications}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Today's Registrations:</span>
                          <span className="font-semibold text-green-600">{dashboardData.todayRegistrations.total}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h4 className="font-semibold mb-2">💰 Performance</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Wastage Rate:</span>
                          <span className={`font-semibold ${dashboardData.metrics.foodWastagePercentage < 10 ? 'text-green-600' : 'text-yellow-600'}`}>
                            {dashboardData.metrics.foodWastagePercentage}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Daily Savings:</span>
                          <span className="font-semibold text-green-600">{dashboardData.metrics.estimatedSavings}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading dashboard data...</p>
                </div>
              )}
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">👥 Users Management</h3>
                <button 
                  onClick={loadUsersData}
                  disabled={loading}
                  className={`px-4 py-2 rounded-md font-semibold transition ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                >
                  {loading ? '🔄 Loading...' : '🔄 Refresh Users'}
                </button>
              </div>

              {usersData.length === 0 && !loading ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No users found. Click "Refresh Users" to load data.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Users Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <h4 className="font-semibold text-blue-800">Total Users</h4>
                      <p className="text-2xl font-bold text-blue-600">{usersData.length}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <h4 className="font-semibold text-green-800">Students</h4>
                      <p className="text-2xl font-bold text-green-600">
                        {usersData.filter(user => user.role === 'student').length}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <h4 className="font-semibold text-purple-800">Admins</h4>
                      <p className="text-2xl font-bold text-purple-600">
                        {usersData.filter(user => user.role === 'admin').length}
                      </p>
                    </div>
                  </div>

                  {/* Users Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Name</th>
                          <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Email</th>
                          <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Role</th>
                          <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Student ID</th>
                          <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Hostel Room</th>
                          <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Status</th>
                          <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Joined</th>
                          <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usersData.map((user, index) => (
                          <tr key={user._id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="border border-gray-200 px-4 py-3">
                              <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full mr-2 ${user.isActive !== false ? 'bg-green-400' : 'bg-red-400'}`}></div>
                                <span className="font-medium">{user.name}</span>
                              </div>
                            </td>
                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">{user.email}</td>
                            <td className="border border-gray-200 px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                user.role === 'admin' 
                                  ? 'bg-purple-100 text-purple-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {user.role === 'admin' ? '👑 Admin' : '🎓 Student'}
                              </span>
                            </td>
                            <td className="border border-gray-200 px-4 py-3 text-sm">
                              {user.studentId || '-'}
                            </td>
                            <td className="border border-gray-200 px-4 py-3 text-sm">
                              {user.hostelRoom || '-'}
                            </td>
                            <td className="border border-gray-200 px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                user.isActive !== false 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {user.isActive !== false ? '✅ Active' : '❌ Inactive'}
                              </span>
                            </td>
                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                            </td>
                            <td className="border border-gray-200 px-4 py-3">
                              {user._id !== currentUser?.id ? (
                                <button
                                  onClick={() => setShowDeleteConfirm({ id: user._id, name: user.name })}
                                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold transition"
                                  title="Delete User"
                                >
                                  🗑️ Delete
                                </button>
                              ) : (
                                <span className="text-gray-400 text-xs">Current User</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Users Actions */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">📊 User Statistics</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Active Users:</span>
                        <span className="ml-2 font-semibold text-green-600">
                          {usersData.filter(user => user.isActive !== false).length}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Inactive Users:</span>
                        <span className="ml-2 font-semibold text-red-600">
                          {usersData.filter(user => user.isActive === false).length}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Recent Signups:</span>
                        <span className="ml-2 font-semibold text-blue-600">
                          {usersData.filter(user => {
                            const joinDate = new Date(user.createdAt);
                            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                            return joinDate > weekAgo;
                          }).length}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">With Hostel Info:</span>
                        <span className="ml-2 font-semibold text-purple-600">
                          {usersData.filter(user => user.hostelRoom).length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Delete Confirmation Dialog */}
              {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                    <h3 className="text-lg font-bold text-red-600 mb-4">⚠️ Confirm Deletion</h3>
                    <p className="text-gray-700 mb-6">
                      Are you sure you want to delete user <strong>"{showDeleteConfirm.name}"</strong>? 
                      This action cannot be undone and will also delete all their meal preferences.
                    </p>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setShowDeleteConfirm(null)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDeleteUser(showDeleteConfirm.id, showDeleteConfirm.name)}
                        disabled={loading}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition disabled:opacity-50"
                      >
                        {loading ? 'Deleting...' : 'Delete User'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Menu Management Tab */}
          {activeTab === 'menu-management' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">🍽️ Menu Management</h3>
                <div className="space-x-3">
                  <button 
                    onClick={loadMenusData}
                    disabled={loading}
                    className={`px-4 py-2 rounded-md font-semibold transition ${
                      loading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    } text-white`}
                  >
                    {loading ? '🔄 Loading...' : '🔄 Refresh Menus'}
                  </button>
                  <button 
                    onClick={() => setShowMenuForm(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold transition"
                  >
                    ➕ Create New Menu
                  </button>
                </div>
              </div>

              {/* Menus List */}
              {menusData.length === 0 && !loading ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No menus found. Click "Refresh Menus" to load data or "Create New Menu" to add one.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {menusData.map((menu, index) => (
                    <div key={menu._id || index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">
                            📅 {new Date(menu.date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Created by: {menu.createdBy?.name || 'System'} 
                            {menu.updatedBy && ` • Updated by: ${menu.updatedBy.name}`}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteMenu(menu._id, new Date(menu.date).toLocaleDateString())}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold transition"
                          title="Delete Menu"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                      
                      {/* Meals Summary */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(menu.meals).map(([mealType, mealData]) => (
                          <div key={mealType} className="bg-gray-50 p-3 rounded">
                            <h5 className="font-semibold capitalize text-sm mb-1">
                              {mealType === 'breakfast' && '🌅'} 
                              {mealType === 'lunch' && '🍽️'} 
                              {mealType === 'snacks' && '🥪'} 
                              {mealType === 'dinner' && '🌙'} 
                              {mealType}
                            </h5>
                            <p className="text-xs text-gray-600">
                              {mealData.items?.length || 0} items
                            </p>
                            <p className={`text-xs font-semibold ${mealData.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                              {mealData.isAvailable ? '✅ Available' : '❌ Unavailable'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Create Menu Form Modal */}
              {showMenuForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <h3 className="text-lg font-bold mb-4">➕ Create New Menu</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                        <input
                          type="date"
                          value={newMenuData.date}
                          onChange={(e) => setNewMenuData({...newMenuData, date: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      </div>

                      <div className="text-center py-4 text-gray-500">
                        <p>📝 Basic menu creation form</p>
                        <p className="text-sm">Advanced meal items configuration will be added here.</p>
                        <p className="text-sm mt-2">For now, this creates a default menu structure.</p>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        onClick={() => setShowMenuForm(false)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreateMenu}
                        disabled={loading || !newMenuData.date}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition disabled:opacity-50"
                      >
                        {loading ? 'Creating...' : 'Create Menu'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
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
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Reports & Analytics</h3>
                <button 
                  onClick={loadWeeklyReport}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  🔄 Refresh Reports
                </button>
              </div>
              
              {weeklyReport ? (
                <div className="space-y-6">
                  {/* Weekly Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">📊 Weekly Summary</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Average Daily Registrations</p>
                        <p className="text-2xl font-bold text-blue-600">{weeklyReport.summary.averageRegistrations}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Average Wastage</p>
                        <p className="text-2xl font-bold text-yellow-600">{weeklyReport.summary.averageWastage}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Days Tracked</p>
                        <p className="text-2xl font-bold text-green-600">{weeklyReport.summary.totalDays}</p>
                      </div>
                    </div>
                  </div>

                  {/* Daily Breakdown */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold mb-4">📈 Daily Registration Trends</h4>
                      <div className="space-y-3">
                        {weeklyReport.dailyStats.slice(-5).map((day, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="text-sm">{new Date(day.date).toLocaleDateString()}</span>
                            <div className="flex items-center space-x-4">
                              <span className="text-green-600 font-semibold">{day.totalRegistrations} registrations</span>
                              <span className={`text-sm ${day.estimatedWastage < 10 ? 'text-green-600' : 'text-yellow-600'}`}>
                                {day.estimatedWastage}% waste
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold mb-4">🎯 Performance Metrics</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span>Best Day (Least Waste)</span>
                          <span className="text-green-600 font-semibold">
                            {Math.min(...weeklyReport.dailyStats.map(d => d.estimatedWastage)).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Highest Registrations</span>
                          <span className="text-blue-600 font-semibold">
                            {Math.max(...weeklyReport.dailyStats.map(d => d.totalRegistrations))}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Week Target</span>
                          <span className="text-purple-600 font-semibold">&lt;10% waste</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Status</span>
                          <span className={`font-semibold ${weeklyReport.summary.averageWastage < 10 ? 'text-green-600' : 'text-yellow-600'}`}>
                            {weeklyReport.summary.averageWastage < 10 ? '✅ Target Met' : '⚠️ Needs Improvement'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : dashboardData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">📊 Current Performance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Today's Wastage</span>
                        <span className={`font-semibold ${dashboardData.metrics.foodWastagePercentage < 10 ? 'text-green-600' : 'text-yellow-600'}`}>
                          {dashboardData.metrics.foodWastagePercentage}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Registration Rate</span>
                        <span className="text-blue-600 font-semibold">{dashboardData.metrics.registrationRate}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Target</span>
                        <span className="text-green-600 font-semibold">&lt;10% waste</span>
                      </div>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">💰 Cost Impact</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Today's Savings</span>
                        <span className="text-green-600 font-semibold">{dashboardData.metrics.estimatedSavings}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Active Students</span>
                        <span className="text-blue-600 font-semibold">{dashboardData.users.totalStudents}</span>
                      </div>
                      <div className="text-center mt-4 p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-700">Click "Refresh Reports" to load detailed weekly analytics</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Loading reports data...</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
