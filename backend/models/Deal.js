const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  dealType: {
    type: String,
    enum: ['percentage', 'fixed-amount', 'bogo', 'free-item'],
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  originalPrice: {
    type: Number,
    required: function() {
      return this.dealType === 'fixed-amount';
    }
  },
  category: {
    type: String,
    enum: ['appetizer', 'main-course', 'dessert', 'beverage', 'combo', 'happy-hour', 'lunch-special', 'dinner-special'],
    required: true
  },
  validDays: [{
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  }],
  validTimes: {
    start: {
      type: String,
      default: '00:00'
    },
    end: {
      type: String,
      default: '23:59'
    }
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  maxRedemptions: {
    type: Number,
    default: null // null means unlimited
  },
  currentRedemptions: {
    type: Number,
    default: 0
  },
  termsAndConditions: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  image: {
    url: String,
    caption: String
  },
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    saves: {
      type: Number,
      default: 0
    },
    redemptions: {
      type: Number,
      default: 0
    },
    conversionRate: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

dealSchema.index({ restaurant: 1 });
dealSchema.index({ startDate: 1, endDate: 1 });
dealSchema.index({ category: 1 });
dealSchema.index({ featured: 1 });
dealSchema.index({ isActive: 1 });

dealSchema.virtual('isValid').get(function() {
  const now = new Date();
  return this.isActive && 
         this.startDate <= now && 
         this.endDate >= now &&
         (this.maxRedemptions === null || this.currentRedemptions < this.maxRedemptions);
});

dealSchema.virtual('discountedPrice').get(function() {
  if (this.dealType === 'percentage') {
    return this.originalPrice * (1 - this.value / 100);
  } else if (this.dealType === 'fixed-amount') {
    return Math.max(0, this.originalPrice - this.value);
  }
  return this.originalPrice;
});

module.exports = mongoose.model('Deal', dealSchema);