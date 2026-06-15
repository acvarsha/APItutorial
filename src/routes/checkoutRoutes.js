// Checkout Routes
const express = require('express');
const router = express.Router();
const CheckoutController = require('../controllers/CheckoutController');
const authenticateToken = require('../middleware/auth');

/**
 * @route POST /api/checkout
 * @description Checkout order (requires authentication)
 * @param {array} items - Array of items with productId and quantity
 * @param {string} paymentMethod - Payment method (cash or credit_card)
 * @returns {object} Order details with pricing
 */
router.post('/', authenticateToken, CheckoutController.checkout);

module.exports = router;
