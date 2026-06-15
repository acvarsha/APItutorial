# E-Commerce REST API

## Description

A modern, lightweight REST API for e-commerce built with Node.js and Express. This API provides authentication, product management, and checkout functionality with JWT token-based security. All data is stored in-memory, making it perfect for development and testing.

### Key Features
- **User Authentication**: Register and login with JWT token generation
- **Secure Checkout**: Only authenticated users can perform checkouts
- **Payment Methods**: Support for cash (10% discount) and credit card payments
- **Product Management**: Browse and manage product inventory
- **In-Memory Database**: Fast development without external dependencies
- **Clean Architecture**: Organized structure with Routes, Middleware, Controllers, Services, and Models

---

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Setup Steps

1. **Clone or navigate to the project directory**
   ```bash
   cd APItutorial
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Verify installation**
   ```bash
   npm list
   ```

---

## How to Run

### Start the API Server

```bash
npm start
```

The API will start on `http://localhost:3000`

You should see:
```
🚀 E-Commerce API is running on http://localhost:3000
📚 API Documentation: http://localhost:3000/api/healthcheck
```

---

## Rules

### Checkout Rules
- ✅ **Payment Methods**: Only cash or credit card accepted
- 💰 **Cash Discount**: 10% discount applied for cash payments
- 🔐 **Authentication Required**: Only authenticated users can perform checkout
- 📦 **Stock Validation**: System validates product stock availability
- 🛒 **Item Validation**: Each checkout must include valid items with quantity

### API Rules
- 🔑 **JWT Authentication**: Login required for protected endpoints (checkout)
- 📊 **In-Memory Storage**: All data stored in RAM (resets on server restart)
- ⏱️ **Token Expiry**: JWT tokens expire after 24 hours
- ✔️ **Input Validation**: All requests are validated for required fields

---

## Existent Data

### Default Users (Available for Testing)

| ID | Email | Password | Name |
|---|---|---|---|
| 1 | user1@example.com | hashed_password_1 | John Doe |
| 2 | user2@example.com | hashed_password_2 | Jane Smith |
| 3 | user3@example.com | hashed_password_3 | Bob Johnson |

### Default Products (Available for Purchase)

| ID | Name | Price | Stock |
|---|---|---|---|
| 1 | Laptop | $999.99 | 10 |
| 2 | Mouse | $29.99 | 50 |
| 3 | Keyboard | $79.99 | 30 |

---

## How to Use the Rest API

### Base URL
```
http://localhost:3000
```

### 1. Health Check Endpoint

**Check API Status**

```http
GET /api/healthcheck
```

**Response (200 OK)**
```json
{
  "status": "healthy",
  "message": "API is running successfully",
  "timestamp": "2024-06-15T10:30:00.000Z"
}
```

---

### 2. Authentication Endpoints

#### Register New User

**Endpoint:**
```http
POST /api/auth/register
```

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "securePassword123",
  "name": "New User"
}
```

**Response (201 Created)**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 4,
    "email": "newuser@example.com",
    "name": "New User"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (400 Bad Request)**
```json
{
  "error": "User already exists"
}
```

---

#### Login User

**Endpoint:**
```http
POST /api/auth/login
```

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user1@example.com",
  "password": "hashed_password_1"
}
```

**Response (200 OK)**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user1@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401 Unauthorized)**
```json
{
  "error": "Invalid credentials"
}
```

---

### 3. Checkout Endpoint

**⚠️ REQUIRES AUTHENTICATION**

**Endpoint:**
```http
POST /api/checkout
```

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 1
    },
    {
      "productId": 2,
      "quantity": 2
    }
  ],
  "paymentMethod": "cash"
}
```

**Response (200 OK)**
```json
{
  "message": "Checkout successful. 10% discount applied for cash payment.",
  "order": {
    "id": 1,
    "userId": 1,
    "items": [
      {
        "productId": 1,
        "quantity": 1
      },
      {
        "productId": 2,
        "quantity": 2
      }
    ],
    "paymentMethod": "cash",
    "originalPrice": 1059.97,
    "discount": 105.997,
    "discountPercentage": 10,
    "finalPrice": 953.973,
    "status": "completed",
    "createdAt": "2024-06-15T10:35:20.000Z"
  }
}
```

**Request Body with Credit Card:**
```json
{
  "items": [
    {
      "productId": 3,
      "quantity": 1
    }
  ],
  "paymentMethod": "credit_card"
}
```

**Response (200 OK - No Discount)**
```json
{
  "message": "Checkout successful. 0% discount applied for credit card payment.",
  "order": {
    "id": 2,
    "userId": 1,
    "items": [
      {
        "productId": 3,
        "quantity": 1
      }
    ],
    "paymentMethod": "credit_card",
    "originalPrice": 79.99,
    "discount": 0,
    "discountPercentage": 0,
    "finalPrice": 79.99,
    "status": "completed",
    "createdAt": "2024-06-15T10:36:00.000Z"
  }
}
```

**Error Response - Missing Token (401)**
```json
{
  "error": "Access token required"
}
```

**Error Response - Invalid Token (403)**
```json
{
  "error": "Invalid or expired token"
}
```

**Error Response - Invalid Payment Method (400)**
```json
{
  "error": "Invalid payment method. Accepted: cash, credit_card"
}
```

**Error Response - Insufficient Stock (400)**
```json
{
  "error": "Insufficient stock for product Laptop"
}
```

---

## Testing the API

### Using cURL

**1. Health Check:**
```bash
curl http://localhost:3000/api/healthcheck
```

**2. Register User:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'
```

**3. Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user1@example.com","password":"hashed_password_1"}'
```

**4. Checkout (Replace TOKEN with actual JWT):**
```bash
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{"items":[{"productId":1,"quantity":1}],"paymentMethod":"cash"}'
```

### Using Postman

1. Import the endpoints into Postman
2. Use the `Authorization` header with type `Bearer Token`
3. Set the token value from login response
4. Test each endpoint sequentially

---

## Project Structure

```
APItutorial/
├── src/
│   ├── app.js                    # Main Express application
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── Product.js           # Product model
│   │   └── Order.js             # Order model
│   ├── services/
│   │   ├── AuthService.js       # Authentication logic
│   │   └── CheckoutService.js   # Checkout logic
│   ├── controllers/
│   │   ├── AuthController.js    # Auth endpoints handler
│   │   └── CheckoutController.js # Checkout endpoints handler
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   └── routes/
│       ├── authRoutes.js        # Auth routes
│       ├── checkoutRoutes.js    # Checkout routes
│       └── healthRoutes.js      # Health check routes
├── package.json                 # Project dependencies
├── .gitignore                   # Git ignore file
└── README.md                    # This file
```

---

## API Endpoints Summary

| Method | Endpoint | Authentication | Description |
|---|---|---|---|
| GET | `/api/healthcheck` | ❌ No | Check API health status |
| POST | `/api/auth/register` | ❌ No | Register new user |
| POST | `/api/auth/login` | ❌ No | Login and get JWT token |
| POST | `/api/checkout` | ✅ Yes | Create order with checkout |

---

## Notes

- This API is designed for development and testing purposes
- All data is stored in-memory and will be reset when the server restarts
- In production, implement proper password hashing and use a real database
- JWT secret should be stored in environment variables, not hardcoded
- Add rate limiting and input sanitization for production use

---

## License

MIT

---

## Support

For issues or questions, please refer to the project documentation or create an issue in the repository.