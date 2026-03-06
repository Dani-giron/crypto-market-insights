/**
 * Crypto routes
 * Routes for cryptocurrency-related endpoints
 */

const express = require('express');
const router = express.Router();
const cryptoController = require('../controllers/cryptoController');

// GET /api/crypto/:assetId/context - Get complete market context
router.get('/:assetId/context', cryptoController.getMarketContext);

// GET /api/crypto/:assetId/news - Get news headlines
router.get('/:assetId/news', cryptoController.getCryptoNews);

// GET /api/crypto/:assetId/sentiment - Analyze sentiment
router.get('/:assetId/sentiment', cryptoController.getCryptoSentiment);

module.exports = router;
