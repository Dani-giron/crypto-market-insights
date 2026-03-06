/**
 * AnalyzeCryptoSentiment Use Case
 * Analyzes sentiment for a cryptocurrency based on news
 * 
 * This use case demonstrates pure domain service usage.
 */

class AnalyzeCryptoSentiment {
  /**
   * @param {NewsProvider} newsProvider - Provider for news data
   * @param {SentimentAnalyzer} sentimentAnalyzer - Service for sentiment analysis
   */
  constructor(newsProvider, sentimentAnalyzer) {
    if (!newsProvider) {
      throw new Error('newsProvider is required');
    }
    if (!sentimentAnalyzer) {
      throw new Error('sentimentAnalyzer is required');
    }

    this.newsProvider = newsProvider;
    this.sentimentAnalyzer = sentimentAnalyzer;
  }

  /**
   * Executes the use case to analyze sentiment
   * @param {string} assetId - The cryptocurrency identifier (e.g., 'bitcoin')
   * @param {Object} options - Optional parameters
   * @param {number} options.newsLimit - Maximum number of news items to analyze (default: 20)
   * @returns {Promise<Object>} Sentiment analysis result
   * @returns {Promise<Object.asset>} Asset identifier
   * @returns {Promise<Object.sentiment>} Sentiment analysis result
   */
  async execute(assetId, options = {}) {
    if (!assetId) {
      throw new Error('assetId is required');
    }

    const { newsLimit = 20 } = options;

    try {
      // Get news data
      const newsItems = await this.newsProvider.getLatest(assetId, newsLimit);

      // Analyze sentiment
      const sentimentResult = await this.sentimentAnalyzer.analyze(newsItems);

      // Return formatted response
      return {
        asset: assetId,
        sentiment: {
          value: sentimentResult.sentiment.toString(),
          score: sentimentResult.score,
          confidence: sentimentResult.confidence
        },
        newsAnalyzed: newsItems.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      // Re-throw with context
      throw new Error(
        `Failed to analyze sentiment for ${assetId}: ${error.message}`
      );
    }
  }
}

module.exports = AnalyzeCryptoSentiment;
