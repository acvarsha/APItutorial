// Auth Routes
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} name - User name
 * @returns {object} User data and JWT token
 */
router.post('/register', AuthController.register);

/**
 * @route POST /api/auth/login
 * @description Login user and get JWT token
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {object} User data and JWT token
 */
router.post('/login', AuthController.login);

module.exports = router;
