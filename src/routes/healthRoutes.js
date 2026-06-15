// Health Check Routes
const express = require('express');
const router = express.Router();

/**
 * @route GET /api/healthcheck
 * @description Check API health status
 * @returns {object} Health status
 */
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'API is running successfully',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
