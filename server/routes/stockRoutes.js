const express = require('express');
const router = express.Router();
const {
  getAllStocks,
  getStockById,
  getStockBySymbol,
  searchStocks,
  createStock,
  updateStock,
  deleteStock,
  refreshStockPrices,
  getStockQuoteById,
} = require('../controllers/stockController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getAllStocks).post(protect, admin, createStock);
router.route('/refresh').post(protect, admin, refreshStockPrices);
router.route('/search/:query').get(searchStocks);
router.route('/symbol/:symbol').get(getStockBySymbol);
router
  .route('/:id')
  .get(getStockById)
  .put(protect, admin, updateStock)
  .delete(protect, admin, deleteStock);
router.route('/:id/quote').get(getStockQuoteById);

module.exports = router;
