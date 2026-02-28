const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.FINNHUB_API_KEY;

console.log('Testing Finnhub API Key...\n');
console.log('API Key (first 10 chars):', API_KEY ? API_KEY.substring(0, 10) + '...' : 'NOT FOUND');
console.log('API Key Length:', API_KEY ? API_KEY.length : 0);
console.log('API Key has spaces:', API_KEY ? API_KEY.includes(' ') : false);
console.log('\nTesting API call to Finnhub...\n');

async function testAPI() {
  try {
    const response = await axios.get('https://finnhub.io/api/v1/quote', {
      params: {
        symbol: 'AAPL',
        token: API_KEY,
      },
    });
    
    console.log('✓ SUCCESS! API key is working!');
    console.log('Response:', response.data);
    console.log('\nYou can now run: npm run seed');
  } catch (error) {
    console.log('✗ FAILED! API key is not working.');
    console.log('Error:', error.response?.status, error.response?.statusText);
    console.log('Error message:', error.response?.data);
    
    console.log('\n📋 Troubleshooting Steps:');
    console.log('1. Go to https://finnhub.io/dashboard');
    console.log('2. Copy your API key (it should be about 32 characters)');
    console.log('3. In your .env file, update this line:');
    console.log('   FINNHUB_API_KEY=your_key_here');
    console.log('   (No quotes, no spaces)');
    console.log('4. Save the file and run: node testApiKey.js again');
  }
}

testAPI();
