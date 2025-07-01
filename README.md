# Web Scraping Assistant

A modern, user-friendly web application that allows users to extract and display all textual content from any given URL. Built with Node.js, Express, React, and Powered by Greychain.

## 🚀 Features

- **Clean & Intuitive UI**: Modern, responsive design with Tailwind CSS
- **Real-time Scraping**: Extract content from any public website
- **Content Analysis**: Word count and character count statistics
- **Export Options**: Copy to clipboard or download as text file
- **Error Handling**: Comprehensive error messages and validation
- **Loading States**: Visual feedback during scraping process
- **Security**: Rate limiting, CORS protection, and input validation

## 🛠️ Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Firecrawl** - Web crawling library
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Rate Limiting** - API protection

### Frontend
- **React.js** - User interface library
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Lucide React** - Icon library

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firecrawl API key (get one at [firecrawl.dev](https://firecrawl.dev/))

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd web-scrapping

# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Copy the example environment file
cp env.example .env
```

Edit the `.env` file and add your Firecrawl API key:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Firecrawl API Configuration
# Get your API key from: https://firecrawl.dev/
FIRECRAWL_API_KEY=your-actual-firecrawl-api-key-here
```

### 3. Start the Application

#### Development Mode (Both Backend and Frontend)
```bash
npm run dev
```

#### Production Mode
```bash
# Build the frontend
npm run build

# Start the server
npm start
```

#### Individual Services
```bash
# Backend only
npm run server

# Frontend only
npm run client
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 📖 Usage

1. **Enter URL**: Type or paste a website URL in the input field
2. **Scrape Content**: Click the "Scrape" button to extract content
3. **View Results**: See the extracted text with word/character counts
4. **Export**: Copy to clipboard or download as a text file
5. **Start Over**: Click "New Scrape" to begin again

## 🔧 API Endpoints

### POST `/api/scrape`
Scrapes content from a given URL.

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "url": "https://example.com",
  "content": "Extracted text content...",
  "wordCount": 1500,
  "characterCount": 8500,
  "scrapedAt": "2024-01-01T12:00:00.000Z",
  "success": true
}
```

### GET `/api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "message": "Web Scraping Assistant is running"
}
```

## 🎨 Customization

### Styling
The application uses Tailwind CSS for styling. You can customize the design by:

1. Modifying `client/tailwind.config.js` for theme changes
2. Updating `client/src/index.css` for custom styles
3. Editing component classes in `client/src/App.js`

### Backend Configuration
- Rate limiting settings in `server/index.js`
- CORS configuration for production
- Environment variables in `.env`

## 🧪 Testing

```bash
# Run frontend tests
cd client
npm test

# Test API endpoints
curl -X POST http://localhost:5000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

## 🔒 Security Features

- **Rate Limiting**: Prevents abuse with configurable limits
- **Input Validation**: URL format and content validation
- **CORS Protection**: Configurable cross-origin requests
- **Helmet**: Security headers and protection
- **Error Handling**: Safe error responses without sensitive data

## 🚀 Deployment

### Heroku
1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Deploy using Git integration

### Vercel (Frontend)
1. Connect your GitHub repository
2. Set build command: `cd client && npm install && npm run build`
3. Set output directory: `client/build`

### Railway/Render
1. Connect your repository
2. Set environment variables
3. Deploy automatically

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `FIRECRAWL_API_KEY` | Firecrawl API key | Required |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check the browser console for errors
2. Verify your Firecrawl API key is correct
3. Ensure the target URL is accessible
4. Check the server logs for backend errors

## 🔄 Updates

To update the application:

```bash
# Pull latest changes
git pull origin main

# Update dependencies
npm install
cd client && npm install && cd ..

# Restart the application
npm run dev
```

---

**Note**: This application is for educational and legitimate use only. Always respect website terms of service and robots.txt files when scraping content. 