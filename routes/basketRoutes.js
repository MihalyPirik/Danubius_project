import { Router } from 'express';

import { getBasket, createBasket, putUpdateBasket, patchUpdateBasket, deleteBasket } from '../controllers/basketController.js';
import { protect } from '../middlewares/auth.js';

const basketRouter = Router();

basketRouter
  .route('/user/basket/:id')
  .get(protect, getBasket)
  .post(protect, createBasket)
  .delete(protect, deleteBasket);

basketRouter
  .route('/user/basket/:id/:userId')
  .put(protect, putUpdateBasket)
  .patch(protect, patchUpdateBasket);
export default basketRouter;