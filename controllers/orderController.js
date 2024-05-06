import BasketModel from '../models/BasketModel.js';
import OrderModel from '../models/OrderModel.js';
import { ErrorResponse } from '../utils/errorResponse.js';
import { tokenVerify } from './bookController.js';

// @desc   Get orders
// @route  GET /api/user/orders/:id
// @access Private
export const getOrders = async (req, res, next) => {
  try {
    const decoded = tokenVerify(req.headers.authorization.split(' ')[1]);
    if (req.params.id !== decoded.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Csak a saját kosaradat nézheted meg!', 401));
    };

    const orders = await OrderModel.find({ user: req.params.id }).populate('books.book', '-_id -__v -user');

    if (!orders || orders.length === 0) {
      return next(new ErrorResponse(`${req.user.name} nem rendelkezik rendeléssel!`, 400));
    }

    // let bookQuantity = 0;
    // for (const book of orders[0].books) {
    //   bookQuantity += book.quantity;
    // }

    // res.status(200).json({ success: true, count: bookQuantity, data: orders });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};
// @desc   Create new order
// @route  POST /api/user/orders/:id
// @access Private
export const createOrder = async (req, res, next) => {
  try {
    const decoded = tokenVerify(req.headers.authorization.split(' ')[1]);
    if (req.params.id !== decoded.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Csak magadnak hozhatsz létre rendelést!', 401));
    };

    const basket = await BasketModel.find({ user: req.params.id });

    req.body.books = basket[0].books;
    req.body.user = req.params.id;

    const order = new OrderModel(req.body);
    await order.save();
    
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};