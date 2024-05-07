import jwt from 'jsonwebtoken';

import BookModel from '../models/BookModel.js';
import { ErrorResponse } from '../utils/errorResponse.js';

// @desc   Get all books
// @route  GET /api/books
// @access Public
export const getBooks = async (req, res, next) => {
  // #swagger.tags = ['Könyvek']
  // #swagger.summary = 'Könyvek megjelenítése.'
  try {
    let query;
    let queryString = JSON.stringify(req.query);

    queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`); // a queryben lévő operátorokat $ operátorokra cseréli

    query = BookModel.find(JSON.parse(queryString));
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    };

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt'); // default
    };

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await BookModel.countDocuments();

    query = query.skip(startIndex).limit(limit);
    const pagination = {};
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    };
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    };
    const books = await query;

    res.status(200).json({ success: true, count: books.length, pagination, data: books });
  } catch (error) {
    next(error);
  }
};
// @desc   Get single book
// @route  GET /api/books/:id
// @access Public
export const getBook = async (req, res, next) => {
  // #swagger.tags = ['Könyvek']
  // #swagger.summary = 'Egy könyv megjelenítése.'
  try {
    const book = await BookModel.findById(req.params.id);
    if (!book) {
      return next(new ErrorResponse('Nincs ilyen könyv!', 400));
    };
    res.status(200).json({ success: true, data: book });
  } catch (error) {
    next(new ErrorResponse(`A könyv id nem megfelelő: (${req.params.id})!`, 404));
  }
};
// @desc   Create new book
// @route  POST /api/books/:id
// @access Private
export const createBook = async (req, res, next) => {
  // #swagger.tags = ['Könyvek']
  // #swagger.summary = 'Könyv létrehozása.'
  try {
    const decoded = tokenVerify(req.headers.authorization.split(' ')[1]);
    if ((req.body.user && req.body.user.toString() !== decoded.id) && req.user.role !== 'admin') {
      return next(new ErrorResponse('Csak magadnak hozhatsz létre könyvet!', 401));
    };

    req.body.user = req.params.id;

    const book = await BookModel.create(req.body);
    res.status(201).json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
};
// @desc   Update book
// @route  PUT /api/books/:id/:userId
// @access Private
export const updateBook = async (req, res, next) => {
  // #swagger.tags = ['Könyvek']
  // #swagger.summary = 'Könyv módosítása.'
  try {
    const decoded = tokenVerify(req.headers.authorization.split(' ')[1]);

    req.body.user = req.params.userId;

    const bookUser = await BookModel.findById(req.params.id)
    if (bookUser.user.toString() !== decoded.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Csak a könyv tulajdonosa frissítheti a könyvet!', 401));
    };

    if (!bookUser) {
      return next(new ErrorResponse('Nincs ilyen könyv!', 400));
    };

    const book = await BookModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // A frissített adatokat kapjuk vissza
      runValidators: true, // Ellenőrzi a frissített adatokat a modell
    });

    res.status(200).json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
};
// @desc   Delete book
// @route  DELETE /api/books/:id
// @access Private
export const deleteBook = async (req, res, next) => {
  // #swagger.tags = ['Könyvek']
  // #swagger.summary = 'Könyv törlése.'
  try {
    const decoded = tokenVerify(req.headers.authorization.split(' ')[1]);

    const bookUser = await BookModel.findById(req.params.id)
    if (!bookUser) {
      return next(new ErrorResponse('Nincs ilyen könyv!', 400));
    }

    if (bookUser.user.toString() !== decoded.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Csak a könyv tulajdonosa törölheti a könyvet!', 401));
    };

    await BookModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

export const tokenVerify = (authorization) => {
  const token = authorization;

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
}