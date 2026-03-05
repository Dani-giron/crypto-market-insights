/**
 * NewsProvider Port (Interface)
 * Defines the contract for news/headlines data providers
 * 
 * This is a port in Hexagonal Architecture - it defines WHAT the system needs,
 * not HOW it's implemented. Implementations are in adapters.
 */

/**
 * @interface NewsProvider
 * 
 * @method getLatest
 * @param {string} assetId - The cryptocurrency identifier (e.g., 'bitcoin')
 * @param {number} limit - Maximum number of news items to retrieve
 * @returns {Promise<Array>} - Promise resolving to array of news items
 * @returns {Promise<Array[].title>} - News headline/title
 * @returns {Promise<Array[].source>} - News source
 * @returns {Promise<Array[].publishedAt>} - Publication timestamp
 * @returns {Promise<Array[].url>} - News article URL (optional)
 * 
 * @throws {Error} If API call fails
 */
class NewsProvider {
  /**
   * Retrieves latest news/headlines for a cryptocurrency
   * @abstract
   * @param {string} assetId - The cryptocurrency identifier
   * @param {number} limit - Maximum number of items to retrieve (default: 10)
   * @returns {Promise<Array>} Array of news items
   */
  async getLatest(assetId, limit = 10) {
    throw new Error('getLatest() must be implemented by adapter');
  }
}

module.exports = NewsProvider;
