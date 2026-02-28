const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Stock = require('../models/Stock');
const Portfolio = require('../models/Portfolio');

// @desc    Buy stock
// @route   POST /api/transactions/buy
// @access  Private
const buyStock = async (req, res) => {
  try {
    const { stockId, quantity } = req.body;

    if (!stockId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    const stock = await Stock.findById(stockId);
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    const user = await User.findById(req.user._id);
    const totalCost = stock.currentPrice * quantity;

    if (user.balance < totalCost) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Deduct balance
    user.balance -= totalCost;
    await user.save();

    // Create transaction
    const transaction = await Transaction.create({
      user: user._id,
      stock: stock._id,
      transactionType: 'buy',
      quantity,
      pricePerShare: stock.currentPrice,
      totalAmount: totalCost,
      balanceAfter: user.balance,
      status: 'completed',
    });

    // Update portfolio
    let portfolio = await Portfolio.findOne({ user: user._id, stock: stock._id });

    if (portfolio) {
      // Update existing holding
      const totalQuantity = portfolio.quantity + quantity;
      const totalInvested = portfolio.totalInvested + totalCost;
      portfolio.quantity = totalQuantity;
      portfolio.totalInvested = totalInvested;
      portfolio.averagePurchasePrice = totalInvested / totalQuantity;
      await portfolio.save();
    } else {
      // Create new portfolio entry
      portfolio = await Portfolio.create({
        user: user._id,
        stock: stock._id,
        quantity,
        averagePurchasePrice: stock.currentPrice,
        totalInvested: totalCost,
      });
    }

    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate('stock', 'symbol name currentPrice')
      .populate('user', 'username email');

    res.status(201).json(populatedTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Sell stock
// @route   POST /api/transactions/sell
// @access  Private
const sellStock = async (req, res) => {
  try {
    const { stockId, quantity } = req.body;

    if (!stockId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    const stock = await Stock.findById(stockId);
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    const user = await User.findById(req.user._id);
    const portfolio = await Portfolio.findOne({ user: user._id, stock: stock._id });

    if (!portfolio || portfolio.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock holdings' });
    }

    const totalRevenue = stock.currentPrice * quantity;

    // Add balance
    user.balance += totalRevenue;
    await user.save();

    // Create transaction
    const transaction = await Transaction.create({
      user: user._id,
      stock: stock._id,
      transactionType: 'sell',
      quantity,
      pricePerShare: stock.currentPrice,
      totalAmount: totalRevenue,
      balanceAfter: user.balance,
      status: 'completed',
    });

    // Update portfolio
    portfolio.quantity -= quantity;
    const proportionSold = quantity / (portfolio.quantity + quantity);
    portfolio.totalInvested -= portfolio.totalInvested * proportionSold;

    if (portfolio.quantity === 0) {
      await portfolio.deleteOne();
    } else {
      portfolio.averagePurchasePrice = portfolio.totalInvested / portfolio.quantity;
      await portfolio.save();
    }

    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate('stock', 'symbol name currentPrice')
      .populate('user', 'username email');

    res.status(201).json(populatedTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user transactions
// @route   GET /api/transactions
// @access  Private
const getUserTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .populate('stock', 'symbol name')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all transactions (Admin only)
// @route   GET /api/transactions/all
// @access  Private/Admin
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({})
      .populate('user', 'username email')
      .populate('stock', 'symbol name')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('user', 'username email')
      .populate('stock', 'symbol name currentPrice');

    if (transaction) {
      // Check if user owns this transaction or is admin
      if (
        transaction.user._id.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      res.json(transaction);
    } else {
      res.status(404).json({ message: 'Transaction not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  buyStock,
  sellStock,
  getUserTransactions,
  getAllTransactions,
  getTransactionById,
};
