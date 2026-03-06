/**
 * CoinGeckoAdapter
 * Real implementation of CryptoPriceProvider using CoinGecko API
 * 
 * API Documentation: https://www.coingecko.com/en/api/documentation
 */

const CryptoPriceProvider = require('../../ports/CryptoPriceProvider');
const axios = require('axios');

class CoinGeckoAdapter extends CryptoPriceProvider {
  constructor() {
    super();
    this.baseURL = 'https://api.coingecko.com/api/v3';
    this.timeout = 5000; // 5 seconds timeout
  }

  /**
   * Retrieves current price data for a cryptocurrency
   * @param {string} assetId - The cryptocurrency identifier (e.g., 'bitcoin', 'ethereum')
   * @returns {Promise<Object>} Price data object
   */
  async getPrice(assetId) {
    try {
      const normalizedId = assetId.toLowerCase();
      
      const response = await axios.get(
        `${this.baseURL}/simple/price`,
        {
          params: {
            ids: normalizedId,
            vs_currencies: 'usd',
            include_24hr_change: true
          },
          timeout: this.timeout
        }
      );

      const data = response.data[normalizedId];
      
      if (!data || !data.usd) {
        throw new Error(`Price data not found for ${assetId}`);
      }

      // Map CoinGecko response to our domain format
      return {
        id: normalizedId,
        symbol: this._getSymbolFromId(normalizedId),
        name: this._getNameFromId(normalizedId),
        price: data.usd,
        change24h: data.usd_24h_change || 0
      };
    } catch (error) {
      if (error.response) {
        throw new Error(
          `CoinGecko API error: ${error.response.status} - ${error.response.statusText}`
        );
      } else if (error.request) {
        throw new Error('CoinGecko API request failed - no response received');
      } else {
        throw new Error(`Failed to get price from CoinGecko: ${error.message}`);
      }
    }
  }

  /**
   * Maps CoinGecko ID to symbol
   * @private
   * @param {string} id - CoinGecko asset ID
   * @returns {string} Symbol
   */
  _getSymbolFromId(id) {
    const symbolMap = {
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
    return symbolMap[id] || id.toUpperCase().substring(0, 3);
  }

  /**
   * Maps CoinGecko ID to name
   * @private
   * @param {string} id - CoinGecko asset ID
   * @returns {string} Name
   */
  _getNameFromId(id) {
    const nameMap = {
      bitcoin: 'Bitcoin',
      ethereum: 'Ethereum',
      cardano: 'Cardano',
      'binancecoin': 'Binance Coin',
      solana: 'Solana',
      polkadot: 'Polkadot',
      'matic-network': 'Polygon',
      'avalanche-2': 'Avalanche',
      'chainlink': 'Chainlink',
      'uniswap': 'Uniswap'
    };
    return nameMap[id] || id.charAt(0).toUpperCase() + id.slice(1);
  }
}

module.exports = CoinGeckoAdapter;
