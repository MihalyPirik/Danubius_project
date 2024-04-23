import { Router } from 'express';
import { createUser, loginUser } from '../controllers/authController.js';

const AuthRouter = Router();

AuthRouter.route('/registration').post(createUser);
AuthRouter.route('/login').post(loginUser);

export default AuthRouter;