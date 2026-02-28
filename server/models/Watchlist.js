const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

// Create compound index to ensure one document per user-stock combination
watchlistSchema.index({ user: 1, stock: 1 }, { unique: true });

module.exports = mongoose.model('Watchlist', watchlistSchema);
