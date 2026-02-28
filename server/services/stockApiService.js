const axios = require('axios');

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || 'demo';
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

// Get real-time stock quote
const getStockQuote = async (symbol) => {
  try {
    const response = await axios.get(`${FINNHUB_BASE_URL}/quote`, {
      params: {
        symbol: symbol,
        token: FINNHUB_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error.message);
    return null;
  }
};

// Get company profile
const getCompanyProfile = async (symbol) => {
  try {
    const response = await axios.get(`${FINNHUB_BASE_URL}/stock/profile2`, {
      params: {
        symbol: symbol,
        token: FINNHUB_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching profile for ${symbol}:`, error.message);
    return null;
  }
};

// Get multiple stock quotes (batch)
const getBatchQuotes = async (symbols) => {
  try {
    const promises = symbols.map((symbol) => getStockQuote(symbol));
    const results = await Promise.all(promises);
    
    // Map results with symbols
    return symbols.reduce((acc, symbol, index) => {
      acc[symbol] = results[index];
      return acc;
    }, {});
  } catch (error) {
    console.error('Error fetching batch quotes:', error.message);
    return {};
  }
};

// Search stocks by symbol or name
const searchStocks = async (query) => {
  try {
    const response = await axios.get(`${FINNHUB_BASE_URL}/search`, {
      params: {
        q: query,
        token: FINNHUB_API_KEY,
      },
    });
    return response.data.result || [];
  } catch (error) {
    console.error(`Error searching stocks for ${query}:`, error.message);
    return [];
  }
};

// Format API quote data to match our schema
const formatQuoteData = (quote, previousClose = null) => {
  if (!quote || !quote.c) return null;

  const currentPrice = quote.c; // Current price
  const prevClose = previousClose || quote.pc || currentPrice; // Previous close
  const changePercent = prevClose > 0 ? ((currentPrice - prevClose) / prevClose) * 100 : 0;

  return {
    currentPrice: currentPrice,
    previousClose: prevClose,
    changePercent: changePercent,
    high: quote.h || 0,
    low: quote.l || 0,
    open: quote.o || 0,
    volume: quote.v || 0,
  };
};

module.exports = {
  getStockQuote,
  getCompanyProfile,
  getBatchQuotes,
  searchStocks,
  formatQuoteData,
};
