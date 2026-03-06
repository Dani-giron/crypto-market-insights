/**
 * Express application setup
 * Configures the main Express app instance
 */

const express = require('express');
const { apiReference } = require('@scalar/express-api-reference');
const path = require('path');
const fs = require('fs');
const errorHandler = require('./infrastructure/middleware/errorHandler');

// Routes
const indexRoutes = require('./adapters/http/routes/index');
const cryptoRoutes = require('./adapters/http/routes/crypto');

const app = express();

// Middleware for parsing JSON bodies
app.use(express.json());

// Middleware for parsing URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Load OpenAPI spec file
const openApiPath = path.join(__dirname, '../docs/openapi.yaml');
const openApiSpec = fs.readFileSync(openApiPath, 'utf8');

// Serve OpenAPI spec file
app.get('/docs/openapi.yaml', (req, res) => {
  res.setHeader('Content-Type', 'text/yaml');
  res.send(openApiSpec);
});

// API Documentation with Scalar
app.use(
  '/docs',
  apiReference({
    theme: 'purple',
    content: openApiSpec,
  })
);

// Routes
app.use('/', indexRoutes);
app.use('/api/crypto', cryptoRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
