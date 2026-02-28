const Order = require('../models/Order');
const Stock = require('../models/Stock');
const User = require('../models/User');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { stockId, orderType, quantity } = req.body;

    if (!stockId || !orderType || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    const stock = await Stock.findById(stockId);
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    const user = await User.findById(req.user._id);
    const totalAmount = stock.currentPrice * quantity;

    if (orderType === 'buy' && user.balance < totalAmount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const order = await Order.create({
      user: user._id,
      stock: stock._id,
      orderType,
      quantity,
      pricePerShare: stock.currentPrice,
      totalAmount,
      status: 'pending',
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('stock', 'symbol name currentPrice')
      .populate('user', 'username email');

    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('stock', 'symbol name currentPrice')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/all
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'username email')
      .populate('stock', 'symbol name currentPrice')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'username email')
      .populate('stock', 'symbol name currentPrice');

    if (order) {
      // Check if user owns this order or is admin
      if (
        order.user._id.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status || order.status;
      
      if (status === 'completed') {
        order.executedAt = Date.now();
      }

      const updatedOrder = await order.save();
      
      const populatedOrder = await Order.findById(updatedOrder._id)
        .populate('user', 'username email')
        .populate('stock', 'symbol name currentPrice');

      res.json(populatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel order
// @route   DELETE /api/orders/:id
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      // Check if user owns this order or is admin
      if (
        order.user.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      if (order.status === 'completed') {
        return res.status(400).json({ message: 'Cannot cancel completed order' });
      }

      order.status = 'cancelled';
      await order.save();

      res.json({ message: 'Order cancelled' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
};
