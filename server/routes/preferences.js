const express = require('express');
const { body, validationResult } = require('express-validator');
const MealPreference = require('../models/MealPreference');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/preferences
// @desc    Submit meal preferences
// @access  Private
router.post('/', auth, [
  body('date').isISO8601().withMessage('Invalid date format'),
  body('meal').isIn(['breakfast', 'lunch', 'snacks', 'dinner']).withMessage('Invalid meal type'),
  body('items').isArray().withMessage('Items must be an array'),
  body('items.*.itemId').notEmpty().withMessage('Item ID is required'),
  body('items.*.quantity').isInt({ min: 0, max: 10 }).withMessage('Quantity must be between 0 and 10')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { date, meal, items, specialRequests, isAttending } = req.body;
    const preferenceDate = new Date(date);
    preferenceDate.setHours(0, 0, 0, 0);

    // Check if preference already exists
    let preference = await MealPreference.findOne({
      user: req.user.userId,
      date: preferenceDate,
      meal
    });

    if (preference) {
      // Update existing preference
      preference.items = items;
      preference.specialRequests = specialRequests;
      preference.isAttending = isAttending !== undefined ? isAttending : true;
      preference.submittedAt = new Date();
    } else {
      // Create new preference
      preference = new MealPreference({
        user: req.user.userId,
        date: preferenceDate,
        meal,
        items,
        specialRequests,
        isAttending: isAttending !== undefined ? isAttending : true
      });
    }

    await preference.save();

    res.json({
      success: true,
      message: 'Meal preferences saved successfully',
      preference
    });

  } catch (error) {
    console.error('Save preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while saving preferences'
    });
  }
});

// @route   GET /api/preferences/my/:date
// @desc    Get user's preferences for a specific date
// @access  Private
router.get('/my/:date', auth, async (req, res) => {
  try {
    const date = new Date(req.params.date);
    date.setHours(0, 0, 0, 0);

    const preferences = await MealPreference.find({
      user: req.user.userId,
      date
    });

    res.json({
      success: true,
      preferences
    });

  } catch (error) {
    console.error('Get user preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching preferences'
    });
  }
});

// @route   GET /api/preferences/summary/:date
// @desc    Get preferences summary for a date (Admin only)
// @access  Private/Admin
router.get('/summary/:date', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const date = new Date(req.params.date);
    date.setHours(0, 0, 0, 0);

    const summary = await MealPreference.aggregate([
      {
        $match: {
          date: date,
          isAttending: true
        }
      },
      {
        $group: {
          _id: {
            meal: '$meal',
            itemId: '$items.itemId',
            itemName: '$items.itemName'
          },
          totalQuantity: { $sum: '$items.quantity' },
          userCount: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.meal',
          items: {
            $push: {
              itemId: '$_id.itemId',
              itemName: '$_id.itemName',
              totalQuantity: '$totalQuantity',
              userCount: '$userCount'
            }
          },
          totalUsers: { $sum: '$userCount' }
        }
      }
    ]);

    res.json({
      success: true,
      summary
    });

  } catch (error) {
    console.error('Get preferences summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching summary'
    });
  }
});

// @route   GET /api/preferences/stats/:date
// @desc    Get detailed stats for a date (Admin only)
// @access  Private/Admin
router.get('/stats/:date', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const date = new Date(req.params.date);
    date.setHours(0, 0, 0, 0);

    const stats = await MealPreference.aggregate([
      {
        $match: { date: date }
      },
      {
        $group: {
          _id: '$meal',
          totalRegistrations: { $sum: 1 },
          attending: {
            $sum: { $cond: ['$isAttending', 1, 0] }
          },
          notAttending: {
            $sum: { $cond: ['$isAttending', 0, 1] }
          }
        }
      }
    ]);

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Get preferences stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching stats'
    });
  }
});

module.exports = router;
