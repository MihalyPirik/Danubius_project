import BookModel from '../models/BookModel.js'

// @desc   Get all books
// @route  GET /api/books
// @access Public
export const getBooks = async (req, res, next) => {
  try {
    const books = await BookModel.find()
    res.status(200).json({ success: true, count: books.length, data: books });
  } catch (error) {
    res.status(400).json({ success: false });
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
    res.status(400).json({ success: false });
  }
};
// @desc   Create new book
// @route  POST /api/books
// @access Private
export const createBook = async (req, res, next) => {
  try {
    const book = await BookModel.create(req.body);
    res.status(201).json({ success: true, data: book });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ success: false });
  }
};
// @desc   Update book
// @route  PUT /api/books/:id
// @access Private
export const updateBook = async (req, res, next) => {
  try {
    const book = await BookModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // A frissített adatokat kapjuk vissza
      runValidators: true, // Ellenőrzi a frissített adatokat a modell
    });
    if (!book) {
      return res.status(400).json({ success: false, msg: 'Not found' });
    }
    res.status(200).json({ success: true, data: book });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};
// @desc   Delete book
// @route  DELETE /api/books/:id
// @access Private
export const deleteBook = async (req, res, next) => {
  try {
    const book = await BookModel.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(400).json({ success: false, msg: 'Not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};