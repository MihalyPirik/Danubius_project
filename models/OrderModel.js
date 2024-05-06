import BasketModel from './BasketModel.js';
import BookModel from './BookModel.js';

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
  // await BasketModel.deleteMany({ user: this.user });
  const books = await BookModel.find({ _id: this.books[0].book });
  console.log(books);
  next();
});

const OrderModel = mongoose.model('OrderModel', OrderSchema, 'orders');

export default OrderModel;