const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
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
    transactionType: {
      type: String,
      enum: ['buy', 'sell', 'deposit', 'withdrawal'],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    pricePerShare: {
      type: Number,
      required: function () {
        return this.transactionType === 'buy' || this.transactionType === 'sell';
      },
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['completed', 'pending', 'failed'],
      default: 'completed',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Transaction', transactionSchema);
