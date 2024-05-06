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

    let bookQuantity = 0;
    for (const book of basket[0].books) {
      bookQuantity += book.quantity;
    }

    res.status(200).json({ success: true, count: bookQuantity, data: basket });
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

    const newBasket = {
      user: req.params.id,
      books: {
        book: req.body._id,
        quantity: req.body.quantity,
      }
    }

    const basket = await BasketModel.create(newBasket);
    res.status(201).json({ success: true, data: basket });
  } catch (error) {
    next(error);
  }
};
// @desc   PUT Update basket
// @route  PUT /api/user/basket/:id
// @access Private
export const putUpdateBasket = async (req, res, next) => {
  try {
    const decoded = tokenVerify(req.headers.authorization.split(' ')[1]);

    req.body.user = decoded.id;

    const basketUser = await BasketModel.findById(req.params.id)
    if (basketUser.user.toString() !== decoded.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Csak a kosár tulajdonosa frissítheti a kosarat!', 401));
    };

    if (!basketUser) {
      return next(new ErrorResponse('Nincs ilyen kosár!', 400));
    }

    const basket = await BasketModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // A frissített adatokat kapjuk vissza
      runValidators: true, // Ellenőrzi a frissített adatokat a modell
    });

    res.status(200).json({ success: true, data: basket });
  } catch (error) {
    next(error);
  }
};
// @desc   Patch Update basket
// @route  PATCH /api/user/basket/:id
// @access Private
export const patchUpdateBasket = async (req, res, next) => {
  try {
    const decoded = tokenVerify(req.headers.authorization.split(' ')[1]);

    req.body.user = decoded.id;

    const basketUser = await BasketModel.findById(req.params.id)
    if (basketUser.user.toString() !== decoded.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Csak a kosár tulajdonosa frissítheti a kosarat!', 401));
    };

    if (!basketUser) {
      return next(new ErrorResponse('Nincs ilyen kosár!', 400));
    }

    var isBook = false;
    for (const book of basketUser.books) {
      if (book.book == req.body._id) {
        book.quantity += req.body.quantity;
        isBook = true;
      };
    };

    if (!isBook) {
      const newBasket = {
        book: req.body._id,
        quantity: req.body.quantity,
      }
      basketUser.books.push(newBasket);
    }

    const basket = await BasketModel.findByIdAndUpdate(req.params.id, basketUser, {
      new: true, // A frissített adatokat kapjuk vissza
      runValidators: true, // Ellenőrzi a frissített adatokat a modell
    });

    res.status(200).json({ success: true, data: basket });
  } catch (error) {
    next(error);
  }
};
// @desc   Delete basket
// @route  DELETE /api/user/basket/:id
// @access Private
export const deleteBasket = async (req, res, next) => {
  try {
    const decoded = tokenVerify(req.headers.authorization.split(' ')[1]);

    const basketUser = await BasketModel.findById(req.params.id)
    if (!basketUser) {
      return next(new ErrorResponse('Nincs ilyen kosár!', 400));
    }

    if (basketUser.user.toString() !== decoded.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Csak a kosár tulajdonosa törölheti a kosarat!', 401));
    };

    await BasketModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};