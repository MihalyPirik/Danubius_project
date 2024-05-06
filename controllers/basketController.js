import BasketModel from '../models/BasketModel.js';
import { ErrorResponse } from '../utils/errorResponse.js';
import { tokenVerify } from './bookController.js';

// @desc   Get basket
// @route  GET /api/user/basket/:id
// @access Private
export const getBasket = async (req, res, next) => {
  try {
    const decoded = tokenVerify(req.headers.authorization.split(' ')[1]);
    if (req.params.id !== decoded.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Csak a saját kosaradat nézheted meg!', 401));
    };

    const basket = await BasketModel.find({ user: req.params.id });

    if (!basket || basket.length === 0) {
      return next(new ErrorResponse(`${req.user.name} nem rendelkezik kosárral!`, 400));
    }

    res.status(200).json({ success: true, count: basket.length, data: basket });
  } catch (error) {
    next(error);
  }
};
// @desc   Create new basket
// @route  POST /api/user/basket/:id
// @access Private
export const createBasket = async (req, res, next) => {
  try {
    const decoded = tokenVerify(req.headers.authorization.split(' ')[1]);
    if (req.params.id !== decoded.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Csak magadnak hozhatsz létre kosarat!', 401));
    };

    const basketCheck = await BasketModel.find({ user: req.params.id });
    if (basketCheck.length !== 0) {
      return next(new ErrorResponse(`${req.user.name} már rendelkezik kosárral!`, 400));
    }

    req.body.user = decoded.id;

    const basket = await BasketModel.create(req.body);
    res.status(201).json({ success: true, data: basket });
  } catch (error) {
    console.log(error);
    next(error);
  }
};