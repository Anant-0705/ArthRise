const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    stock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stock',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    averagePurchasePrice: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    totalInvested: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index to ensure one document per user-stock combination
portfolioSchema.index({ user: 1, stock: 1 }, { unique: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);
