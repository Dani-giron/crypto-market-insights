/**
 * Crypto Controller
 * HTTP adapter for cryptocurrency-related endpoints
 * 
 * This controller adapts HTTP requests/responses to use cases.
 * It's part of the HTTP adapter layer in Hexagonal Architecture.
 */

const container = require('../../../infrastructure/container');

/**
 * Get market context for a cryptocurrency
 * GET /api/crypto/:assetId/context
 */
const getMarketContext = async (req, res, next) => {
  try {
    const { assetId } = req.params;
    const { limit } = req.query;

    const options = {
      newsLimit: limit ? parseInt(limit, 10) : 10
    };

    const context = await container.getCryptoMarketContext.execute(assetId, options);

    res.json({
      success: true,
      data: context
    });
  } catch (error) {
    // Pass error to error handling middleware
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

/**
 * Get news for a cryptocurrency
 * GET /api/crypto/:assetId/news
 */
const getCryptoNews = async (req, res, next) => {
  try {
    const { assetId } = req.params;
    const { limit } = req.query;

    const options = {
      limit: limit ? parseInt(limit, 10) : 10
    };

    const news = await container.getCryptoNews.execute(assetId, options);

    res.json({
      success: true,
      data: news
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

/**
 * Analyze sentiment for a cryptocurrency
 * GET /api/crypto/:assetId/sentiment
 */
const getCryptoSentiment = async (req, res, next) => {
  try {
    const { assetId } = req.params;
    const { limit } = req.query;

    const options = {
      newsLimit: limit ? parseInt(limit, 10) : 20
    };

    const sentiment = await container.analyzeCryptoSentiment.execute(assetId, options);

    res.json({
      success: true,
      data: sentiment
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

module.exports = {
  getMarketContext,
  getCryptoNews,
  getCryptoSentiment
};
