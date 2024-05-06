import { Router } from 'express';

import { getBasket, createBasket } from '../controllers/basketController.js';
import { protect } from '../middlewares/auth.js';

const basketRouter = Router();

basketRouter
  .route('/:id')
  .get(protect, getBasket)
  .post(protect, createBasket);

export default basketRouter;