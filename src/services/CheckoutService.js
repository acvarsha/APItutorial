// Checkout Service
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

class CheckoutService {
  static calculateTotal(items) {
    let total = 0;
    for (const item of items) {
      const product = Product.findById(item.productId);
      if (!product) {
        return { success: false, error: `Product ${item.productId} not found` };
      }
      if (product.stock < item.quantity) {
        return { success: false, error: `Insufficient stock for product ${product.name}` };
      }
      total += product.price * item.quantity;
    }
    return { success: true, total };
  }

  static applyDiscount(total, paymentMethod) {
    if (paymentMethod === 'cash') {
      const discount = total * 0.10; // 10% discount for cash
      return {
        originalPrice: total,
        discount: discount,
        finalPrice: total - discount,
        discountPercentage: 10
      };
    }
    return {
      originalPrice: total,
      discount: 0,
      finalPrice: total,
      discountPercentage: 0
    };
  }

  static validatePaymentMethod(paymentMethod) {
    const validMethods = ['cash', 'credit_card'];
    return validMethods.includes(paymentMethod);
  }

  static checkout(userId, items, paymentMethod) {
    // Validate user exists
    const user = User.findById(userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Validate payment method
    if (!this.validatePaymentMethod(paymentMethod)) {
      return { success: false, error: 'Invalid payment method. Accepted: cash, credit_card' };
    }

    // Calculate total
    const totalResult = this.calculateTotal(items);
    if (!totalResult.success) {
      return totalResult;
    }

    // Apply discount based on payment method
    const pricing = this.applyDiscount(totalResult.total, paymentMethod);

    // Update product stock
    for (const item of items) {
      Product.updateStock(item.productId, item.quantity);
    }

    // Create order
    const order = Order.create({
      userId,
      items,
      paymentMethod,
      ...pricing,
      status: 'completed'
    });

    return {
      success: true,
      order,
      message: `Checkout successful. ${pricing.discountPercentage}% discount applied for ${paymentMethod === 'cash' ? 'cash' : 'credit card'} payment.`
    };
  }
}

module.exports = CheckoutService;
