import { Router } from 'express';

import { getBook, getBooks, createBook, updateBook, deleteBook } from '../controllers/bookController.js';
import { protect, authorize } from '../middlewares/auth.js';

const BookRouter = Router();

BookRouter
  .route('/books/')
  .get(getBooks);

BookRouter
  .route('/books/:id')
  .get(getBook)
  .post(protect, authorize('publisher', 'admin'), createBook)
  .delete(protect, authorize('publisher', 'admin'), deleteBook);

BookRouter
  .route('/books/:id/:userId')
  .put(protect, authorize('publisher', 'admin'), updateBook)
export default BookRouter;