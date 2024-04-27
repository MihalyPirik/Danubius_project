import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
    author: {
        type: String,
        required: [true, 'A szerző megadása kötelező!'],
        trim: true,
        maxlength: [100, 'A szerző nem lehet több mint 100 karakter']
    },
    title: {
        type: String,
        required: [true, 'A cím megadása kötelező!'],
        trim: true,
        maxlength: [500, 'A cím nem lehet több mint 500 karakter']
    },
    ISBN: {
        type: String,
        required: [true, 'Az ISBN szám megadása kötelező!'],
        unique: [true, 'Ez az ISBN szám már szerepel az adatbázisban!'],
        validate: {
            validator: function (value) {
                return /^\d{13}$/.test(value) || /^\d{3}-\d{10}$/.test(value); // 13 számjegy vagy 3 számjegy - 10 számjegy
            },
            message: 'Az ISBN formátuma érvénytelen!'
        }
    },
    publisher: {
        type: String,
        required: [true, 'A kiadó megadása kötelező!'],
        ref: 'UserModel'
    },
    publicationYear: {
        type: Number,
        required: [true, 'A kiadási év megadása kötelező!']
    },
    amount: {
        type: Number,
        required: [true, 'A könyvnek kötelező megadni az elérhető mennyiségét!']
    },
    price: {
        type: Number,
        required: [true, 'A könyvnek kötelező megadni az árát!']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const BookModel = mongoose.model('BookModel', BookSchema, 'books');

export default BookModel;