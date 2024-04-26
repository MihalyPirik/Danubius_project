import { Router } from 'express';

import { getBook, getBooks, createBook, updateBook, deleteBook } from '../controllers/bookController.js';
import { protect, authorize } from '../middlewares/auth.js';

const BookRouter = Router();

BookRouter
  .route('/')
  .get(getBooks)
  .post(protect, authorize('publisher', 'admin'), createBook);

BookRouter
  .route('/:id')
  .get(getBook)
  .put(protect, authorize('publisher', 'admin'), updateBook)
  .delete(protect, authorize('publisher', 'admin'), deleteBook);

export default BookRouter;