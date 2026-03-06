/**
 * CryptoPanicAdapter
 * Real implementation of NewsProvider using CryptoPanic API
 * 
 * API Documentation: https://cryptopanic.com/developers/api/
 * Note: Free tier requires API key, but we'll handle it gracefully
 */

const NewsProvider = require('../../ports/NewsProvider');
const axios = require('axios');

class CryptoPanicAdapter extends NewsProvider {
  constructor() {
    super();
    this.baseURL = 'https://cryptopanic.com/api/v1';
    this.apiKey = process.env.CRYPTOPANIC_API_KEY || null;
    this.timeout = 5000; // 5 seconds timeout
  }

  /**
   * Retrieves latest news/headlines for a cryptocurrency
   * @param {string} assetId - The cryptocurrency identifier (e.g., 'bitcoin')
   * @param {number} limit - Maximum number of items to retrieve (default: 10)
   * @returns {Promise<Array>} Array of news items
   */
  async getLatest(assetId, limit = 10) {
    try {
      // CryptoPanic uses currency codes (BTC, ETH, etc.)
      const currencyCode = this._getCurrencyCode(assetId);
      
      const params = {
        currencies: currencyCode,
        public: true, // Use public API (no auth required for basic access)
        page: 1
      };

      // Add API key if available (for higher rate limits)
      if (this.apiKey) {
        params.auth_token = this.apiKey;
      }

      const response = await axios.get(
        `${this.baseURL}/posts/`,
        {
          params,
          timeout: this.timeout
        }
      );

      const results = response.data.results || [];
      
      // Map CryptoPanic response to our domain format
      return results
        .slice(0, limit)
        .map((item, index) => ({
          id: `${assetId}-${index + 1}`,
          title: item.title || 'Untitled',
          source: item.source?.title || 'CryptoPanic',
          publishedAt: item.published_at || new Date().toISOString(),
          url: item.url || `https://cryptopanic.com/news/${item.id}/`,
          content: item.title || '' // CryptoPanic doesn't provide full content in free tier
        }));
    } catch (error) {
      if (error.response) {
        throw new Error(
          `CryptoPanic API error: ${error.response.status} - ${error.response.statusText}`
        );
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
