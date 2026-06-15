const request = require('supertest');
const { expect } = require('chai');

describe('Path Coverage: Authentication', () => {
  const API_URL = 'http://localhost:3000';
  let authToken; // Store token for later use

  describe('POST /api/auth/register', () => {
    it('should register a new user and return 201 with token', (done) => {
      const newUser = {
        email: 'testuser@example.com',
        password: 'testPassword123',
        name: 'Test User'
      };

      request(API_URL)
        .post('/api/auth/register')
        .send(newUser)
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.include('registered successfully');
          expect(res.body).to.have.property('user');
          expect(res.body.user).to.have.property('id');
          expect(res.body.user).to.have.property('email');
          expect(res.body.user.email).to.equal(newUser.email);
          expect(res.body).to.have.property('token');
          expect(res.body.token).to.be.a('string');
          
          authToken = res.body.token;
          done();
        });
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login existing user and return 200 with token', (done) => {
      const credentials = {
        email: 'user1@example.com',
        password: 'hashed_password_1'
      };

      request(API_URL)
        .post('/api/auth/login')
        .send(credentials)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.include('Login successful');
          expect(res.body).to.have.property('user');
          expect(res.body.user).to.have.property('id');
          expect(res.body.user).to.have.property('email');
          expect(res.body.user.email).to.equal(credentials.email);
          expect(res.body).to.have.property('token');
          expect(res.body.token).to.be.a('string');
          
          authToken = res.body.token;
          done();
        });
    });
  });
});
