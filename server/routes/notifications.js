const express = require('express');
const { body, validationResult } = require('express-validator');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/notifications
// @desc    Send notification (Admin only)
// @access  Private/Admin
router.post('/', auth, [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title must be 1-100 characters'),
  body('message').trim().isLength({ min: 1, max: 500 }).withMessage('Message must be 1-500 characters'),
  body('type').isIn(['menu', 'timing', 'achievement', 'announcement', 'urgent']).withMessage('Invalid notification type'),
  body('targetAudience').optional().isIn(['all', 'students', 'admins']).withMessage('Invalid target audience')
], async (req, res) => {
  try {
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

    const { title, message, type, priority, targetAudience, expiresAt } = req.body;

    const notification = new Notification({
      title,
      message,
      type,
      priority: priority || 'medium',
      targetAudience: targetAudience || 'all',
      sentBy: req.user.userId,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined
    });

    await notification.save();
    await notification.populate('sentBy', 'name role');

    res.status(201).json({
      success: true,
      message: 'Notification sent successfully',
      notification
    });

  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending notification'
    });
  }
});

// @route   GET /api/notifications
// @desc    Get notifications for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    
    const query = {
      isActive: true,
      expiresAt: { $gt: new Date() },
      $or: [
        { targetAudience: 'all' },
        { targetAudience: req.user.role + 's' } // 'students' or 'admins'
      ]
    };

    // If unreadOnly is true, filter for unread notifications
    if (unreadOnly === 'true') {
      query['readBy.user'] = { $ne: req.user.userId };
    }

    const notifications = await Notification.find(query)
      .populate('sentBy', 'name role')
      .sort({ sentAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Mark which notifications are read by this user
    const notificationsWithReadStatus = notifications.map(notif => {
      const isRead = notif.readBy.some(read => read.user.toString() === req.user.userId.toString());
      return {
        ...notif.toObject(),
        isRead
      };
    });

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      ...query,
      'readBy.user': { $ne: req.user.userId }
    });

    res.json({
      success: true,
      notifications: notificationsWithReadStatus,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalNotifications: total,
        unreadCount
      }
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching notifications'
    });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check if user already marked as read
    const alreadyRead = notification.readBy.some(
      read => read.user.toString() === req.user.userId.toString()
    );

    if (!alreadyRead) {
      notification.readBy.push({
        user: req.user.userId,
        readAt: new Date()
      });
      await notification.save();
    }

    res.json({
      success: true,
      message: 'Notification marked as read'
    });

  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while marking notification as read'
    });
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete notification (Admin only or sender)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check if user is admin or the sender of the notification
    if (req.user.role !== 'admin' && notification.sentBy.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await Notification.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });

  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting notification'
    });
  }
});

// @route   GET /api/notifications/admin/sent
// @desc    Get notifications sent by admin
// @access  Private/Admin
router.get('/admin/sent', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const { page = 1, limit = 20 } = req.query;

    const notifications = await Notification.find({ sentBy: req.user.userId })
      .populate('sentBy', 'name role')
      .sort({ sentAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notification.countDocuments({ sentBy: req.user.userId });

    res.json({
      success: true,
      notifications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalNotifications: total
      }
    });

  } catch (error) {
    console.error('Get sent notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching sent notifications'
    });
  }
});

module.exports = router;
