import React, { useState, useEffect } from 'react';
import { adminAPI, menuAPI, notificationsAPI, authUtils } from './services/api';

const AdminPage = () => {
  // State for dashboard data from backend
  const [todayStats, setTodayStats] = useState({
    totalStudents: 0,
    registeredForBreakfast: 0,
    registeredForLunch: 0,
    registeredForSnacks: 0,
    registeredForDinner: 0,
    totalFoodWastage: '0%',
    estimatedSavings: '₹0'
  });

  const [menuData, setMenuData] = useState({
    breakfast: [],
    lunch: [],
    snacks: [],
    dinner: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMealForEdit, setSelectedMealForEdit] = useState('breakfast');
  const [newItem, setNewItem] = useState({ name: '', type: 'solid', unit: 'pieces' });
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
      loadDashboardData();
      loadMenuData();
    } else {
      setError('Access denied. Admin privileges required.');
    }
  }, []);

  // Load dashboard statistics
  const loadDashboardData = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      if (response.success) {
        setTodayStats(response.stats);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      // Use default data if API fails
      setTodayStats({
        totalStudents: 150,
        registeredForBreakfast: 120,
        registeredForLunch: 140,
        registeredForSnacks: 85,
        registeredForDinner: 135,
        totalFoodWastage: '12%',
        estimatedSavings: '₹2,500'
      });
    }
  };

  // Load menu data for admin management
  const loadMenuData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllMenus();
      
      if (response.success && response.menus) {
        // Process menu data for admin view
        const processedMenu = {
          breakfast: [],
          lunch: [],
          snacks: [],
          dinner: []
        };

        response.menus.forEach(menu => {
          if (menu.meals) {
            Object.keys(menu.meals).forEach(mealType => {
              if (processedMenu[mealType]) {
                processedMenu[mealType] = menu.meals[mealType];
              }
            });
          }
        });

        setMenuData(processedMenu);
      } else {
        // Use default menu data if no data from backend
        setMenuData({
          breakfast: [
            { id: 1, name: 'Chapati', type: 'solid', unit: 'pieces', totalRequired: 240, available: 300 },
            { id: 2, name: 'Aloo Sabzi', type: 'liquid', unit: 'bowls', totalRequired: 180, available: 200 },
            { id: 3, name: 'Tea', type: 'liquid', unit: 'cups', totalRequired: 150, available: 180 },
            { id: 4, name: 'Butter', type: 'solid', unit: 'pieces', totalRequired: 120, available: 150 }
          ],
          lunch: [
            { id: 5, name: 'Rice', type: 'liquid', unit: 'bowls', totalRequired: 280, available: 320 },
            { id: 6, name: 'Dal', type: 'liquid', unit: 'bowls', totalRequired: 220, available: 250 },
            { id: 7, name: 'Chapati', type: 'solid', unit: 'pieces', totalRequired: 350, available: 400 },
            { id: 8, name: 'Mixed Vegetable', type: 'liquid', unit: 'bowls', totalRequired: 180, available: 200 }
          ],
          snacks: [
            { id: 10, name: 'Samosa', type: 'solid', unit: 'pieces', totalRequired: 170, available: 200 },
            { id: 11, name: 'Green Chutney', type: 'liquid', unit: 'bowls', totalRequired: 85, available: 100 },
            { id: 12, name: 'Tea', type: 'liquid', unit: 'cups', totalRequired: 100, available: 120 }
          ],
          dinner: [
            { id: 13, name: 'Chapati', type: 'solid', unit: 'pieces', totalRequired: 320, available: 380 },
            { id: 14, name: 'Dal', type: 'liquid', unit: 'bowls', totalRequired: 200, available: 230 },
            { id: 15, name: 'Paneer Curry', type: 'liquid', unit: 'bowls', totalRequired: 180, available: 200 },
            { id: 16, name: 'Rice', type: 'liquid', unit: 'bowls', totalRequired: 250, available: 280 }
          ]
        });
      }
    } catch (err) {
      setError('Failed to load menu data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add new menu item
  const addMenuItem = () => {
    if (newItem.name) {
      const newId = Math.max(...menuData[selectedMealForEdit].map(item => item.id)) + 1;
      setMenuData(prev => ({
        ...prev,
        [selectedMealForEdit]: [
          ...prev[selectedMealForEdit],
          {
            id: newId,
            ...newItem,
            totalRequired: 0,
            available: 0
          }
        ]
      }));
      setNewItem({ name: '', type: 'solid', unit: 'pieces' });
    }
  };

  // Remove menu item
  const removeMenuItem = (mealType, itemId) => {
    setMenuData(prev => ({
      ...prev,
      [mealType]: prev[mealType].filter(item => item.id !== itemId)
    }));
  };

  // Update menu item quantities
  const updateItemQuantity = (mealType, itemId, field, value) => {
    setMenuData(prev => ({
      ...prev,
      [mealType]: prev[mealType].map(item =>
        item.id === itemId ? { ...item, [field]: parseInt(value) || 0 } : item
      )
    }));
  };

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

  const mealIcons = {
    breakfast: '🍳',
    lunch: '🍽️',
    snacks: '🍪',
    dinner: '🌙'
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
        <>
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
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Students</h3>
              <p className="text-3xl font-bold text-blue-600">{todayStats.totalStudents}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Food Wastage</h3>
              <p className="text-3xl font-bold text-red-600">{todayStats.totalFoodWastage}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Estimated Savings</h3>
              <p className="text-3xl font-bold text-green-600">{todayStats.estimatedSavings}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Registrations</h3>
              <p className="text-3xl font-bold text-purple-600">
                {todayStats.registeredForBreakfast + todayStats.registeredForLunch + 
                 todayStats.registeredForSnacks + todayStats.registeredForDinner}
              </p>
            </div>
          </div>

          {/* Meal Registration Summary */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Today's Meal Registrations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl mb-2">🍳</div>
                <h4 className="font-semibold text-gray-800">Breakfast</h4>
                <p className="text-2xl font-bold text-orange-600">{todayStats.registeredForBreakfast}</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl mb-2">🍽️</div>
                <h4 className="font-semibold text-gray-800">Lunch</h4>
                <p className="text-2xl font-bold text-blue-600">{todayStats.registeredForLunch}</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl mb-2">🍪</div>
                <h4 className="font-semibold text-gray-800">Snacks</h4>
                <p className="text-2xl font-bold text-yellow-600">{todayStats.registeredForSnacks}</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl mb-2">🌙</div>
                <h4 className="font-semibold text-gray-800">Dinner</h4>
                <p className="text-2xl font-bold text-purple-600">{todayStats.registeredForDinner}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Menu Management Tab */}
      {activeTab === 'menu-management' && (
        <div className="space-y-6">
          {/* Meal Selection for Editing */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Select Meal to Edit</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.keys(menuData).map((meal) => (
                <button
                  key={meal}
                  onClick={() => setSelectedMealForEdit(meal)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    selectedMealForEdit === meal
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {mealIcons[meal]} {meal.charAt(0).toUpperCase() + meal.slice(1)}
                </button>
              ))}
            </div>

            {/* Add New Item Form */}
            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-800 mb-3">Add New Item to {selectedMealForEdit}</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                  type="text"
                  placeholder="Item name"
                  value={newItem.name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <select
                  value={newItem.type}
                  onChange={(e) => setNewItem(prev => ({ ...prev, type: e.target.value }))}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="solid">Solid</option>
                  <option value="liquid">Liquid</option>
                </select>
                <input
                  type="text"
                  placeholder="Unit (pieces, bowls, etc.)"
                  value={newItem.unit}
                  onChange={(e) => setNewItem(prev => ({ ...prev, unit: e.target.value }))}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={addMenuItem}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold transition-colors"
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>

          {/* Menu Items Management */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {mealIcons[selectedMealForEdit]} {selectedMealForEdit.charAt(0).toUpperCase() + selectedMealForEdit.slice(1)} Menu Items
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Item Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Unit</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Required</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Available</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menuData[selectedMealForEdit].map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{item.name}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.type === 'solid' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {item.type === 'solid' ? '🥖 Solid' : '🥣 Liquid'}
                        </span>
                      </td>
                      <td className="py-3 px-4">{item.unit}</td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          value={item.totalRequired}
                          onChange={(e) => updateItemQuantity(selectedMealForEdit, item.id, 'totalRequired', e.target.value)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          value={item.available}
                          onChange={(e) => updateItemQuantity(selectedMealForEdit, item.id, 'available', e.target.value)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </td>
                      <td className="py-3 px-4">
                        {item.available >= item.totalRequired ? (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            ✅ Sufficient
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                            ⚠️ Shortage
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => removeMenuItem(selectedMealForEdit, item.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          {/* Send Notification Form */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">📢 Send Notification to All Students</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notification Title
                </label>
                <input
                  type="text"
                  value={notificationForm.title}
                  onChange={(e) => setNotificationForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Menu Updated, Timing Changed, etc."
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notification Type
                </label>
                <select
                  value={notificationForm.type}
                  onChange={(e) => setNotificationForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="announcement">📢 General Announcement</option>
                  <option value="menu">🍽️ Menu Update</option>
                  <option value="timing">⏰ Timing Change</option>
                  <option value="achievement">🏆 Achievement/Milestone</option>
                  <option value="urgent">🚨 Urgent Notice</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={notificationForm.message}
                  onChange={(e) => setNotificationForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Enter your notification message here..."
                  rows="4"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <button
                onClick={sendNotification}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                🔔 Send Notification to All Students
              </button>
            </div>
          </div>

          {/* Quick Notification Templates */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">⚡ Quick Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setNotificationForm({
                  title: "Menu Updated",
                  message: "Today's menu has been updated. Please check the new items and submit your preferences.",
                  type: "menu"
                })}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 text-left transition-colors"
              >
                <h4 className="font-semibold text-gray-800">🍽️ Menu Update</h4>
                <p className="text-sm text-gray-600">Notify about menu changes</p>
              </button>
              
              <button
                onClick={() => setNotificationForm({
                  title: "Timing Changed",
                  message: "Meal timing has been updated. Please check the new schedule.",
                  type: "timing"
                })}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 text-left transition-colors"
              >
                <h4 className="font-semibold text-gray-800">⏰ Timing Update</h4>
                <p className="text-sm text-gray-600">Notify about schedule changes</p>
              </button>
              
              <button
                onClick={() => setNotificationForm({
                  title: "Achievement Unlocked",
                  message: "Congratulations! Food wastage reduced by 30% this week. Great teamwork!",
                  type: "achievement"
                })}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 text-left transition-colors"
              >
                <h4 className="font-semibold text-gray-800">🏆 Achievement</h4>
                <p className="text-sm text-gray-600">Celebrate milestones</p>
              </button>
              
              <button
                onClick={() => setNotificationForm({
                  title: "Urgent Notice",
                  message: "Important: Please submit your meal preferences by 6 PM today.",
                  type: "urgent"
                })}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 text-left transition-colors"
              >
                <h4 className="font-semibold text-gray-800">🚨 Urgent Notice</h4>
                <p className="text-sm text-gray-600">Send urgent updates</p>
              </button>
            </div>
          </div>

          {/* Notification History */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">📋 Recent Notifications Sent</h3>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-800">🍽️ Lunch Menu Updated</h4>
                    <p className="text-sm text-gray-600">Added Paneer Butter Masala to today's lunch menu.</p>
                  </div>
                  <span className="text-xs text-gray-500">2 min ago</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-800">⏰ Dinner Time Extended</h4>
                    <p className="text-sm text-gray-600">Dinner time extended until 9:30 PM today.</p>
                  </div>
                  <span className="text-xs text-gray-500">15 min ago</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-800">🏆 Weekly Achievement</h4>
                    <p className="text-sm text-gray-600">Food wastage reduced by 25% this week!</p>
                  </div>
                  <span className="text-xs text-gray-500">3 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">📈 Food Wastage Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Weekly Trends</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Monday</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Tuesday</span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">15%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Wednesday</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">10%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Thursday</span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">20%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Today</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">12%</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Cost Savings</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>This Week</span>
                    <span className="text-green-600 font-semibold">₹12,500</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>This Month</span>
                    <span className="text-green-600 font-semibold">₹45,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Saved</span>
                    <span className="text-green-600 font-semibold">₹1,25,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPage;
