// Main Express Application
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Swagger UI documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  swaggerOptions: {
    url: '/api-docs/swagger.json'
  }
}));

// Swagger JSON endpoint
app.get('/api-docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDocument);
});

// Import routes
const authRoutes = require('./routes/authRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const healthRoutes = require('./routes/healthRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/healthcheck', healthRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'E-Commerce API',
    version: '1.0.0',
    documentation: 'GET /api-docs',
    endpoints: {
      health: 'GET /api/healthcheck',
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      checkout: 'POST /api/checkout'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`\n🚀 E-Commerce API is running on http://localhost:${PORT}`);
  console.log(`📚 Swagger API Documentation: http://localhost:${PORT}/api-docs\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\nSIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

module.exports = app;
