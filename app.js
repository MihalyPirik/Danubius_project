import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';

import AuthRouter from './routes/authRoutes.js';
import UserRouter from './routes/userRoutes.js';
import BookRouter from './routes/bookRoutes.js';
import { errorHandler } from './middlewares/error.js';

dotenv.config();

mongoose.set('strictQuery', true); // ellenőrzi a lekérdezéseket, hogy a sémának megfelelnek-e
const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString);
const database = mongoose.connection;

const port = process.env.PORT;

database.on('error', (error) => {
  console.log(error);
});
database.once('connected', () => {
  console.log('Database Connected');
});

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev')) // naplózási middleware
app.use(mongoSanitize());
app.use(helmet({
  crossOriginResourcePolicy: false
}));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 10 perc
  max: 100
});
app.use(limiter);
app.use(cors());

app.use('/api/auth', AuthRouter);
app.use('/api/user', UserRouter);
app.use('/api/books', BookRouter);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server Started at ${port}`);
});