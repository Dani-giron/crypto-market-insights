/**
 * Express application setup
 * Configures the main Express app instance
 */

const express = require('express');
const errorHandler = require('./infrastructure/middleware/errorHandler');

// Routes
const indexRoutes = require('./adapters/http/routes/index');
const cryptoRoutes = require('./adapters/http/routes/crypto');

const app = express();

// Middleware for parsing JSON bodies
app.use(express.json());

// Middleware for parsing URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', indexRoutes);
app.use('/api/crypto', cryptoRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
