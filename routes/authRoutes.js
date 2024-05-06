import { Router } from 'express';

import { createUser, loginUser, logoutUser } from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';

const AuthRouter = Router();

AuthRouter.route('/registration').post(createUser);
AuthRouter.route('/login').post(loginUser);
AuthRouter.route('/logout/:id').get(protect, logoutUser);

export default AuthRouter;