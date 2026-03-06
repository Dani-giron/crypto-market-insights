/**
 * CryptoPanicAdapter
 * Real implementation of NewsProvider using CryptoPanic API
 * 
 * API Documentation: https://cryptopanic.com/developers/api/
 * Note: Free tier requires API key, but we'll handle it gracefully
 */

const NewsProvider = require('../../ports/NewsProvider');
const axios = require('axios');
const config = require('../../infrastructure/config');

class CryptoPanicAdapter extends NewsProvider {
  constructor() {
    super();
    // CryptoPanic API v2 - Developer endpoint
    this.baseURL = 'https://cryptopanic.com/api/developer/v2';
    // Load API key from config (which loads from .env)
    this.apiKey = config.cryptopanicApiKey || process.env.CRYPTOPANIC_API_KEY || null;
    this.timeout = 5000; // 5 seconds timeout
    
    // Debug: log if API key is missing (only in development)
    if (!this.apiKey && process.env.NODE_ENV !== 'production') {
      console.warn('⚠️  CryptoPanic API key not found. Set CRYPTOPANIC_API_KEY in .env or use USE_MOCK_PROVIDERS=true');
    }
  }

  /**
   * Retrieves latest news/headlines for a cryptocurrency
   * @param {string} assetId - The cryptocurrency identifier (e.g., 'bitcoin')
   * @param {number} limit - Maximum number of items to retrieve (default: 10)
   * @returns {Promise<Array>} Array of news items
   */
  async getLatest(assetId, limit = 10) {
    try {
      // CryptoPanic requires API key even for free tier
      if (!this.apiKey) {
        throw new Error('CryptoPanic API key is required. Please set CRYPTOPANIC_API_KEY in your .env file or use USE_MOCK_PROVIDERS=true for development.');
      }

      // CryptoPanic uses currency codes (BTC, ETH, etc.)
      const currencyCode = this._getCurrencyCode(assetId);
      
      // According to CryptoPanic API v2 docs:
      // Format: https://cryptopanic.com/api/developer/v2/posts/?auth_token=YOUR_KEY&currencies=BTC&public=true&kind=news
      const params = new URLSearchParams({
        auth_token: this.apiKey,
        currencies: currencyCode,
        public: 'true', // Public mode for generic apps
        kind: 'news' // Filter by news only
      });
      
      const url = `${this.baseURL}/posts/?${params.toString()}`;

      // Debug log in development
      if (process.env.NODE_ENV !== 'production') {
        console.log(`🔍 CryptoPanic API v2 request: ${this.baseURL}/posts/?auth_token=***&currencies=${currencyCode}&public=true&kind=news`);
        console.log(`   Full URL (masked): ${url.replace(this.apiKey, '***')}`);
      }

      const response = await axios.get(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'CryptoMarketInsights/1.0'
        },
        timeout: this.timeout,
        validateStatus: function (status) {
          return status < 500; // Don't throw for 4xx errors, we'll handle them
        }
      });

      // Check if response is HTML (error page) instead of JSON
      if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
        throw new Error('CryptoPanic API returned HTML instead of JSON. This usually means the API endpoint format has changed or the API key is invalid. Please check the CryptoPanic API documentation.');
      }

      // Check if response has the expected structure
      if (!response.data || typeof response.data !== 'object') {
        throw new Error(`CryptoPanic API returned unexpected response format: ${typeof response.data}`);
      }

      const results = response.data.results || [];
      
      // Map CryptoPanic API v2 response to our domain format
      return results
        .slice(0, limit)
        .map((item, index) => ({
          id: item.id ? `cryptopanic-${item.id}` : `${assetId}-${index + 1}`,
          title: item.title || 'Untitled',
          source: item.source?.title || 'CryptoPanic',
          publishedAt: item.published_at || item.created_at || new Date().toISOString(),
          url: item.original_url || item.url || `https://cryptopanic.com/news/${item.slug || item.id}/`,
          content: item.description || item.title || '' // Use description if available
        }));
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const statusText = error.response.statusText;
        const errorData = error.response.data;
        const requestUrl = error.config?.url || 'unknown';
        
        // Log full error details in development
        if (process.env.NODE_ENV !== 'production') {
          console.error('❌ CryptoPanic API Error Details:');
          console.error(`   Status: ${status} ${statusText}`);
          console.error(`   URL: ${requestUrl}`);
          console.error(`   Params:`, error.config?.params);
          console.error(`   Response:`, errorData);
        }
        
        // Check if response is HTML (CryptoPanic returns HTML error pages)
        const isHtmlResponse = typeof errorData === 'string' && errorData.includes('<!DOCTYPE html>');
        
        if (status === 404 || isHtmlResponse) {
          const suggestion = isHtmlResponse 
            ? '\n\n💡 Tip: CryptoPanic API is returning HTML instead of JSON. This usually means:\n' +
              '   - The API key is invalid or expired\n' +
              '   - The API endpoint format has changed\n' +
              '   - CryptoPanic requires web authentication first\n\n' +
              '   Solution: Set USE_MOCK_PROVIDERS=true in backend/.env to use mock data for development.'
            : '\n\n💡 Tip: Set USE_MOCK_PROVIDERS=true in backend/.env to use mock data for development.';
          
          throw new Error(
            `CryptoPanic API error: 404 - Not Found. The API endpoint may have changed or the API key format is incorrect.${suggestion}`
          );
        } else if (status === 401) {
          throw new Error(
            `CryptoPanic API error: 401 - Unauthorized. Please check your API key is correct.`
          );
        } else {
          throw new Error(
            `CryptoPanic API error: ${status} - ${statusText}. ${errorData?.message || JSON.stringify(errorData)}`
          );
        }
      } else if (error.request) {
        throw new Error('CryptoPanic API request failed - no response received');
      } else {
        throw new Error(`Failed to get news from CryptoPanic: ${error.message}`);
      }
    }
  }

  /**
   * Maps asset ID to CryptoPanic currency code
   * @private
   * @param {string} assetId - Asset identifier
   * @returns {string} Currency code
   */
  _getCurrencyCode(assetId) {
    const codeMap = {
      bitcoin: 'BTC',
      ethereum: 'ETH',
      cardano: 'ADA',
      'binancecoin': 'BNB',
      solana: 'SOL',
      polkadot: 'DOT',
      'matic-network': 'MATIC',
      'avalanche-2': 'AVAX',
      'chainlink': 'LINK',
      'uniswap': 'UNI'
    };
    
    const normalizedId = assetId.toLowerCase();
    return codeMap[normalizedId] || normalizedId.toUpperCase().substring(0, 3);
  }
}

module.exports = CryptoPanicAdapter;
