// Mock API for GitHub Pages demo
// This provides sample data when backend is not available

// Sample data
const sampleUsers = [
  {
    id: '1',
    name: 'John Student',
    email: 'john@example.com',
    role: 'student',
    hostelBlock: 'A',
    roomNumber: '101'
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin'
  }
];

const sampleMenus = [
  {
    id: '1',
    date: new Date().toISOString().split('T')[0],
    meals: {
      breakfast: {
        items: ['Idli Sambar', 'Coconut Chutney', 'Tea/Coffee'],
        servings: 50,
        preferences: 45
      },
      lunch: {
        items: ['Rice', 'Dal', 'Mixed Vegetables', 'Pickle'],
        servings: 60,
        preferences: 55
      },
      dinner: {
        items: ['Roti', 'Paneer Curry', 'Rice', 'Curd'],
        servings: 55,
        preferences: 50
      }
    }
  }
];

// Mock delay function
const mockDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock authentication API
export const mockAuthAPI = {
  register: async (userData) => {
    await mockDelay();
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      role: userData.email.includes('admin') ? 'admin' : 'student'
    };
    return {
      success: true,
      user: newUser,
      token: 'mock-jwt-token-' + Date.now()
    };
  },

  login: async (credentials) => {
    await mockDelay();
    if (credentials.email === 'admin@example.com' && credentials.password === 'admin123') {
      return {
        success: true,
        user: sampleUsers[1],
        token: 'mock-admin-token'
      };
    }
    if (credentials.email === 'john@example.com' && credentials.password === 'student123') {
      return {
        success: true,
        user: sampleUsers[0],
        token: 'mock-student-token'
      };
    }
    // For demo, allow any email/password combination
    return {
      success: true,
      user: {
        id: '3',
        name: 'Demo User',
        email: credentials.email,
        role: credentials.email.includes('admin') ? 'admin' : 'student'
      },
      token: 'mock-demo-token'
    };
  },

  getProfile: async () => {
    await mockDelay();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return { success: true, user };
  }
};

// Mock menu API
export const mockMenuAPI = {
  getTodayMenu: async () => {
    await mockDelay();
    return {
      success: true,
      menu: sampleMenus[0]
    };
  },

  getMenuByDate: async (date) => {
    await mockDelay();
    return {
      success: true,
      menu: { ...sampleMenus[0], date }
    };
  },

  createMenu: async (menuData) => {
    await mockDelay();
    const newMenu = {
      id: Date.now().toString(),
      ...menuData
    };
    return { success: true, menu: newMenu };
  },

  updateMenu: async (id, menuData) => {
    await mockDelay();
    return { success: true, menu: { id, ...menuData } };
  },

  deleteMenu: async (id) => {
    await mockDelay();
    return { success: true, message: 'Menu deleted successfully' };
  }
};

// Mock preferences API
export const mockPreferencesAPI = {
  savePreferences: async (preferences) => {
    await mockDelay();
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    return { success: true, preferences };
  },

  getUserPreferences: async () => {
    await mockDelay();
    const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    return { success: true, preferences };
  },

  getPreferencesByDate: async (date) => {
    await mockDelay();
    return {
      success: true,
      preferences: { date, breakfast: true, lunch: true, dinner: false }
    };
  }
};

// Mock notifications API
export const mockNotificationsAPI = {
  getUserNotifications: async () => {
    await mockDelay();
    return {
      success: true,
      notifications: [
        {
          id: '1',
          title: 'Menu Updated',
          message: 'Today\'s lunch menu has been updated!',
          date: new Date().toISOString(),
          read: false
        },
        {
          id: '2',
          title: 'Welcome!',
          message: 'Welcome to Smart Saving Food demo!',
          date: new Date().toISOString(),
          read: true
        }
      ]
    };
  },

  markAsRead: async (notificationId) => {
    await mockDelay();
    return { success: true, message: 'Notification marked as read' };
  },

  sendNotification: async (notificationData) => {
    await mockDelay();
    return { success: true, notification: { id: Date.now().toString(), ...notificationData } };
  }
};

// Mock admin API
export const mockAdminAPI = {
  getDashboard: async () => {
    await mockDelay();
    return {
      success: true,
      stats: {
        totalUsers: 25,
        totalMenus: 7,
        avgPreferences: 85,
        foodWasteReduction: 30
      }
    };
  },

  getDashboardStats: async () => {
    await mockDelay();
    return {
      success: true,
      stats: {
        totalStudents: 25,
        totalMenus: 7,
        averagePreferences: 85,
        foodWasteReduction: 30
      }
    };
  },

  getWeeklyReport: async () => {
    await mockDelay();
    return {
      success: true,
      report: {
        week: 'Aug 18-24, 2025',
        totalMeals: 150,
        preferences: 128,
        wasteReduction: '25%'
      }
    };
  },

  getAllUsers: async () => {
    await mockDelay();
    return {
      success: true,
      users: sampleUsers
    };
  },

  deleteUser: async (userId) => {
    await mockDelay();
    return { success: true, message: 'User deleted successfully' };
  },

  getAllMenus: async (page = 1, limit = 10) => {
    await mockDelay();
    return {
      success: true,
      menus: sampleMenus,
      pagination: { page, limit, total: sampleMenus.length }
    };
  },

  createMenu: async (menuData) => {
    await mockDelay();
    return { success: true, menu: { id: Date.now().toString(), ...menuData } };
  },

  updateMenu: async (menuId, menuData) => {
    await mockDelay();
    return { success: true, menu: { id: menuId, ...menuData } };
  },

  deleteMenu: async (menuId) => {
    await mockDelay();
    return { success: true, message: 'Menu deleted successfully' };
  },

  getFoodWasteReport: async (startDate, endDate) => {
    await mockDelay();
    return {
      success: true,
      report: {
        period: `${startDate} to ${endDate}`,
        wasteReduction: '30%',
        savings: '₹5,000'
      }
    };
  },

  getUserPreferencesReport: async (startDate, endDate) => {
    await mockDelay();
    return {
      success: true,
      report: {
        period: `${startDate} to ${endDate}`,
        averagePreferences: 85,
        mostPopular: 'Paneer Curry'
      }
    };
  }
};

// Demo auth utilities
export const mockAuthUtils = {
  setAuthData: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  isAdmin: () => {
    const user = mockAuthUtils.getCurrentUser();
    return user?.role === 'admin';
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userPreferences');
  }
};
