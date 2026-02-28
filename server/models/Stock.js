const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: [true, 'Please add a stock symbol'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Please add a stock name'],
      trim: true,
    },
    exchange: {
      type: String,
      required: true,
      enum: ['NYSE', 'NASDAQ', 'AMEX'],
      default: 'NASDAQ',
    },
    currentPrice: {
      type: Number,
      required: [true, 'Please add a stock price'],
      min: 0,
    },
    previousClose: {
      type: Number,
      default: 0,
    },
    changePercent: {
      type: Number,
      default: 0,
    },
    marketCap: {
      type: Number,
      default: 0,
    },
    volume: {
      type: Number,
      default: 0,
    },
    sector: {
      type: String,
      default: 'Technology',
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Stock', stockSchema);
