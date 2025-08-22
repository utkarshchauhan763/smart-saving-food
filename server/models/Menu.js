const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['solid', 'liquid'],
    required: true
  },
  unit: {
    type: String,
    required: true,
    trim: true // pieces, bowls, cups, etc.
  },
  category: {
    type: String,
    enum: ['main', 'side', 'beverage', 'dessert'],
    default: 'main'
  },
  isVegetarian: {
    type: Boolean,
    default: true
  },
  calories: {
    type: Number,
    min: 0
  },
  description: {
    type: String,
    trim: true
  }
});

const dailyMenuSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  meals: {
    breakfast: {
      items: [menuItemSchema],
      timing: {
        start: { type: String, default: '07:00' },
        end: { type: String, default: '09:00' }
      },
      isActive: { type: Boolean, default: true }
    },
    lunch: {
      items: [menuItemSchema],
      timing: {
        start: { type: String, default: '12:00' },
        end: { type: String, default: '14:00' }
      },
      isActive: { type: Boolean, default: true }
    },
    snacks: {
      items: [menuItemSchema],
      timing: {
        start: { type: String, default: '16:00' },
        end: { type: String, default: '17:00' }
      },
      isActive: { type: Boolean, default: true }
    },
    dinner: {
      items: [menuItemSchema],
      timing: {
        start: { type: String, default: '19:00' },
        end: { type: String, default: '21:00' }
      },
      isActive: { type: Boolean, default: true }
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Allow null for system-generated default menus
    default: null
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
dailyMenuSchema.index({ date: 1 });
dailyMenuSchema.index({ createdBy: 1 });

module.exports = mongoose.model('DailyMenu', dailyMenuSchema);
