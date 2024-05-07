import BasketModel from './BasketModel.js';
import BookModel from './BookModel.js';
import { ErrorResponse } from '../utils/errorResponse.js';

import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'UserModel',
    required: true
  },
  books: [
    {
      book: {
        type: mongoose.Schema.ObjectId,
        ref: 'BookModel',
        required: true
      },
      quantity: { type: Number }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

OrderSchema.pre('save', { document: true }, async function (next) {
  for (const bookObj of this.books) {
    const book = await BookModel.findOne({ _id: bookObj.book });

    if (bookObj.quantity > book.amount) {
      return next(new ErrorResponse('Nem lehet több könyvet venni mint amennyi van!', 400));
    };

    if (bookObj.quantity == book.amount) {
      await BookModel.updateOne(
        { _id: bookObj.book },
        { $set: { amount: 0 } }
      );
    };

    if (bookObj.quantity < book.amount) {
      await BookModel.updateOne(
        { _id: bookObj.book },
        { $set: { amount: book.amount - bookObj.quantity } }
      );
    };
  }

  await BasketModel.deleteMany({ user: this.user });
  next();
});

const OrderModel = mongoose.model('OrderModel', OrderSchema, 'orders');

export default OrderModel;