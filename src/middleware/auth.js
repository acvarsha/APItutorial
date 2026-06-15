// Authentication Middleware
const AuthService = require('../services/AuthService');

const authenticateToken = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  // Verify token
  const decoded = AuthService.verifyToken(token);
  
  if (!decoded) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  // Attach user info to request
  req.userId = decoded.id;
  req.userEmail = decoded.email;
  
  next();
};

module.exports = authenticateToken;
