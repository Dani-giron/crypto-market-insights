/**
 * Express application setup
 * Configures the main Express app instance
 */

const express = require('express');

const app = express();

// Middleware for parsing JSON bodies
app.use(express.json());

// Middleware for parsing URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

module.exports = app;
