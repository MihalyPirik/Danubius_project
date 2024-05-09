import supertest from 'supertest';

import createApp from '../../app';

const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MzllYWVkNzllNjMzYzRlYzkxZGU5YSIsImlhdCI6MTcxNTI0NjM5MSwiZXhwIjoxNzE3ODM4MzkxfQ.zb4IlmM7Qd20bjX_knz3v1YCpKSyDoL-bJLLZ37wkpI';

describe('App', () => {
  let app;

  beforeAll(() => {
    app = createApp();
  });

  describe('UserController', () => {
    describe('GET /api/user/:id', () => {
      it('should return an object with a 200 status code', async () => {
        const response = await supertest(app)
          .get('/api/user/6639eaed79e633c4ec91de9a')
          .set('Authorization', token);
        expect(response.statusCode).toBe(200);
        expect(typeof response.body).toBe('object');
      });
      it('should return a 400 status code when provided with an invalid token', async () => {
        const response = await supertest(app)
          .get('/api/user/6639eaed79e633c4ec91de9a')
          .set('Authorization', token + '1');
        expect(response.statusCode).toBe(400);
      });
      it('should return a 401 status code when provided without an token', async () => {
        const response = await supertest(app)
          .get('/api/user/6639eaed79e633c4ec91de9a');
        expect(response.statusCode).toBe(401);
      });
    });
  });
});