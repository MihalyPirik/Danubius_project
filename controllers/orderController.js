import BasketModel from '../models/BasketModel.js';
import OrderModel from '../models/OrderModel.js';
import { ErrorResponse } from '../utils/errorResponse.js';
import { tokenVerify } from './bookController.js';

// @desc   Get orders
// @route  GET /api/user/orders/:id
// @access Private
export const getOrders = async (req, res, next) => {
  // #swagger.tags = ['Rendelések']
  // #swagger.summary = 'Rendelések megjelenítése.'
  try {
    const decoded = tokenVerify(req.headers.authorization.split(' ')[1]);
    if (req.params.id !== decoded.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Csak a saját kosaradat nézheted meg!', 401));
    };

    const orders = await OrderModel.find({ user: req.params.id }).populate('books.book', '-_id -__v -user').populate('user', '-__v -createdAt');

    if (!orders || orders.length === 0) {
      return next(new ErrorResponse(`${req.user.name} nem rendelkezik rendeléssel!`, 400));
    };

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};
// @desc   Create new order
// @route  POST /api/user/orders/:id
// @access Private
export const createOrder = async (req, res, next) => {
  // #swagger.tags = ['Rendelések']
  // #swagger.summary = 'Rendelés létrehozása.'
  /*  #swagger.parameters['body'] = {
      in: 'body',
        schema: { 
        }
  } */
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
// @desc   Update order
// @route  PUT /api/orders/:id/:userId
// @access Private
export const updateOrder = async (req, res, next) => {
  // #swagger.tags = ['Rendelések']
  // #swagger.summary = 'Rendelés módosítása.'
  /*  #swagger.parameters['body'] = {
      in: 'body',
        schema: { 
          $books: [
            {
              $book: "662fb295d58e4b0a5356528d",
              $quantity: 2
            }
          ]
        }
  } */
  try {
    req.body.user = req.params.userId;

    const orderUser = await OrderModel.findById(req.params.id);

    if (!orderUser) {
      return next(new ErrorResponse('Nincs ilyen rendelés!', 400));
    }

    const order = await OrderModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // A frissített adatokat kapjuk vissza
      runValidators: true, // Ellenőrzi a frissített adatokat a modell
    });

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};
// @desc   Delete order
// @route  DELETE /api/orders/:id
// @access Private
export const deleteOrder = async (req, res, next) => {
  // #swagger.tags = ['Rendelések']
  // #swagger.summary = 'Rendelés törlése.'
  try {
    const orderUser = await OrderModel.findById(req.params.id)
    if (!orderUser) {
      return next(new ErrorResponse('Nincs ilyen rendelés!', 400));
    };

    await OrderModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};