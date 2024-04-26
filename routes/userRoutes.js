import { Router } from 'express';

import { getUser, updateUser, updatePassword, deleteUser } from '../controllers/userController.js';
import { protect } from '../middlewares/auth.js';

const UserRouter = Router();

UserRouter
  .route('/:id')
  .get(protect, getUser)
  .put(protect, updateUser)
  .delete(protect, deleteUser);

UserRouter.route('/password/:id').put(protect, updatePassword);

export default UserRouter;
