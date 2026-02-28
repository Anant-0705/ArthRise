const Watchlist = require('../models/Watchlist');
const Stock = require('../models/Stock');

// @desc    Get user watchlist
// @route   GET /api/watchlist
// @access  Private
const getUserWatchlist = async (req, res) => {
  try {
    const watchlist = await Watchlist.find({ user: req.user._id })
      .populate('stock', 'symbol name currentPrice previousClose changePercent exchange')
      .sort({ createdAt: -1 });

    res.json(watchlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add stock to watchlist
// @route   POST /api/watchlist
// @access  Private
const addToWatchlist = async (req, res) => {
  try {
    const { stockId } = req.body;

    if (!stockId) {
      return res.status(400).json({ message: 'Stock ID is required' });
    }

    const stock = await Stock.findById(stockId);
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    // Check if already in watchlist
    const exists = await Watchlist.findOne({
      user: req.user._id,
      stock: stockId,
    });

    if (exists) {
      return res.status(400).json({ message: 'Stock already in watchlist' });
    }

    const watchlistItem = await Watchlist.create({
      user: req.user._id,
      stock: stockId,
    });

    const populatedItem = await Watchlist.findById(watchlistItem._id)
      .populate('stock', 'symbol name currentPrice previousClose changePercent exchange');

    res.status(201).json(populatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove stock from watchlist
// @route   DELETE /api/watchlist/:id
// @access  Private
const removeFromWatchlist = async (req, res) => {
  try {
    const watchlistItem = await Watchlist.findById(req.params.id);

    if (watchlistItem) {
      // Check if user owns this watchlist item
      if (watchlistItem.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      await watchlistItem.deleteOne();
      res.json({ message: 'Removed from watchlist' });
    } else {
      res.status(404).json({ message: 'Watchlist item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserWatchlist,
  addToWatchlist,
  removeFromWatchlist,
};
