/**
 * CryptoPriceProvider Port (Interface)
 * Defines the contract for cryptocurrency price data providers
 * 
 * This is a port in Hexagonal Architecture - it defines WHAT the system needs,
 * not HOW it's implemented. Implementations are in adapters.
 */

/**
 * @interface CryptoPriceProvider
 * 
 * @method getPrice
 * @param {string} assetId - The cryptocurrency identifier (e.g., 'bitcoin', 'ethereum')
 * @returns {Promise<Object>} - Promise resolving to price data
 * @returns {Promise<Object.id>} - Asset identifier
 * @returns {Promise<Object.symbol>} - Asset symbol (e.g., 'BTC')
 * @returns {Promise<Object.name>} - Asset name (e.g., 'Bitcoin')
 * @returns {Promise<Object.price>} - Current price in USD
 * @returns {Promise<Object.change24h>} - 24h price change percentage
 * 
 * @throws {Error} If asset is not found or API call fails
 */
class CryptoPriceProvider {
  /**
   * Retrieves current price data for a cryptocurrency
   * @abstract
   * @param {string} assetId - The cryptocurrency identifier
   * @returns {Promise<Object>} Price data object
   */
  async getPrice(assetId) {
    throw new Error('getPrice() must be implemented by adapter');
  }
}

module.exports = CryptoPriceProvider;
