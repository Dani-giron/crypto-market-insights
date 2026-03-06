/**
 * Configuration file
 * Manages environment variables and app configuration
 */

require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  // API Keys (optional - APIs work without them but with rate limits)
  cryptopanicApiKey: process.env.CRYPTOPANIC_API_KEY || null,
  // Feature flags
  useMockProviders: process.env.USE_MOCK_PROVIDERS === 'true' || false,
  useMockPriceProvider: process.env.USE_MOCK_PRICE_PROVIDER === 'true' || false,
  useMockNewsProvider: process.env.USE_MOCK_NEWS_PROVIDER === 'true' || false,
  // Add more configuration as needed
};
