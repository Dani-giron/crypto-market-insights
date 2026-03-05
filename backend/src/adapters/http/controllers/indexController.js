/**
 * Index controller
 * Handles basic API status and information endpoints
 */

const getStatus = (req, res) => {
  res.json({
    message: 'Crypto Market Insights API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  getStatus
};
