/**
 * SentimentAnalyzer Port (Interface)
 * Defines the contract for sentiment analysis services
 * 
 * This is a port in Hexagonal Architecture - it defines WHAT the system needs,
 * not HOW it's implemented. Implementations are in domain services or adapters.
 */

/**
 * @interface SentimentAnalyzer
 * 
 * @method analyze
 * @param {Array} newsItems - Array of news items to analyze
 * @returns {Object} - Sentiment analysis result
 * @returns {Object.sentiment} - Overall sentiment ('positive', 'neutral', 'negative')
 * @returns {Object.score} - Sentiment score (optional, -1 to 1)
 * @returns {Object.confidence} - Confidence level (optional, 0 to 1)
 * 
 * @throws {Error} If analysis fails
 */
class SentimentAnalyzer {
  /**
   * Analyzes sentiment from news items
   * @abstract
   * @param {Array} newsItems - Array of news items with title/content
   * @returns {Object} Sentiment analysis result
   */
  async analyze(newsItems) {
    throw new Error('analyze() must be implemented by adapter');
  }
}

module.exports = SentimentAnalyzer;
