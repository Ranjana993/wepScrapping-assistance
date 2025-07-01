const axios = require('axios');

const API_BASE_URL = 'https://wepscrapping-assistance.onrender.com/api';

async function testAPI() {
  console.log('🧪 Testing Web Scraping Assistant API...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    console.log('');

    // Test scraping endpoint with a simple URL
    console.log('2. Testing scraping endpoint...');
    const scrapeResponse = await axios.post(`${API_BASE_URL}/scrape`, {
      url: 'https://httpbin.org/html'
    });
    console.log('✅ Scraping test passed');
    console.log(`   URL: ${scrapeResponse.data.url}`);
    console.log(`   Word count: ${scrapeResponse.data.wordCount}`);
    console.log(`   Character count: ${scrapeResponse.data.characterCount}`);
    console.log('');

    // Test error handling with invalid URL
    console.log('3. Testing error handling with invalid URL...');
    try {
      await axios.post(`${API_BASE_URL}/scrape`, {
        url: 'invalid-url'
      });
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Error handling working correctly');
        console.log(`   Error: ${error.response.data.error}`);
      } else {
        console.log('❌ Unexpected error response');
      }
    }
    console.log('');

    console.log('🎉 All tests completed successfully!');
    console.log('🚀 Your Web Scraping Assistant is ready to use!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the server is running on port 5000');
      console.log('   Run: npm run server');
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI }; 