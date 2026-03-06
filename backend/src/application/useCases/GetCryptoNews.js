/**
 * GetCryptoNews Use Case
 * Retrieves news headlines for a cryptocurrency
 * 
 * This use case demonstrates the NewsProvider port usage.
 */

class GetCryptoNews {
  /**
   * @param {NewsProvider} newsProvider - Provider for news data
   */
  constructor(newsProvider) {
    if (!newsProvider) {
      throw new Error('newsProvider is required');
    }

    this.newsProvider = newsProvider;
  }

  /**
   * Executes the use case to get news for a cryptocurrency
   * @param {string} assetId - The cryptocurrency identifier (e.g., 'bitcoin')
   * @param {Object} options - Optional parameters
   * @param {number} options.limit - Maximum number of news items (default: 10)
   * @returns {Promise<Object>} News data
   * @returns {Promise<Object.asset>} Asset identifier
   * @returns {Promise<Object.headlines>} Array of news headlines
   */
  async execute(assetId, options = {}) {
    if (!assetId) {
      throw new Error('assetId is required');
    }

    const { limit = 10 } = options;

    try {
      // Get news data
      const newsItems = await this.newsProvider.getLatest(assetId, limit);

      // Return formatted response
      const timestamp = new Date().toISOString();
      
      return {
        asset: assetId,
        headlines: newsItems.map((item, index) => ({
          id: item.id || `${assetId}-${index + 1}`,
          title: item.title,
          source: item.source,
          publishedAt: item.publishedAt,
          url: item.url,
          sentiment: item.sentiment || 'neutral'
        })),
        meta: {
          newsCount: newsItems.length
        },
        timestamp
      };
    } catch (error) {
      // Re-throw with context
      throw new Error(
        `Failed to get news for ${assetId}: ${error.message}`
      );
    }
  }
}

module.exports = GetCryptoNews;
