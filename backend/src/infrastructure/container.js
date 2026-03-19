/**
 * Dependency Injection Container
 * Configures and wires up all dependencies for the application
 * 
 * This container follows the Dependency Inversion Principle by:
 * 1. Instantiating adapters (implementations)
 * 2. Instantiating domain services
 * 3. Injecting dependencies into use cases
 * 4. Exporting configured use cases
 */

const config = require('./config');
const MockPriceProvider = require('../adapters/external/MockPriceProvider');
const MockNewsProvider = require('../adapters/external/MockNewsProvider');
const CoinGeckoAdapter = require('../adapters/external/CoinGeckoAdapter');
const RSSNewsAdapter = require('../adapters/external/RSSNewsAdapter');
const SentimentAnalyzer = require('../domain/services/SentimentAnalyzer');
const GetCryptoMarketContext = require('../application/useCases/GetCryptoMarketContext');
const GetCryptoNews = require('../application/useCases/GetCryptoNews');
const AnalyzeCryptoSentiment = require('../application/useCases/AnalyzeCryptoSentiment');

/**
 * Creates and configures the dependency injection container
 * @returns {Object} Container with configured use cases
 */
function createContainer() {
  // 1. Instantiate adapters (external dependencies)
  // Use real APIs by default, mocks if USE_MOCK_PROVIDERS=true or specific flags
  const priceProvider = (config.useMockProviders || config.useMockPriceProvider)
    ? new MockPriceProvider()
    : new CoinGeckoAdapter();
    
  const newsProvider = (config.useMockProviders || config.useMockNewsProvider)
    ? new MockNewsProvider()
    : new RSSNewsAdapter();

  // 2. Instantiate domain services
  const sentimentAnalyzer = new SentimentAnalyzer();

  // 3. Instantiate use cases with dependency injection
  const getCryptoMarketContext = new GetCryptoMarketContext(
    priceProvider,
    newsProvider,
    sentimentAnalyzer
  );

  const getCryptoNews = new GetCryptoNews(newsProvider);

  const analyzeCryptoSentiment = new AnalyzeCryptoSentiment(
    newsProvider,
    sentimentAnalyzer
  );

  // 4. Export configured use cases
  return {
    getCryptoMarketContext,
    getCryptoNews,
    analyzeCryptoSentiment
  };
}

// Create and export the container
const container = createContainer();

module.exports = container;
