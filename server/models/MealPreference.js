const mongoose = require('mongoose');

const mealPreferenceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  meal: {
    type: String,
    enum: ['breakfast', 'lunch', 'snacks', 'dinner'],
    required: true
  },
  items: [{
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    itemName: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      max: 10
    },
    unit: {
      type: String,
      required: true
    }
  }],
  totalEstimatedCalories: {
    type: Number,
    default: 0
  },
  specialRequests: {
    type: String,
    trim: true
  },
  isAttending: {
    type: Boolean,
    default: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to ensure one preference per user per meal per date
mealPreferenceSchema.index({ user: 1, date: 1, meal: 1 }, { unique: true });

// Index for better query performance
mealPreferenceSchema.index({ date: 1, meal: 1 });
mealPreferenceSchema.index({ user: 1, date: 1 });

module.exports = mongoose.model('MealPreference', mealPreferenceSchema);
