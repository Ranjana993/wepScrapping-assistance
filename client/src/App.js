import React, { useState } from 'react';
import { Globe, Download, Copy, CheckCircle, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import axios from 'axios';

function App() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    // Basic URL validation
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(url)) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post('/api/scrape', { url: url.trim() });
      setResult(response.data);
    } catch (err) {
      console.error('Scraping error:', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to scrape the URL. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (result?.content) {
      try {
        await navigator.clipboard.writeText(result.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    }
  };

  const downloadText = () => {
    if (result?.content) {
      const blob = new Blob([result.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scraped-content-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const clearResults = () => {
    setResult(null);
    setError(null);
    setUrl('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Globe className="h-12 w-12 text-primary-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Web Scraping Assistant</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Extract and display all textual content from any website with our clean and intuitive interface.
            Simply enter a URL and get the content instantly.
          </p>
        </div>

        {/* Main Form */}
        <div className="max-w-4xl mx-auto">
          <div className="card mb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                  Website URL
                </label>
                <div className="flex gap-3">
                  <input
                    type="url"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="input-field flex-1"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !url.trim()}
                    className="btn-primary flex items-center gap-2 min-w-[120px]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Scraping...
                      </>
                    ) : (
                      <>
                        <Globe className="h-5 w-5" />
                        Scrape
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="card text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Scraping in Progress</h3>
              <p className="text-gray-600">Please wait while we extract content from the website...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="card border-error-200 bg-error-50">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-error-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-error-800 mb-2">Error</h3>
                  <p className="text-error-700 mb-4">{error}</p>
                  <button
                    onClick={clearResults}
                    className="btn-secondary"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-6">
              {/* Result Header */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-success-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Scraping Complete</h2>
                  </div>
                  <button
                    onClick={clearResults}
                    className="btn-secondary"
                  >
                    New Scrape
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600">Source URL</div>
                    <div className="text-sm font-medium text-gray-900 truncate">
                      <a 
                        href={result.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 flex items-center gap-1"
                      >
                        {result.url}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600">Word Count</div>
                    <div className="text-lg font-semibold text-gray-900">{result.wordCount.toLocaleString()}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600">Character Count</div>
                    <div className="text-lg font-semibold text-gray-900">{result.characterCount.toLocaleString()}</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={copyToClipboard}
                    className="btn-secondary flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy Text
                      </>
                    )}
                  </button>
                  <button
                    onClick={downloadText}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
              </div>

              {/* Content Display */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Extracted Content</h3>
                <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto custom-scrollbar">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed">
                    {result.content}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          {!result && !error && !isLoading && (
            <div className="card bg-blue-50 border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Use</h3>
              <div className="space-y-2 text-blue-800">
                <p>• Enter any website URL in the input field above</p>
                <p>• Click the "Scrape" button to extract content</p>
                <p>• View, copy, or download the extracted text</p>
                <p>• The tool works with most public websites</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-500">
          <p>Web Scraping Assistant - Powered by Greychain</p>
        </footer>
      </div>
    </div>
  );
}

export default App; 