const express = require('express');
const router = express.Router();
const {
  getUserWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} = require('../controllers/watchlistController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getUserWatchlist).post(protect, addToWatchlist);
router.route('/:id').delete(protect, removeFromWatchlist);

module.exports = router;
