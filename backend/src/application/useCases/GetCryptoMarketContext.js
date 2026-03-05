/**
 * GetCryptoMarketContext Use Case
 * Orchestrates the retrieval and combination of crypto market data and sentiment
 * 
 * This is an application use case - it coordinates domain services and adapters
 * to fulfill a business requirement.
 */

const CryptoAsset = require('../../domain/entities/CryptoAsset');

class GetCryptoMarketContext {
  /**
   * @param {CryptoPriceProvider} priceProvider - Provider for price data
   * @param {NewsProvider} newsProvider - Provider for news data
   * @param {SentimentAnalyzer} sentimentAnalyzer - Service for sentiment analysis
   */
  constructor(priceProvider, newsProvider, sentimentAnalyzer) {
    if (!priceProvider) {
      throw new Error('priceProvider is required');
    }
    if (!newsProvider) {
      throw new Error('newsProvider is required');
    }
    if (!sentimentAnalyzer) {
      throw new Error('sentimentAnalyzer is required');
    }

    this.priceProvider = priceProvider;
    this.newsProvider = newsProvider;
    this.sentimentAnalyzer = sentimentAnalyzer;
  }

  /**
   * Executes the use case to get complete market context
   * @param {string} assetId - The cryptocurrency identifier (e.g., 'bitcoin')
   * @param {Object} options - Optional parameters
   * @param {number} options.newsLimit - Maximum number of news items (default: 10)
   * @returns {Promise<Object>} Complete market context
   * @returns {Promise<Object.asset>} CryptoAsset entity
   * @returns {Promise<Object.sentiment>} Sentiment analysis result
   * @returns {Promise<Object.headlines>} Array of news headlines
   */
  async execute(assetId, options = {}) {
    if (!assetId) {
      throw new Error('assetId is required');
    }

    const { newsLimit = 10 } = options;

    try {
      // 1. Get price data
      const priceData = await this.priceProvider.getPrice(assetId);
      
      // 2. Get news data
      const newsItems = await this.newsProvider.getLatest(assetId, newsLimit);

      // 3. Analyze sentiment
      const sentimentResult = await this.sentimentAnalyzer.analyze(newsItems);

      // 4. Create domain entity
      const asset = new CryptoAsset({
        id: priceData.id,
        symbol: priceData.symbol,
        name: priceData.name,
        price: priceData.price,
        change24h: priceData.change24h
      });

      // 5. Return complete context
      return {
        asset: asset.toJSON(),
        sentiment: {
          value: sentimentResult.sentiment.toString(),
          score: sentimentResult.score,
          confidence: sentimentResult.confidence
        },
        headlines: newsItems.map(item => ({
          title: item.title,
          source: item.source,
          publishedAt: item.publishedAt,
          url: item.url
        })),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      // Re-throw with context
      throw new Error(
        `Failed to get market context for ${assetId}: ${error.message}`
      );
    }
  }
}

module.exports = GetCryptoMarketContext;
