import { Router } from 'express';
import { getBook, getBooks, createBook, updateBook, deleteBook } from '../controllers/bookController.js';

const BookRouter = Router();

BookRouter
  .route('/')
  .get(getBooks)
  .post(createBook);

BookRouter
  .route('/:id')
  .get(getBook)
  .put(updateBook)
  .delete(deleteBook);

export default BookRouter;