import { Router } from 'express';

import { createUser, loginUser, logoutUser } from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';

const AuthRouter = Router();

AuthRouter.route('/auth/registration').post(createUser);
AuthRouter.route('/auth/login').post(loginUser);
AuthRouter.route('/auth/logout/:id').get(protect, logoutUser);

export default AuthRouter;