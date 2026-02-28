const express = require('express');
const router = express.Router();
const {
  buyStock,
  sellStock,
  getUserTransactions,
  getAllTransactions,
  getTransactionById,
} = require('../controllers/transactionController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, getUserTransactions);
router.route('/all').get(protect, admin, getAllTransactions);
router.route('/buy').post(protect, buyStock);
router.route('/sell').post(protect, sellStock);
router.route('/:id').get(protect, getTransactionById);

module.exports = router;
