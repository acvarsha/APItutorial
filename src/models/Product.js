// Product Model - In-memory data store
const products = [
  {
    id: 1,
    name: "Laptop",
    price: 999.99,
    description: "High-performance laptop",
    stock: 10
  },
  {
    id: 2,
    name: "Mouse",
    price: 29.99,
    description: "Wireless mouse",
    stock: 50
  },
  {
    id: 3,
    name: "Keyboard",
    price: 79.99,
    description: "Mechanical keyboard",
    stock: 30
  }
];

class Product {
  static findById(id) {
    return products.find(p => p.id === id);
  }

  static getAll() {
    return products;
  }

  static updateStock(id, quantity) {
    const product = this.findById(id);
    if (product) {
      product.stock -= quantity;
      return product;
    }
    return null;
  }
}

module.exports = Product;
