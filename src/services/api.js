// API Service Layer for Smart Saving Food App
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to create auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
};

// Authentication API
export const authAPI = {
  // Register user
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  // Login user
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  // Get current user profile
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }
};

// Menu API
export const menuAPI = {
  // Get today's menu
  getTodayMenu: async () => {
    const response = await fetch(`${API_BASE_URL}/menu/today`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Get menu by date
  getMenuByDate: async (date) => {
    const response = await fetch(`${API_BASE_URL}/menu/date/${date}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Create/Update menu (Admin only)
  createMenu: async (menuData) => {
    const response = await fetch(`${API_BASE_URL}/menu`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(menuData),
    });
    return handleResponse(response);
  },

  // Update menu (Admin only)
  updateMenu: async (id, menuData) => {
    const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(menuData),
    });
    return handleResponse(response);
  },

  // Delete menu (Admin only)
  deleteMenu: async (id) => {
    const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }
};

// Preferences API
export const preferencesAPI = {
  // Save meal preferences
  savePreferences: async (preferences) => {
    const response = await fetch(`${API_BASE_URL}/preferences`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(preferences),
    });
    return handleResponse(response);
  },

  // Get user's preferences
  getUserPreferences: async () => {
    const response = await fetch(`${API_BASE_URL}/preferences/user`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Get preferences by date
  getPreferencesByDate: async (date) => {
    const response = await fetch(`${API_BASE_URL}/preferences/date/${date}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }
};

// Notifications API
export const notificationsAPI = {
  // Get user notifications
  getUserNotifications: async () => {
    const response = await fetch(`${API_BASE_URL}/notifications/user`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Send notification (Admin only)
  sendNotification: async (notificationData) => {
    const response = await fetch(`${API_BASE_URL}/notifications/send`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(notificationData),
    });
    return handleResponse(response);
  }
};

// Admin API
export const adminAPI = {
  // Get dashboard stats
  getDashboard: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getDashboardStats: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Get weekly report
  getWeeklyReport: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/reports/weekly`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Get all users
  getAllUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Get all menus
  getAllMenus: async (page = 1, limit = 10, startDate = null, endDate = null) => {
    let url = `${API_BASE_URL}/admin/menus?page=${page}&limit=${limit}`;
    if (startDate && endDate) {
      url += `&startDate=${startDate}&endDate=${endDate}`;
    }
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Create new menu
  createMenu: async (menuData) => {
    const response = await fetch(`${API_BASE_URL}/admin/menus`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(menuData),
    });
    return handleResponse(response);
  },

  // Update menu
  updateMenu: async (menuId, menuData) => {
    const response = await fetch(`${API_BASE_URL}/admin/menus/${menuId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(menuData),
    });
    return handleResponse(response);
  },

  // Delete menu
  deleteMenu: async (menuId) => {
    const response = await fetch(`${API_BASE_URL}/admin/menus/${menuId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Get food waste reports
  getFoodWasteReport: async (startDate, endDate) => {
    const response = await fetch(`${API_BASE_URL}/admin/reports/food-waste?start=${startDate}&end=${endDate}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Get user preferences report
  getUserPreferencesReport: async (startDate, endDate) => {
    const response = await fetch(`${API_BASE_URL}/admin/reports/preferences?start=${startDate}&end=${endDate}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }
};

// Auth utility functions
export const authUtils = {
  // Store user data and token
  setAuthData: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is logged in
  isAuthenticated: () => {
    return !!getAuthToken();
  },

  // Check if user is admin
  isAdmin: () => {
    const user = authUtils.getCurrentUser();
    return user?.role === 'admin';
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};
