import BasketModel from '../models/BasketModel.js';
import BookModel from '../models/BookModel.js';
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

    const basket = await BasketModel.find({ user: req.params.id }).populate('books.book', '-_id -__v -user');

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
    };

    const book = await BookModel.findOne({ _id: req.body._id });
    if (book.amount < req.body.quantity) {
      return next(new ErrorResponse(`Ebből a könyből a kosárba elhelyezhető maximális mennyiség: ${book.amount} db!`, 400));
    };

    if (req.body.quantity < 0) {
      return next(new ErrorResponse('Nem lehet negatív a könyv mennyisége!', 400));
    };

    const newBasket = {
      user: req.params.id,
      books: {
        book: req.body._id,
        quantity: req.body.quantity,
      }
    };

    const basket = await BasketModel.create(newBasket);
    res.status(201).json({ success: true, data: basket });
  } catch (error) {
    next(error);
  }
};
// @desc   PUT Update basket
// @route  PUT /api/user/basket/:id/:userId
// @access Private
export const putUpdateBasket = async (req, res, next) => {
  try {
    const decoded = tokenVerify(req.headers.authorization.split(' ')[1]);

    req.body.user = req.params.userId;

    const basketUser = await BasketModel.findById(req.params.id)
    if (basketUser.user.toString() !== decoded.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Csak a kosár tulajdonosa frissítheti a kosarat!', 401));
    };

    if (!basketUser) {
      return next(new ErrorResponse('Nincs ilyen kosár!', 400));
    };

    const books = req.body.books;
    for (const book of books) {
      const bookCheck = await BookModel.findById(book.book);
      if (bookCheck.amount < book.quantity) {
        return next(new ErrorResponse(`Ebből a könyből a kosárba elhelyezhető maximális mennyiség: ${bookCheck.amount} db!`, 400));
      };
      if (book.quantity < 0) {
        return next(new ErrorResponse('Nem lehet negatív a könyv mennyisége!', 400));
      };
    };

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
// @route  PATCH /api/user/basket/:id/:userId
// @access Private
export const patchUpdateBasket = async (req, res, next) => {
  try {
    const decoded = tokenVerify(req.headers.authorization.split(' ')[1]);

    req.body.user = req.params.userId;

    const basketUser = await BasketModel.findById(req.params.id)
    if (basketUser.user.toString() !== decoded.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Csak a kosár tulajdonosa frissítheti a kosarat!', 401));
    };

    if (!basketUser) {
      return next(new ErrorResponse('Nincs ilyen kosár!', 400));
    };

    const bookCheck = await BookModel.findById(req.body._id);
    if (!bookCheck) {
      return next(new ErrorResponse('Nincs ilyen könyv!', 400));
    };

    if (req.body.quantity < 0) {
      return next(new ErrorResponse('Nem lehet negatív a könyv mennyisége!', 400));
    };

    var isBook = false;
    for (const book of basketUser.books) {
      if (book.book == req.body._id) {
        if (bookCheck.amount >= book.quantity + req.body.quantity) {
          book.quantity += req.body.quantity;
          isBook = true;
        }
        else {
          return next(new ErrorResponse(`Ebből a könyből a kosárba elhelyezhető maximális mennyiség: ${bookCheck.amount} db! Jelenleg a kosaradban ${book.quantity} db van!`, 400));
        };
      };
    };

    if (!isBook) {
      if (bookCheck.amount >= req.body.quantity) {
        const newBasket = {
          book: req.body._id,
          quantity: req.body.quantity,
        };
        basketUser.books.push(newBasket);
      }
      else {
        return next(new ErrorResponse(`Ebből a könyből a kosárba elhelyezhető maximális mennyiség: ${bookCheck.amount} db!`, 400));
      };
    };

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

    const basketUser = await BasketModel.findById(req.params.id);
    if (!basketUser) {
      return next(new ErrorResponse('Nincs ilyen kosár!', 400));
    };

    if (basketUser.user.toString() !== decoded.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Csak a kosár tulajdonosa törölheti a kosarat!', 401));
    };

    await BasketModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};