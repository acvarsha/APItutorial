// Checkout Controller
const CheckoutService = require('../services/CheckoutService');

class CheckoutController {
  static checkout(req, res) {
    const userId = req.userId; // From authentication middleware
    const { items, paymentMethod } = req.body;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items array is required and must not be empty' });
    }

    if (!paymentMethod) {
      return res.status(400).json({ error: 'Payment method is required (cash or credit_card)' });
    }

    // Validate items structure
    for (const item of items) {
      if (!item.productId || !item.quantity) {
        return res.status(400).json({ error: 'Each item must have productId and quantity' });
      }
    }

    const result = CheckoutService.checkout(userId, items, paymentMethod);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    res.status(200).json({
      message: result.message,
      order: {
        id: result.order.id,
        userId: result.order.userId,
        items: result.order.items,
        paymentMethod: result.order.paymentMethod,
        originalPrice: result.order.originalPrice,
        discount: result.order.discount,
        discountPercentage: result.order.discountPercentage,
        finalPrice: result.order.finalPrice,
        status: result.order.status,
        createdAt: result.order.createdAt
      }
    });
  }
}

module.exports = CheckoutController;
