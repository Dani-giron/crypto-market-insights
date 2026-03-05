/**
 * Crypto routes
 * Routes for cryptocurrency-related endpoints
 */

const express = require('express');
const router = express.Router();
const cryptoController = require('../controllers/cryptoController');

// GET /api/crypto/:assetId/context - Get complete market context
router.get('/:assetId/context', cryptoController.getMarketContext);

module.exports = router;
