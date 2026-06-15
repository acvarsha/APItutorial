// User Model - In-memory data store
let users = [
  {
    id: 1,
    email: "user1@example.com",
    password: "hashed_password_1", // In a real app, this would be hashed
    name: "John Doe",
    createdAt: new Date("2024-01-01")
  },
  {
    id: 2,
    email: "user2@example.com",
    password: "hashed_password_2",
    name: "Jane Smith",
    createdAt: new Date("2024-01-15")
  },
  {
    id: 3,
    email: "user3@example.com",
    password: "hashed_password_3",
    name: "Bob Johnson",
    createdAt: new Date("2024-02-01")
  }
];

let userIdCounter = 4;

class User {
  static findByEmail(email) {
    return users.find(u => u.email === email);
  }

  static findById(id) {
    return users.find(u => u.id === id);
  }

  static create(userData) {
    const newUser = {
      id: userIdCounter++,
      ...userData,
      createdAt: new Date()
    };
    users.push(newUser);
    return newUser;
  }

  static getAll() {
    return users;
  }
}

module.exports = User;
