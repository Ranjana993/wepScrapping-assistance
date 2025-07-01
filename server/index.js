const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const FirecrawlApp = require('@mendable/firecrawl-js').default;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize Firecrawl
const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY || 'your-api-key-here'
});
console.log("firecrawl=========",firecrawl)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Web Scraping Assistant is running' });
});

// Main scraping endpoint
app.post('/api/scrape', async (req, res) => {
  try {
    const { url } = req.body;

    // Validate URL
    if (!url) {
      return res.status(400).json({ 
        error: 'URL is required',
        message: 'Please provide a valid URL to scrape'
      });
    }

    // Basic URL validation
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(url)) {
      return res.status(400).json({ 
        error: 'Invalid URL format',
        message: 'Please provide a valid URL starting with http:// or https://'
      });
    }

    console.log(`Scraping and crawling URL: ${url}`);

    const crawlResult = await firecrawl.crawlUrl(
      url,
      {
        limit: 5 // Number of pages to crawl (main + sub-links)
      }
    );

    console.log('crawlResult:', JSON.stringify(crawlResult, null, 2));

    let allContent = '';
    if (Array.isArray(crawlResult.data) && crawlResult.data.length > 0) {
      for (const page of crawlResult.data) {
        allContent += `\n\n---\n\n# ${page.metadata?.url || page.url}\n\n`;
        allContent += page.markdown || page.text || page.html || '';
      }
    } else if (crawlResult.markdown || crawlResult.text || crawlResult.html) {
      allContent += crawlResult.markdown || crawlResult.text || crawlResult.html;
    } else if (crawlResult.error) {
      throw new Error('Firecrawl error: ' + crawlResult.error);
    }

    if (!allContent.trim()) {
      throw new Error('No data received from Firecrawl');
    }

    const responseData = {
      url: url,
      content: allContent.trim(),
      wordCount: allContent.trim().split(/\s+/).length,
      characterCount: allContent.trim().length,
      scrapedAt: new Date().toISOString(),
      success: true
    };

    console.log(`Successfully scraped and crawled ${url} - ${responseData.wordCount} words`);
    res.json(responseData);

  } catch (error) {
    console.error('Scraping error:', error);
    
    let errorMessage = 'Failed to scrape the URL';
    let statusCode = 500;

    if (error.message.includes('404')) {
      errorMessage = 'Page not found (404)';
      statusCode = 404;
    } else if (error.message.includes('403')) {
      errorMessage = 'Access forbidden (403)';
      statusCode = 403;
    } else if (error.message.includes('timeout')) {
      errorMessage = 'Request timeout - the page took too long to load';
      statusCode = 408;
    } else if (error.message.includes('network')) {
      errorMessage = 'Network error - please check your internet connection';
      statusCode = 503;
    }

    if (error.details && Array.isArray(error.details)) {
      return res.status(400).json({
        error: 'Invalid URL',
        message: error.details.map(d => d.message).join('; ')
      });
    }

    res.status(statusCode).json({
      error: errorMessage,
      message: 'Please try again with a different URL or check if the URL is accessible',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong on our end. Please try again later.'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: 'The requested endpoint does not exist'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Web Scraping Assistant server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
}); 