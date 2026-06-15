const request = require('supertest');
const { expect } = require('chai');

describe('Path Coverage: Checkout', () => {
  const API_URL = 'http://localhost:3000';
  let authToken;

  // Helper function to get auth token
  const getAuthToken = (callback) => {
    const credentials = {
      email: 'user1@example.com',
      password: 'hashed_password_1'
    };

    request(API_URL)
      .post('/api/auth/login')
      .send(credentials)
      .end((err, res) => {
        if (err) return callback(err);
        authToken = res.body.token;
        callback(null, authToken);
      });
  };

  describe('POST /api/checkout', () => {
    before((done) => {
      // Get auth token before running checkout tests
      getAuthToken((err, token) => {
        if (err) return done(err);
        done();
      });
    });

    it('should process checkout with cash payment and apply 10% discount', (done) => {
      const checkoutData = {
        items: [
          { productId: 1, quantity: 1 },
          { productId: 2, quantity: 2 }
        ],
        paymentMethod: 'cash'
      };

      request(API_URL)
        .post('/api/checkout')
        .set('Authorization', `Bearer ${authToken}`)
        .send(checkoutData)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.include('Checkout successful');
          expect(res.body).to.have.property('order');
          expect(res.body.order).to.have.property('id');
          expect(res.body.order).to.have.property('userId');
          expect(res.body.order).to.have.property('items');
          expect(res.body.order.items).to.be.an('array');
          expect(res.body.order).to.have.property('paymentMethod');
          expect(res.body.order.paymentMethod).to.equal('cash');
          expect(res.body.order).to.have.property('originalPrice');
          expect(res.body.order).to.have.property('discount');
          expect(res.body.order).to.have.property('discountPercentage');
          expect(res.body.order.discountPercentage).to.equal(10); // 10% discount for cash
          expect(res.body.order).to.have.property('finalPrice');
          expect(res.body.order).to.have.property('status');
          expect(res.body.order.status).to.equal('completed');
          expect(res.body.order).to.have.property('createdAt');
          
          done();
        });
    });

    it('should process checkout with credit card payment without discount', (done) => {
      const checkoutData = {
        items: [
          { productId: 3, quantity: 1 }
        ],
        paymentMethod: 'credit_card'
      };

      request(API_URL)
        .post('/api/checkout')
        .set('Authorization', `Bearer ${authToken}`)
        .send(checkoutData)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('order');
          expect(res.body.order).to.have.property('paymentMethod');
          expect(res.body.order.paymentMethod).to.equal('credit_card');
          expect(res.body.order).to.have.property('discountPercentage');
          expect(res.body.order.discountPercentage).to.equal(0); // No discount for credit card
          expect(res.body.order).to.have.property('status');
          expect(res.body.order.status).to.equal('completed');
          
          done();
        });
    });
  });
});
