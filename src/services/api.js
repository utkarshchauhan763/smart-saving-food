// API Service Layer for Smart Saving Food App
import { 
  mockAuthAPI, 
  mockMenuAPI, 
  mockPreferencesAPI, 
  mockNotificationsAPI, 
  mockAdminAPI, 
  mockAuthUtils 
} from './mockApi.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Check if we're in demo mode (GitHub Pages or no backend)
const isDemoMode = () => {
  // If there's a production API URL set, use real backend
  if (import.meta.env.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL.includes('railway.app')) {
    return false; // Use real backend
  }
  
  // Demo mode for GitHub Pages without backend
  return window.location.hostname.includes('github.io') && 
         !import.meta.env.VITE_API_BASE_URL;
};

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

// Enhanced API call with fallback to mock
const apiCall = async (apiFunction, mockFunction, ...args) => {
  if (isDemoMode()) {
    console.log('🎭 Demo Mode: Using mock data');
    return await mockFunction(...args);
  }
  
  try {
    return await apiFunction(...args);
  } catch (error) {
    console.warn('API call failed, falling back to mock data:', error.message);
    return await mockFunction(...args);
  }
};

// Authentication API
export const authAPI = {
  // Register user
  register: async (userData) => {
    const realApiCall = async () => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return handleResponse(response);
    };
    
    return await apiCall(realApiCall, mockAuthAPI.register, userData);
  },

  // Login user
  login: async (credentials) => {
    const realApiCall = async () => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      return handleResponse(response);
    };
    
    return await apiCall(realApiCall, mockAuthAPI.login, credentials);
  },

  // Get current user profile
  getProfile: async () => {
    const realApiCall = async () => {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    };
    
    return await apiCall(realApiCall, mockAuthAPI.getProfile);
  }
};

// Menu API
export const menuAPI = {
  // Get today's menu
  getTodayMenu: async () => {
    const realApiCall = async () => {
      const response = await fetch(`${API_BASE_URL}/menu/today`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    };
    return await apiCall(realApiCall, mockMenuAPI.getTodayMenu);
  },

  // Get menu by date
  getMenuByDate: async (date) => {
    const realApiCall = async () => {
      const response = await fetch(`${API_BASE_URL}/menu/date/${date}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    };
    return await apiCall(realApiCall, mockMenuAPI.getMenuByDate, date);
  },

  // Create/Update menu (Admin only)
  createMenu: async (menuData) => {
    const realApiCall = async () => {
      const response = await fetch(`${API_BASE_URL}/menu`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(menuData),
      });
      return handleResponse(response);
    };
    return await apiCall(realApiCall, mockMenuAPI.createMenu, menuData);
  },

  // Update menu (Admin only)
  updateMenu: async (id, menuData) => {
    const realApiCall = async () => {
      const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(menuData),
      });
      return handleResponse(response);
    };
    return await apiCall(realApiCall, mockMenuAPI.updateMenu, id, menuData);
  },

  // Delete menu (Admin only)
  deleteMenu: async (id) => {
    const realApiCall = async () => {
      const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    };
    return await apiCall(realApiCall, mockMenuAPI.deleteMenu, id);
  }
};

// Preferences API
export const preferencesAPI = isDemoMode() ? mockPreferencesAPI : {
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
export const notificationsAPI = isDemoMode() ? mockNotificationsAPI : {
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
export const adminAPI = isDemoMode() ? mockAdminAPI : {
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
export const authUtils = isDemoMode() ? mockAuthUtils : {
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
