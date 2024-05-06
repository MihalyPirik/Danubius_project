import mongoose from 'mongoose';

const basketSchema = new mongoose.Schema({
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

const BasketModel = mongoose.model('BasketModel', basketSchema, 'baskets');

export default BasketModel;