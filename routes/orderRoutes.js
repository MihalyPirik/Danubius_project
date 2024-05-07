import { Router } from 'express';

import { getOrders, createOrder, updateOrder, deleteOrder } from '../controllers/orderController.js';
import { protect } from '../middlewares/auth.js';

const orderRouter = Router();

orderRouter
  .route('/user/orders/:id')
  .get(protect, getOrders)
  .post(protect, createOrder)
  .delete(protect, deleteOrder);

orderRouter
  .route('/user/orders/:id/:userId')
  .put(protect, updateOrder)

export default orderRouter;