const dotenv = require('dotenv');
dotenv.config(); // Load environment variables FIRST

const mongoose = require('mongoose');
const Stock = require('./models/Stock');
const connectDB = require('./config/db');
const { getStockQuote, getCompanyProfile, formatQuoteData } = require('./services/stockApiService');

// Popular US stock symbols to seed
const stockSymbols = [
  'AAPL',  // Apple Inc.
  'MSFT',  // Microsoft Corporation
  'GOOGL', // Alphabet Inc.
  'AMZN',  // Amazon.com Inc.
  'TSLA',  // Tesla Inc.
  'NVDA',  // NVIDIA Corporation
  'META',  // Meta Platforms Inc.
  'JPM',   // JPMorgan Chase & Co.
  'V',     // Visa Inc.
  'WMT',   // Walmart Inc.
];

// Fallback sample data when API is unavailable
const fallbackStocks = [
  {
    symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ',
    currentPrice: 178.50, previousClose: 175.30, marketCap: 2800000000000,
    volume: 52000000, sector: 'Technology',
    description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.',
  },
  {
    symbol: 'MSFT', name: 'Microsoft Corporation', exchange: 'NASDAQ',
    currentPrice: 350.25, previousClose: 348.10, marketCap: 2600000000000,
    volume: 28000000, sector: 'Technology',
    description: 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.',
  },
  {
    symbol: 'GOOGL', name: 'Alphabet Inc.', exchange: 'NASDAQ',
    currentPrice: 142.80, previousClose: 140.50, marketCap: 1800000000000,
    volume: 25000000, sector: 'Technology',
    description: 'Alphabet Inc. offers various products and platforms worldwide.',
  },
  {
    symbol: 'AMZN', name: 'Amazon.com Inc.', exchange: 'NASDAQ',
    currentPrice: 155.75, previousClose: 153.20, marketCap: 1600000000000,
    volume: 48000000, sector: 'Consumer Cyclical',
    description: 'Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions.',
  },
  {
    symbol: 'TSLA', name: 'Tesla Inc.', exchange: 'NASDAQ',
    currentPrice: 245.60, previousClose: 250.30, marketCap: 780000000000,
    volume: 125000000, sector: 'Automotive',
    description: 'Tesla, Inc. designs, develops, manufactures, and sells electric vehicles.',
  },
  {
    symbol: 'NVDA', name: 'NVIDIA Corporation', exchange: 'NASDAQ',
    currentPrice: 485.90, previousClose: 478.20, marketCap: 1200000000000,
    volume: 42000000, sector: 'Technology',
    description: 'NVIDIA Corporation provides graphics, compute and networking solutions.',
  },
  {
    symbol: 'META', name: 'Meta Platforms Inc.', exchange: 'NASDAQ',
    currentPrice: 325.50, previousClose: 320.80, marketCap: 850000000000,
    volume: 18000000, sector: 'Technology',
    description: 'Meta Platforms, Inc. engages in the development of social media products.',
  },
  {
    symbol: 'JPM', name: 'JPMorgan Chase & Co.', exchange: 'NYSE',
    currentPrice: 155.30, previousClose: 154.20, marketCap: 450000000000,
    volume: 10000000, sector: 'Financial Services',
    description: 'JPMorgan Chase & Co. operates as a financial services company worldwide.',
  },
  {
    symbol: 'V', name: 'Visa Inc.', exchange: 'NYSE',
    currentPrice: 245.80, previousClose: 243.50, marketCap: 520000000000,
    volume: 7000000, sector: 'Financial Services',
    description: 'Visa Inc. operates as a payments technology company worldwide.',
  },
  {
    symbol: 'WMT', name: 'Walmart Inc.', exchange: 'NYSE',
    currentPrice: 165.40, previousClose: 164.80, marketCap: 450000000000,
    volume: 8000000, sector: 'Consumer Defensive',
    description: 'Walmart Inc. engages in the operation of retail, wholesale, and other units worldwide.',
  },
];

// Normalize exchange name to match Stock model enum
const normalizeExchange = (exchangeName) => {
  if (!exchangeName) return 'NASDAQ';
  const exchange = exchangeName.toUpperCase();
  if (exchange.includes('NASDAQ')) return 'NASDAQ';
  if (exchange.includes('NYSE')) return 'NYSE';
  if (exchange.includes('AMEX') || exchange.includes('AMERICAN')) return 'AMEX';
  return 'NASDAQ'; // default
};

const seedStocks = async () => {
  try {
    await connectDB();

    // Clear existing stocks
    await Stock.deleteMany({});
    console.log('Existing stocks cleared');

    const stocksToInsert = [];
    let useApiData = false;

    console.log('Fetching real-time stock data from Finnhub API...');

    for (const symbol of stockSymbols) {
      try {
        // Fetch company profile and quote
        const [profile, quote] = await Promise.all([
          getCompanyProfile(symbol),
          getStockQuote(symbol)
        ]);

        if (profile && quote && quote.c) {
          const formattedData = formatQuoteData(quote);
          
          const stockData = {
            symbol: symbol,
            name: profile.name || symbol,
            exchange: normalizeExchange(profile.exchange),
            currentPrice: formattedData.currentPrice,
            previousClose: formattedData.previousClose,
            marketCap: profile.marketCapitalization ? profile.marketCapitalization * 1000000 : 0,
            volume: formattedData.volume,
            sector: profile.finnhubIndustry || 'Unknown',
            description: profile.description || `${profile.name || symbol} stock`,
          };

          stocksToInsert.push(stockData);
          console.log(`✓ Fetched data for ${symbol} - ${profile.name}`);
          useApiData = true;
        } else {
          console.log(`✗ Could not fetch data for ${symbol}`);
        }

        // Add small delay to avoid rate limiting (60 calls/min)
        await new Promise(resolve => setTimeout(resolve, 1100));
      } catch (error) {
        console.error(`Error fetching ${symbol}:`, error.message);
      }
    }

    // If API failed for all stocks, use fallback data
    if (stocksToInsert.length === 0) {
      console.log('\n⚠️  API unavailable. Using sample data instead...\n');
      stocksToInsert.push(...fallbackStocks);
    }

    if (stocksToInsert.length > 0) {
      const stocks = await Stock.insertMany(stocksToInsert);
      if (useApiData) {
        console.log(`\n✓ ${stocks.length} stocks added successfully with real-time data!`);
      } else {
        console.log(`\n✓ ${stocks.length} stocks added successfully with sample data!`);
        console.log('\n💡 To use real-time data:');
        console.log('   1. Get a free API key from https://finnhub.io/register');
        console.log('   2. Update FINNHUB_API_KEY in your .env file');
        console.log('   3. Run "npm run seed" again\n');
      }
    } else {
      console.log('\n✗ No stocks were added.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding stocks:', error);
    process.exit(1);
  }
};

seedStocks();
