// Authentication Service
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = 'your-secret-key-change-in-production';
const JWT_EXPIRY = '24h';

class AuthService {
  static generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  static register(email, password, name) {
    // Check if user already exists
    if (User.findByEmail(email)) {
      return { success: false, error: 'User already exists' };
    }

    // In a real app, password should be hashed using bcryptjs
    const newUser = User.create({
      email,
      password, // In production, hash this with bcryptjs
      name
    });

    const token = this.generateToken(newUser);
    return { success: true, user: newUser, token };
  }

  static login(email, password) {
    const user = User.findByEmail(email);
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // In a real app, compare hashed passwords
    if (user.password !== password) {
      return { success: false, error: 'Invalid credentials' };
    }

    const token = this.generateToken(user);
    return { success: true, user, token };
  }
}

module.exports = AuthService;
