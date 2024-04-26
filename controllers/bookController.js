import BookModel from '../models/BookModel.js';
import { ErrorResponse } from '../utils/errorResponse.js';

// @desc   Get all books
// @route  GET /api/books
// @access Public
export const getBooks = async (req, res, next) => {
  try {
    let query;
    let queryString = JSON.stringify(req.query);

    queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`); // a queryben lévő operátorokat $ operátorokra cseréli

    query = BookModel.find(JSON.parse(queryString));
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt'); // default
    }

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
  try {
    const book = await BookModel.findById(req.params.id);
    if (!book) {
      return res.status(400).json({ success: false, msg: 'Not found' });
    }
    res.status(200).json({ success: true, data: book });
  } catch (error) {
    next(new ErrorResponse(`Book id (${req.params.id}) not correct`, 404));
  }
};
// @desc   Create new book
// @route  POST /api/books
// @access Private
export const createBook = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const book = await BookModel.create(req.body);
    res.status(201).json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
};
// @desc   Update book
// @route  PUT /api/books/:id
// @access Private
export const updateBook = async (req, res, next) => {
  try {
    req.body.user = req.user.id;

    const bookUser = await BookModel.findById(req.params.id)
    if (!bookUser) {
      return res.status(400).json({ success: false, msg: 'Not found' });
    }

    if (bookUser.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Csak a könyv tulajdonosa frissítheti a könyvet!', 401));
    };

    const book = await BookModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // A frissített adatokat kapjuk vissza
      runValidators: true, // Ellenőrzi a frissített adatokat a modell
    });
    if (!book) {
      return res.status(400).json({ success: false, msg: 'Not found' });
    }
    res.status(200).json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
};
// @desc   Delete book
// @route  DELETE /api/books/:id
// @access Private
export const deleteBook = async (req, res, next) => {
  try {
    req.body.user = req.user.id;

    const bookUser = await BookModel.findById(req.params.id)
    if (!bookUser) {
      return res.status(400).json({ success: false, msg: 'Not found' });
    }

    if (bookUser.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Csak a könyv tulajdonosa törölheti a könyvet!', 401));
    };

    const book = await BookModel.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(400).json({ success: false, msg: 'Not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};