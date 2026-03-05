/**
 * Main routes
 * Root API routes
 */

const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

// GET / - API status
router.get('/', indexController.getStatus);

module.exports = router;
