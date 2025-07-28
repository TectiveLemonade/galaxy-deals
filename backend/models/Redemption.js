const mongoose = require('mongoose');

const redemptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deal',
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  redemptionCode: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'redeemed', 'expired', 'cancelled'],
    default: 'pending'
  },
  redeemedAt: {
    type: Date
  },
  expiresAt: {
    type: Date,
    required: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

redemptionSchema.index({ user: 1 });
redemptionSchema.index({ deal: 1 });
redemptionSchema.index({ restaurant: 1 });
redemptionSchema.index({ redemptionCode: 1 });
redemptionSchema.index({ status: 1 });
redemptionSchema.index({ expiresAt: 1 });

redemptionSchema.pre('save', function(next) {
  if (this.isNew && !this.redemptionCode) {
    this.redemptionCode = generateRedemptionCode();
  }
  next();
});

function generateRedemptionCode() {
  return Math.random().toString(36).substr(2, 9).toUpperCase();
}

module.exports = mongoose.model('Redemption', redemptionSchema);