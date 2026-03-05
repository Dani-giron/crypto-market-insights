/**
 * SentimentScore Value Object
 * Represents a sentiment classification for news/analysis
 */

const VALID_SENTIMENTS = ['positive', 'neutral', 'negative'];

class SentimentScore {
  constructor(value) {
    if (!VALID_SENTIMENTS.includes(value)) {
      throw new Error(
        `Invalid sentiment value. Must be one of: ${VALID_SENTIMENTS.join(', ')}`
      );
    }

    this.value = value;
  }

  /**
   * Creates a positive sentiment
   * @returns {SentimentScore}
   */
  static positive() {
    return new SentimentScore('positive');
  }

  /**
   * Creates a neutral sentiment
   * @returns {SentimentScore}
   */
  static neutral() {
    return new SentimentScore('neutral');
  }

  /**
   * Creates a negative sentiment
   * @returns {SentimentScore}
   */
  static negative() {
    return new SentimentScore('negative');
  }

  /**
   * Checks if sentiment is positive
   * @returns {boolean}
   */
  isPositive() {
    return this.value === 'positive';
  }

  /**
   * Checks if sentiment is negative
   * @returns {boolean}
   */
  isNegative() {
    return this.value === 'negative';
  }

  /**
   * Checks if sentiment is neutral
   * @returns {boolean}
   */
  isNeutral() {
    return this.value === 'neutral';
  }

  /**
   * Returns the string value
   * @returns {string}
   */
  toString() {
    return this.value;
  }

  /**
   * Returns a plain object representation
   * @returns {Object}
   */
  toJSON() {
    return {
      value: this.value
    };
  }
}

module.exports = SentimentScore;
