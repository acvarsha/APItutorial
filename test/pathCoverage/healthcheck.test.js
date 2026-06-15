const request = require('supertest');
const { expect } = require('chai');

describe('Path Coverage: Health Check', () => {
  const API_URL = 'http://localhost:3000';

  describe('GET /api/healthcheck', () => {
    it('should return 200 and health status', (done) => {
      request(API_URL)
        .get('/api/healthcheck')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.equal('healthy');
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('timestamp');
          
          done();
        });
    });
  });
});
