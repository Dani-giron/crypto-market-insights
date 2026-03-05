/**
 * CryptoAsset Entity
 * Represents a cryptocurrency asset in the domain
 */

class CryptoAsset {
  constructor({ id, symbol, name, price, change24h }) {
    if (!id || !symbol || !name) {
      throw new Error('CryptoAsset requires id, symbol, and name');
    }

    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
      throw new Error('Price must be a non-negative number');
    }

    this.id = id;
    this.symbol = symbol.toUpperCase();
    this.name = name;
    this.price = price;
    this.change24h = change24h;
  }

  /**
   * Validates the asset data
   * @returns {boolean}
   */
  isValid() {
    return !!(this.id && this.symbol && this.name);
  }

  /**
   * Returns a plain object representation
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      symbol: this.symbol,
      name: this.name,
      price: this.price,
      change24h: this.change24h
    };
  }
}

module.exports = CryptoAsset;
