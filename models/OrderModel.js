import BasketModel from './BasketModel.js';

import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
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
  await BasketModel.deleteMany({ user: this.user });
  next();
});

const OrderModel = mongoose.model('OrderModel', OrderSchema, 'orders');

export default OrderModel;