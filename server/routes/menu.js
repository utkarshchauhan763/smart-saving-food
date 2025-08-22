const express = require('express');
const { body, validationResult } = require('express-validator');
const DailyMenu = require('../models/Menu');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/menu/today
// @desc    Get today's menu
// @access  Public
router.get('/today', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let menu = await DailyMenu.findOne({ date: today }).populate('createdBy', 'name');

    if (!menu) {
      // Create default menu if none exists
      menu = await createDefaultMenu(today);
    }

    res.json({
      success: true,
      menu
    });

  } catch (error) {
    console.error('Get today menu error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching menu'
    });
  }
});

// @route   GET /api/menu/:date
// @desc    Get menu by specific date
// @access  Public
router.get('/:date', async (req, res) => {
  try {
    const date = new Date(req.params.date);
    date.setHours(0, 0, 0, 0);

    const menu = await DailyMenu.findOne({ date }).populate('createdBy', 'name');

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: 'Menu not found for this date'
      });
    }

    res.json({
      success: true,
      menu
    });

  } catch (error) {
    console.error('Get menu by date error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching menu'
    });
  }
});

// @route   POST /api/menu
// @desc    Create or update daily menu (Admin only)
// @access  Private/Admin
router.post('/', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const { date, meals } = req.body;
    const menuDate = new Date(date);
    menuDate.setHours(0, 0, 0, 0);

    // Check if menu already exists for this date
    let menu = await DailyMenu.findOne({ date: menuDate });

    if (menu) {
      // Update existing menu
      menu.meals = meals;
      menu.lastModified = new Date();
      await menu.save();
    } else {
      // Create new menu
      menu = new DailyMenu({
        date: menuDate,
        meals,
        createdBy: req.user.userId
      });
      await menu.save();
    }

    await menu.populate('createdBy', 'name');

    res.json({
      success: true,
      message: menu.isNew ? 'Menu created successfully' : 'Menu updated successfully',
      menu
    });

  } catch (error) {
    console.error('Create/Update menu error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while saving menu'
    });
  }
});

// @route   PUT /api/menu/:id/meal/:mealType
// @desc    Update specific meal in menu (Admin only)
// @access  Private/Admin
router.put('/:id/meal/:mealType', auth, [
  body('items').isArray().withMessage('Items must be an array'),
  body('timing.start').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid start time format'),
  body('timing.end').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid end time format')
], async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { mealType } = req.params;
    const { items, timing, isActive } = req.body;

    const validMealTypes = ['breakfast', 'lunch', 'snacks', 'dinner'];
    if (!validMealTypes.includes(mealType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid meal type'
      });
    }

    const menu = await DailyMenu.findById(id);
    if (!menu) {
      return res.status(404).json({
        success: false,
        message: 'Menu not found'
      });
    }

    // Update the specific meal
    menu.meals[mealType].items = items;
    if (timing) menu.meals[mealType].timing = timing;
    if (typeof isActive === 'boolean') menu.meals[mealType].isActive = isActive;
    menu.lastModified = new Date();

    await menu.save();
    await menu.populate('createdBy', 'name');

    res.json({
      success: true,
      message: `${mealType.charAt(0).toUpperCase() + mealType.slice(1)} updated successfully`,
      menu
    });

  } catch (error) {
    console.error('Update meal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating meal'
    });
  }
});

// Helper function to create default menu
async function createDefaultMenu(date) {
  const defaultMenuData = {
    date,
    meals: {
      breakfast: {
        items: [
          { name: 'Chapati', type: 'solid', unit: 'pieces', category: 'main', isVegetarian: true },
          { name: 'Aloo Sabzi', type: 'liquid', unit: 'bowls', category: 'main', isVegetarian: true },
          { name: 'Tea', type: 'liquid', unit: 'cups', category: 'beverage', isVegetarian: true },
          { name: 'Butter', type: 'solid', unit: 'pieces', category: 'side', isVegetarian: true }
        ],
        timing: { start: '07:00', end: '09:00' },
        isActive: true
      },
      lunch: {
        items: [
          { name: 'Rice', type: 'liquid', unit: 'bowls', category: 'main', isVegetarian: true },
          { name: 'Dal', type: 'liquid', unit: 'bowls', category: 'main', isVegetarian: true },
          { name: 'Chapati', type: 'solid', unit: 'pieces', category: 'main', isVegetarian: true },
          { name: 'Mixed Vegetable', type: 'liquid', unit: 'bowls', category: 'main', isVegetarian: true },
          { name: 'Pickle', type: 'solid', unit: 'spoons', category: 'side', isVegetarian: true }
        ],
        timing: { start: '12:00', end: '14:00' },
        isActive: true
      },
      snacks: {
        items: [
          { name: 'Samosa', type: 'solid', unit: 'pieces', category: 'main', isVegetarian: true },
          { name: 'Green Chutney', type: 'liquid', unit: 'bowls', category: 'side', isVegetarian: true },
          { name: 'Tea', type: 'liquid', unit: 'cups', category: 'beverage', isVegetarian: true }
        ],
        timing: { start: '16:00', end: '17:00' },
        isActive: true
      },
      dinner: {
        items: [
          { name: 'Chapati', type: 'solid', unit: 'pieces', category: 'main', isVegetarian: true },
          { name: 'Dal', type: 'liquid', unit: 'bowls', category: 'main', isVegetarian: true },
          { name: 'Paneer Curry', type: 'liquid', unit: 'bowls', category: 'main', isVegetarian: true },
          { name: 'Rice', type: 'liquid', unit: 'bowls', category: 'main', isVegetarian: true },
          { name: 'Salad', type: 'solid', unit: 'portions', category: 'side', isVegetarian: true }
        ],
        timing: { start: '19:00', end: '21:00' },
        isActive: true
      }
    },
    createdBy: null // Will be set when an admin creates/updates
  };

  const menu = new DailyMenu(defaultMenuData);
  await menu.save();
  return menu;
}

module.exports = router;
