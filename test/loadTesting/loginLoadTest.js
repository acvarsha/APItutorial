import http from 'k6/http';
import { check, sleep } from 'k6';

// Test data from README.md - Default users available for testing
const testUsers = [
  { email: 'user1@example.com', password: 'hashed_password_1' },
  { email: 'user2@example.com', password: 'hashed_password_2' },
  { email: 'user3@example.com', password: 'hashed_password_3' }
];

// Load test configuration
export const options = {
  stages: [
    // Ramp up: 10 users over 5 seconds
    { duration: '5s', target: 10 },
    // Sustain: 30 users for 20 seconds
    { duration: '20s', target: 30 },
    // Ramp down: 0 users over 5 seconds
    { duration: '5s', target: 0 }
  ],
  thresholds: {
    // Performance threshold: P95 response time should not exceed 500ms
    'http_req_duration': ['p(95)<500'],
    // Success threshold: 95% of requests should succeed
    'http_req_failed': ['rate<0.05']
  }
};

export default function () {
  // Select a random user from test data
  const user = testUsers[Math.floor(Math.random() * testUsers.length)];

  // Prepare the login request
  const payload = JSON.stringify({
    email: user.email,
    password: user.password
  });

  const params = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  // Send POST request to login endpoint
  const response = http.post('http://localhost:3000/api/auth/login', payload, params);

  // Validate the response
  check(response, {
    'status is 200': (r) => r.status === 200,
    'login successful': (r) => r.body.includes('Login successful'),
    'response has token': (r) => r.body.includes('token'),
    'response has user data': (r) => r.body.includes('email'),
    'response time is acceptable': (r) => r.timings.duration < 500
  });

  // Small delay between requests to simulate realistic user behavior
  sleep(1);
}

/**
 * Load Test Configuration Details:
 * 
 * Stages:
 * - Ramp-up: 10 virtual users over 5 seconds
 * - Peak Load: 30 virtual users sustained for 20 seconds
 * - Ramp-down: 0 virtual users over 5 seconds
 * Total Duration: 30 seconds
 * 
 * Thresholds:
 * - P95 Response Time: < 500ms
 * - Error Rate: < 5%
 * 
 * Test Data:
 * Uses three default users from the API:
 * - user1@example.com / hashed_password_1
 * - user2@example.com / hashed_password_2
 * - user3@example.com / hashed_password_3
 * 
 * Checks:
 * - HTTP status code is 200
 * - Response contains "Login successful" message
 * - Response includes JWT token
 * - Response includes user email
 * - Response time is under 500ms
 */
