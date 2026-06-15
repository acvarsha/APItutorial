// Authentication Controller
const AuthService = require('../services/AuthService');

class AuthController {
  static register(req, res) {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    const result = AuthService.register(email, password, name);
    
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name
      },
      token: result.token
    });
  }

  static login(req, res) {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = AuthService.login(email, password);
    
    if (!result.success) {
      return res.status(401).json({ error: result.error });
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name
      },
      token: result.token
    });
  }
}

module.exports = AuthController;
