/**
 * MockPriceProvider Adapter
 * Mock implementation of CryptoPriceProvider for development/testing
 * 
 * This adapter provides mock data without requiring external API calls.
 */

const CryptoPriceProvider = require('../../ports/CryptoPriceProvider');

class MockPriceProvider extends CryptoPriceProvider {
  /**
   * Mock price data for common cryptocurrencies
   */
  constructor() {
    super();
    this.mockData = {
      bitcoin: {
        id: 'bitcoin',
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 43250.50,
        change24h: 2.45
      },
      ethereum: {
        id: 'ethereum',
        symbol: 'ETH',
        name: 'Ethereum',
        price: 2650.75,
        change24h: -1.23
      },
      'cardano': {
        id: 'cardano',
        symbol: 'ADA',
        name: 'Cardano',
        price: 0.52,
        change24h: 5.67
      }
    };
  }

  /**
   * Retrieves mock price data for a cryptocurrency
   * @param {string} assetId - The cryptocurrency identifier
   * @returns {Promise<Object>} Mock price data
   */
  async getPrice(assetId) {
    const normalizedId = assetId.toLowerCase();
    
    if (!this.mockData[normalizedId]) {
      // Return default mock data for unknown assets
      return {
        id: normalizedId,
        symbol: normalizedId.toUpperCase().substring(0, 3),
        name: normalizedId.charAt(0).toUpperCase() + normalizedId.slice(1),
        price: 100.00,
        change24h: 0.00
      };
    }

    // Simulate slight price variation for realism
    const baseData = { ...this.mockData[normalizedId] };
    const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
    baseData.price = baseData.price * (1 + variation);

    return baseData;
  }
}

module.exports = MockPriceProvider;
