import mongoose from 'mongoose';

const BasketSchema = new mongoose.Schema({
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

const BasketModel = mongoose.model('BasketModel', BasketSchema, 'baskets');

export default BasketModel;