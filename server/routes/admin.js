const express = require('express');
const User = require('../models/User');
const MealPreference = require('../models/MealPreference');
const DailyMenu = require('../models/Menu');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard data
// @access  Private/Admin
router.get('/dashboard', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get total users
    const totalStudents = await User.countDocuments({ role: 'student', isActive: true });
    const totalAdmins = await User.countDocuments({ role: 'admin', isActive: true });

    // Get today's meal registrations
    const mealRegistrations = await MealPreference.aggregate([
      {
        $match: {
          date: today,
          isAttending: true
        }
      },
      {
        $group: {
          _id: '$meal',
          count: { $sum: 1 }
        }
      }
    ]);

    // Convert to object for easier access
    const registrationCounts = {
      breakfast: 0,
      lunch: 0,
      snacks: 0,
      dinner: 0
    };

    mealRegistrations.forEach(reg => {
      registrationCounts[reg._id] = reg.count;
    });

    // Get recent notifications count
    const recentNotifications = await Notification.countDocuments({
      sentAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // Last 7 days
      isActive: true
    });

    // Calculate food wastage estimate (simplified calculation)
    const totalPreferences = await MealPreference.countDocuments({
      date: today,
      isAttending: true
    });

    // Mock data for demonstration - in real app, this would be calculated from actual consumption
    const estimatedWastage = Math.max(0, Math.min(25, 20 - (totalPreferences / totalStudents * 15)));
    const estimatedSavings = Math.round((25 - estimatedWastage) * 100 * totalStudents / 25);

    res.json({
      success: true,
      data: {
        users: {
          totalStudents,
          totalAdmins,
          totalUsers: totalStudents + totalAdmins
        },
        todayRegistrations: {
          ...registrationCounts,
          total: Object.values(registrationCounts).reduce((sum, count) => sum + count, 0)
        },
        metrics: {
          foodWastagePercentage: Math.round(estimatedWastage * 100) / 100,
          estimatedSavings: `₹${estimatedSavings}`,
          recentNotifications,
          registrationRate: totalPreferences > 0 ? Math.round((totalPreferences / (totalStudents * 4)) * 100) : 0
        }
      }
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard data'
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get('/users', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const { page = 1, limit = 20, role, search } = req.query;
    
    let query = {};
    
    if (role && ['student', 'admin'].includes(role)) {
      query.role = role;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users'
    });
  }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Update user status (Admin only)
// @access  Private/Admin
router.put('/users/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const { isActive } = req.body;
    
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isActive must be a boolean value'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user
    });

  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating user status'
    });
  }
});

// @route   GET /api/admin/reports/weekly
// @desc    Get weekly report (Admin only)
// @access  Private/Admin
router.get('/reports/weekly', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    // Get daily registration counts
    const dailyStats = await MealPreference.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
          isAttending: true
        }
      },
      {
        $group: {
          _id: {
            date: '$date',
            meal: '$meal'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          meals: {
            $push: {
              meal: '$_id.meal',
              count: '$count'
            }
          },
          totalRegistrations: { $sum: '$count' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Mock wastage calculation for demonstration
    const wastageStats = dailyStats.map(day => ({
      date: day._id,
      totalRegistrations: day.totalRegistrations,
      estimatedWastage: Math.round((Math.random() * 20 + 5) * 100) / 100, // 5-25%
      meals: day.meals
    }));

    res.json({
      success: true,
      data: {
        period: {
          startDate,
          endDate
        },
        dailyStats: wastageStats,
        summary: {
          totalDays: wastageStats.length,
          averageRegistrations: Math.round(wastageStats.reduce((sum, day) => sum + day.totalRegistrations, 0) / wastageStats.length),
          averageWastage: Math.round(wastageStats.reduce((sum, day) => sum + day.estimatedWastage, 0) / wastageStats.length * 100) / 100
        }
      }
    });

  } catch (error) {
    console.error('Weekly report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating weekly report'
    });
  }
});

// @route   GET /api/admin/reports/preferences/:date
// @desc    Get detailed preferences report for a date (Admin only)
// @access  Private/Admin
router.get('/reports/preferences/:date', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const date = new Date(req.params.date);
    date.setHours(0, 0, 0, 0);

    const preferences = await MealPreference.find({ date })
      .populate('user', 'name email studentId hostelRoom')
      .sort({ meal: 1, submittedAt: 1 });

    // Group by meal
    const mealGroups = {
      breakfast: [],
      lunch: [],
      snacks: [],
      dinner: []
    };

    preferences.forEach(pref => {
      mealGroups[pref.meal].push(pref);
    });

    // Calculate summary
    const summary = {};
    Object.keys(mealGroups).forEach(meal => {
      const mealPrefs = mealGroups[meal];
      const attending = mealPrefs.filter(p => p.isAttending).length;
      
      summary[meal] = {
        totalSubmissions: mealPrefs.length,
        attending,
        notAttending: mealPrefs.length - attending,
        itemsSummary: {}
      };

      // Summarize items
      mealPrefs.forEach(pref => {
        if (pref.isAttending) {
          pref.items.forEach(item => {
            if (!summary[meal].itemsSummary[item.itemName]) {
              summary[meal].itemsSummary[item.itemName] = {
                totalQuantity: 0,
                userCount: 0,
                unit: item.unit
              };
            }
            summary[meal].itemsSummary[item.itemName].totalQuantity += item.quantity;
            summary[meal].itemsSummary[item.itemName].userCount += 1;
          });
        }
      });
    });

    res.json({
      success: true,
      data: {
        date,
        preferences: mealGroups,
        summary
      }
    });

  } catch (error) {
    console.error('Preferences report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating preferences report'
    });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user (Admin only)
// @access  Private/Admin
router.delete('/users/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    // Prevent admin from deleting themselves
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Also delete related meal preferences
    await MealPreference.deleteMany({ user: req.params.id });

    res.json({
      success: true,
      message: `User ${user.name} deleted successfully`,
      deletedUser: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting user'
    });
  }
});

// @route   GET /api/admin/menus
// @desc    Get all menus (Admin only)
// @access  Private/Admin
router.get('/menus', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const { page = 1, limit = 10, startDate, endDate } = req.query;
    
    let query = {};
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const menus = await DailyMenu.find(query)
      .populate('createdBy', 'name role')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await DailyMenu.countDocuments(query);

    res.json({
      success: true,
      menus,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalMenus: total
      }
    });

  } catch (error) {
    console.error('Get menus error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching menus'
    });
  }
});

// @route   POST /api/admin/menus
// @desc    Create new menu (Admin only)
// @access  Private/Admin
router.post('/menus', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const { date, meals } = req.body;

    if (!date || !meals) {
      return res.status(400).json({
        success: false,
        message: 'Date and meals are required'
      });
    }

    const menuDate = new Date(date);
    menuDate.setHours(0, 0, 0, 0);

    // Check if menu already exists for this date
    const existingMenu = await DailyMenu.findOne({ date: menuDate });
    if (existingMenu) {
      return res.status(400).json({
        success: false,
        message: 'Menu already exists for this date'
      });
    }

    const newMenu = new DailyMenu({
      date: menuDate,
      meals,
      createdBy: req.user.id
    });

    await newMenu.save();
    await newMenu.populate('createdBy', 'name role');

    res.status(201).json({
      success: true,
      message: 'Menu created successfully',
      menu: newMenu
    });

  } catch (error) {
    console.error('Create menu error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating menu'
    });
  }
});

// @route   PUT /api/admin/menus/:id
// @desc    Update menu (Admin only)
// @access  Private/Admin
router.put('/menus/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const { meals } = req.body;

    if (!meals) {
      return res.status(400).json({
        success: false,
        message: 'Meals data is required'
      });
    }

    const menu = await DailyMenu.findByIdAndUpdate(
      req.params.id,
      { 
        meals,
        updatedBy: req.user.id,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('createdBy updatedBy', 'name role');

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: 'Menu not found'
      });
    }

    res.json({
      success: true,
      message: 'Menu updated successfully',
      menu
    });

  } catch (error) {
    console.error('Update menu error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating menu'
    });
  }
});

// @route   DELETE /api/admin/menus/:id
// @desc    Delete menu (Admin only)
// @access  Private/Admin
router.delete('/menus/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const menu = await DailyMenu.findByIdAndDelete(req.params.id);

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: 'Menu not found'
      });
    }

    // Also delete related meal preferences for this date
    await MealPreference.deleteMany({ date: menu.date });

    res.json({
      success: true,
      message: `Menu for ${menu.date.toDateString()} deleted successfully`,
      deletedMenu: {
        id: menu._id,
        date: menu.date,
        mealsCount: Object.keys(menu.meals).length
      }
    });

  } catch (error) {
    console.error('Delete menu error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting menu'
    });
  }
});

module.exports = router;
