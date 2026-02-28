const Stock = require('../models/Stock');
const {
  getStockQuote,
  getCompanyProfile,
  getBatchQuotes,
  formatQuoteData,
} = require('../services/stockApiService');

// @desc    Get all stocks with real-time prices
// @route   GET /api/stocks
// @access  Public
const getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find({}).sort({ symbol: 1 });
    
    // Optionally refresh prices if query param is set
    if (req.query.refresh === 'true') {
      const symbols = stocks.map(s => s.symbol);
      const quotes = await getBatchQuotes(symbols);
      
      // Update stocks with latest prices
      for (let stock of stocks) {
        const quote = quotes[stock.symbol];
        if (quote) {
          const formattedData = formatQuoteData(quote, stock.previousClose);
          if (formattedData) {
            stock.currentPrice = formattedData.currentPrice;
            stock.previousClose = formattedData.previousClose;
            stock.changePercent = formattedData.changePercent;
            stock.volume = formattedData.volume;
            await stock.save();
          }
        }
      }
    }
    
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get stock by ID
// @route   GET /api/stocks/:id
// @access  Public
const getStockById = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);

    if (stock) {
      res.json(stock);
    } else {
      res.status(404).json({ message: 'Stock not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get stock by symbol
// @route   GET /api/stocks/symbol/:symbol
// @access  Public
const getStockBySymbol = async (req, res) => {
  try {
    const stock = await Stock.findOne({ symbol: req.params.symbol.toUpperCase() });

    if (stock) {
      res.json(stock);
    } else {
      res.status(404).json({ message: 'Stock not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search stocks
// @route   GET /api/stocks/search/:query
// @access  Public
const searchStocks = async (req, res) => {
  try {
    const query = req.params.query;
    const stocks = await Stock.find({
      $or: [
        { symbol: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } },
      ],
    }).limit(10);

    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new stock (Admin only)
// @route   POST /api/stocks
// @access  Private/Admin
const createStock = async (req, res) => {
  try {
    const {
      symbol,
      name,
      exchange,
      currentPrice,
      previousClose,
      marketCap,
      volume,
      sector,
      description,
    } = req.body;

    const stockExists = await Stock.findOne({ symbol: symbol.toUpperCase() });

    if (stockExists) {
      return res.status(400).json({ message: 'Stock already exists' });
    }

    const stock = await Stock.create({
      symbol: symbol.toUpperCase(),
      name,
      exchange,
      currentPrice,
      previousClose: previousClose || currentPrice,
      changePercent: previousClose
        ? ((currentPrice - previousClose) / previousClose) * 100
        : 0,
      marketCap,
      volume,
      sector,
      description,
    });

    res.status(201).json(stock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a stock (Admin only)
// @route   PUT /api/stocks/:id
// @access  Private/Admin
const updateStock = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);

    if (stock) {
      stock.symbol = req.body.symbol || stock.symbol;
      stock.name = req.body.name || stock.name;
      stock.exchange = req.body.exchange || stock.exchange;
      stock.currentPrice = req.body.currentPrice || stock.currentPrice;
      stock.previousClose = req.body.previousClose || stock.previousClose;
      stock.marketCap = req.body.marketCap || stock.marketCap;
      stock.volume = req.body.volume || stock.volume;
      stock.sector = req.body.sector || stock.sector;
      stock.description = req.body.description || stock.description;

      // Calculate change percent
      if (stock.previousClose && stock.currentPrice) {
        stock.changePercent =
          ((stock.currentPrice - stock.previousClose) / stock.previousClose) * 100;
      }

      const updatedStock = await stock.save();
      res.json(updatedStock);
    } else {
      res.status(404).json({ message: 'Stock not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a stock (Admin only)
// @route   DELETE /api/stocks/:id
// @access  Private/Admin
const deleteStock = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);

    if (stock) {
      await stock.deleteOne();
      res.json({ message: 'Stock removed' });
    } else {
      res.status(404).json({ message: 'Stock not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Refresh stock prices from API
// @route   POST /api/stocks/refresh
// @access  Private/Admin
const refreshStockPrices = async (req, res) => {
  try {
    const stocks = await Stock.find({});
    const symbols = stocks.map(s => s.symbol);
    
    const quotes = await getBatchQuotes(symbols);
    let updatedCount = 0;
    
    for (let stock of stocks) {
      const quote = quotes[stock.symbol];
      if (quote && quote.c) {
        const formattedData = formatQuoteData(quote, stock.previousClose);
        if (formattedData) {
          stock.currentPrice = formattedData.currentPrice;
          stock.previousClose = formattedData.previousClose;
          stock.changePercent = formattedData.changePercent;
          stock.volume = formattedData.volume;
          await stock.save();
          updatedCount++;
        }
      }
    }
    
    res.json({ 
      message: 'Stock prices refreshed',
      updated: updatedCount,
      total: stocks.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get real-time quote for a stock
// @route   GET /api/stocks/:id/quote
// @access  Public
const getStockQuoteById = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    
    const quote = await getStockQuote(stock.symbol);
    
    if (!quote || !quote.c) {
      return res.status(404).json({ message: 'Quote not available' });
    }
    
    const formattedData = formatQuoteData(quote, stock.previousClose);
    
    res.json({
      symbol: stock.symbol,
      name: stock.name,
      ...formattedData,
      timestamp: Date.now(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllStocks,
  getStockById,
  getStockBySymbol,
  searchStocks,
  createStock,
  updateStock,
  deleteStock,
  refreshStockPrices,
  getStockQuoteById,
};
