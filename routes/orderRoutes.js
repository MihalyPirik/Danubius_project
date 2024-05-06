import { Router } from 'express';

import { getOrders, createOrder } from '../controllers/orderController.js';
import { protect } from '../middlewares/auth.js';

const orderRouter = Router();

orderRouter
  .route('/:id')
  .get(protect, getOrders)
  .post(protect, createOrder);

export default orderRouter;