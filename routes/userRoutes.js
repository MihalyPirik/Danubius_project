import { Router } from 'express';
import { getUser, updateUser, deleteUser } from '../controllers/userController.js';

const UserRouter = Router();

UserRouter
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

export default UserRouter;
