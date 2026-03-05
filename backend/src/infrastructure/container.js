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

const MockPriceProvider = require('../adapters/external/MockPriceProvider');
const MockNewsProvider = require('../adapters/external/MockNewsProvider');
const SentimentAnalyzer = require('../domain/services/SentimentAnalyzer');
const GetCryptoMarketContext = require('../application/useCases/GetCryptoMarketContext');

/**
 * Creates and configures the dependency injection container
 * @returns {Object} Container with configured use cases
 */
function createContainer() {
  // 1. Instantiate adapters (external dependencies)
  const priceProvider = new MockPriceProvider();
  const newsProvider = new MockNewsProvider();

  // 2. Instantiate domain services
  const sentimentAnalyzer = new SentimentAnalyzer();

  // 3. Instantiate use cases with dependency injection
  const getCryptoMarketContext = new GetCryptoMarketContext(
    priceProvider,
    newsProvider,
    sentimentAnalyzer
  );

  // 4. Export configured use cases
  return {
    getCryptoMarketContext
  };
}

// Create and export the container
const container = createContainer();

module.exports = container;
