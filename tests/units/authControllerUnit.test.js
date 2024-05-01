import UserModel from '../../models/UserModel.js';
import { createUser, loginUser } from '../../controllers/authController.js';

jest.mock('../../models/UserModel.js');

describe('AuthController', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {
                email: 'misi10@misi.hu',
                password: '12345678'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('POST /api/auth/registration', () => {
        it('should create a new user with valid data', async () => {
            const user = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                role: 'user',
                getSignedToken: jest.fn().mockReturnValue('fakeToken')
            };

            UserModel.create.mockResolvedValue(user);

            await createUser(req, res, next)

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ success: true, token: 'fakeToken' });
        });
        it('should handle errors during user creation', async () => {
            UserModel.create.mockRejectedValue(new Error('Failed to create user'));

            await createUser(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ success: false, msg: 'Failed to create user' });
        });
    });
    describe('POST /api/auth/login', () => {
        it('should handle login with correct credentials', async () => {
            const mockUser = {
                email: 'misi10@misi.hu',
                password: '12345678',
                role: 'user',
                getSignedToken: jest.fn().mockReturnValue('mockToken')
            };

            UserModel.findOne.mockResolvedValue(mockUser);

            await loginUser(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, token: 'mockToken' });
        });
    });
});
