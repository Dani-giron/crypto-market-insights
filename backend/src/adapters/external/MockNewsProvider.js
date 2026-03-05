/**
 * MockNewsProvider Adapter
 * Mock implementation of NewsProvider for development/testing
 * 
 * This adapter provides mock news data without requiring external API calls.
 */

const NewsProvider = require('../../ports/NewsProvider');

class MockNewsProvider extends NewsProvider {
  /**
   * Mock news templates for generating realistic-looking headlines
   */
  constructor() {
    super();
    this.newsTemplates = {
      bitcoin: [
        { title: 'Bitcoin Reaches New All-Time High Amid Institutional Adoption', sentiment: 'positive' },
        { title: 'Major Bank Announces Bitcoin Trading Services', sentiment: 'positive' },
        { title: 'Bitcoin Network Processes Record Number of Transactions', sentiment: 'positive' },
        { title: 'Regulatory Concerns Surface Over Bitcoin Volatility', sentiment: 'negative' },
        { title: 'Bitcoin Price Stabilizes After Recent Market Correction', sentiment: 'neutral' },
        { title: 'El Salvador Continues Bitcoin Integration Strategy', sentiment: 'positive' },
        { title: 'Bitcoin Mining Energy Consumption Debate Intensifies', sentiment: 'negative' },
        { title: 'New Bitcoin ETF Approval Expected This Quarter', sentiment: 'positive' }
      ],
      ethereum: [
        { title: 'Ethereum 2.0 Upgrade Shows Promising Results', sentiment: 'positive' },
        { title: 'DeFi Projects on Ethereum Reach $50B Total Value Locked', sentiment: 'positive' },
        { title: 'Ethereum Gas Fees Drop to Lowest Level in Months', sentiment: 'positive' },
        { title: 'Ethereum Network Faces Scalability Challenges', sentiment: 'negative' },
        { title: 'Ethereum Price Consolidates Around Key Support Level', sentiment: 'neutral' }
      ]
    };

    this.defaultTemplates = [
      { title: 'Cryptocurrency Market Shows Mixed Signals', sentiment: 'neutral' },
      { title: 'Institutional Investors Increase Crypto Holdings', sentiment: 'positive' },
      { title: 'Regulatory Clarity Needed for Crypto Industry', sentiment: 'neutral' },
      { title: 'Crypto Adoption Continues to Grow Globally', sentiment: 'positive' }
    ];
  }

  /**
   * Retrieves mock news data for a cryptocurrency
   * @param {string} assetId - The cryptocurrency identifier
   * @param {number} limit - Maximum number of news items (default: 10)
   * @returns {Promise<Array>} Array of mock news items
   */
  async getLatest(assetId, limit = 10) {
    const normalizedId = assetId.toLowerCase();
    const templates = this.newsTemplates[normalizedId] || this.defaultTemplates;

    // Generate news items from templates
    const newsItems = [];
    const now = new Date();

    for (let i = 0; i < Math.min(limit, templates.length); i++) {
      const template = templates[i % templates.length];
      const hoursAgo = Math.floor(Math.random() * 48); // Random time within last 48 hours
      const publishedAt = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);

      newsItems.push({
        title: template.title,
        source: this._getRandomSource(),
        publishedAt: publishedAt.toISOString(),
        url: `https://example.com/news/${normalizedId}-${i + 1}`,
        content: `This is mock content for: ${template.title}`
      });
    }

    // Sort by published date (newest first)
    newsItems.sort((a, b) => 
      new Date(b.publishedAt) - new Date(a.publishedAt)
    );

    return newsItems;
  }

  /**
   * Returns a random news source name
   * @private
   * @returns {string}
   */
  _getRandomSource() {
    const sources = [
      'CryptoNews',
      'CoinDesk',
      'CryptoSlate',
      'The Block',
      'Decrypt',
      'CoinTelegraph'
    ];
    return sources[Math.floor(Math.random() * sources.length)];
  }
}

module.exports = MockNewsProvider;
