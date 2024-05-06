import supertest from 'supertest';

import createApp from '../../app';

const userData = { name: 'teszt', email: 'teszt@teszt.hu', password: '12345678', role: 'user' };

describe('App', () => {
    let app;

    beforeAll(() => {
        app = createApp();
    });

    describe('AuthController', () => {
        describe('POST /api/auth/registration', () => {
            describe('should user registration data and check it', () => {
                it('should handle registration with correct credentials and return 201', async () => {
                    const response = await supertest(app).post('/api/auth/registration').send(userData);
                    expect(response.statusCode).toBe(201);
                });
                it('should handle registration with incorrect credentials and return 400', async () => {
                    const response = await supertest(app).post('/api/auth/registration').send(userData);
                    expect(response.statusCode).toBe(400);
                });
            });
        });
        describe('POST /api/auth/login', () => {
            describe('should user login data and check it', () => {
                it('should handle login with correct credentials and return 200', async () => {
                    const response = await supertest(app).post('/api/auth/login').send({
                        email: 'teszt@teszt.hu',
                        password: '12345678'
                    });
                    expect(response.statusCode).toBe(200);
                });
                it('should handle login with incorrect credentials and return 401', async () => {
                    const response = await supertest(app).post('/api/auth/login').send({
                        email: 'teszt@teszt.hu',
                        password: '123456789'
                    });
                    expect(response.statusCode).toBe(401);
                });
            });
        });
    });
});
