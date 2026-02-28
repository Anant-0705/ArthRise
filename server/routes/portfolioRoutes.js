const express = require('express');
const router = express.Router();
const {
  getUserPortfolio,
  getPortfolioSummary,
} = require('../controllers/portfolioController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getUserPortfolio);
router.route('/summary').get(protect, getPortfolioSummary);

module.exports = router;
