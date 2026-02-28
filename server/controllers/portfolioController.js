const Portfolio = require('../models/Portfolio');
const Stock = require('../models/Stock');

// @desc    Get user portfolio
// @route   GET /api/portfolio
// @access  Private
const getUserPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.find({ user: req.user._id })
      .populate('stock', 'symbol name currentPrice changePercent')
      .sort({ createdAt: -1 });

    // Calculate current values and profit/loss
    const enrichedPortfolio = portfolio.map((item) => {
      const currentValue = item.stock.currentPrice * item.quantity;
      const profitLoss = currentValue - item.totalInvested;
      const profitLossPercent = (profitLoss / item.totalInvested) * 100;

      return {
        ...item.toObject(),
        currentValue,
        profitLoss,
        profitLossPercent,
      };
    });

    res.json(enrichedPortfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get portfolio summary
// @route   GET /api/portfolio/summary
// @access  Private
const getPortfolioSummary = async (req, res) => {
  try {
    const portfolio = await Portfolio.find({ user: req.user._id })
      .populate('stock', 'currentPrice');

    let totalInvested = 0;
    let currentValue = 0;

    portfolio.forEach((item) => {
      totalInvested += item.totalInvested;
      currentValue += item.stock.currentPrice * item.quantity;
    });

    const totalProfitLoss = currentValue - totalInvested;
    const totalProfitLossPercent = totalInvested > 0 
      ? (totalProfitLoss / totalInvested) * 100 
      : 0;

    res.json({
      totalInvested,
      currentValue,
      totalProfitLoss,
      totalProfitLossPercent,
      holdingsCount: portfolio.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserPortfolio,
  getPortfolioSummary,
};
