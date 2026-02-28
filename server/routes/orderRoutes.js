const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, getUserOrders).post(protect, createOrder);
router.route('/all').get(protect, admin, getAllOrders);
router
  .route('/:id')
  .get(protect, getOrderById)
  .put(protect, admin, updateOrderStatus)
  .delete(protect, cancelOrder);

module.exports = router;
