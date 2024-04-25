import { Router } from 'express';

import { getBook, getBooks, createBook, updateBook, deleteBook } from '../controllers/bookController.js';
import { protect } from '../middlewares/auth.js';

const BookRouter = Router();

BookRouter
  .route('/')
  .get(getBooks)
  .post(protect, createBook);

BookRouter
  .route('/:id')
  .get(getBook)
  .put(protect, updateBook)
  .delete(protect, deleteBook);

export default BookRouter;