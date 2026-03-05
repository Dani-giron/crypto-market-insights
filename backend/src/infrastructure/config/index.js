/**
 * Configuration file
 * Manages environment variables and app configuration
 */

require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  // Add more configuration as needed
};
