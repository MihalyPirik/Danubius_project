import UserModel from "../../models/UserModel.js";
import { createUser } from "../../controllers/authController.js";

jest.mock('../../models/UserModel.js');

describe('createUser function', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

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

});
