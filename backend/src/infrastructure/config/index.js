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
  // Add more configuration as needed
};
