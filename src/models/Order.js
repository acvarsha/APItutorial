// Order Model - In-memory data store
let orders = [];
let orderIdCounter = 1;

class Order {
  static create(orderData) {
    const newOrder = {
      id: orderIdCounter++,
      ...orderData,
      createdAt: new Date()
    };
    orders.push(newOrder);
    return newOrder;
  }

  static findById(id) {
    return orders.find(o => o.id === id);
  }

  static findByUserId(userId) {
    return orders.filter(o => o.userId === userId);
  }

  static getAll() {
    return orders;
  }
}

module.exports = Order;
