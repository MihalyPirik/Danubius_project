import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from './swagger_output.json' assert { type: 'json' };

import AuthRouter from './routes/authRoutes.js';
import UserRouter from './routes/userRoutes.js';
import BookRouter from './routes/bookRoutes.js';
import BasketRouter from './routes/basketRoutes.js';
import OrderRouter from './routes/orderRoutes.js';
import { errorHandler } from './middlewares/error.js';

dotenv.config();

mongoose.set('strictQuery', true);
const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString);
const database = mongoose.connection;

const createApp = () => {
  const app = express();

  database.on('error', (error) => {
    console.log(error);
  });
  database.once('connected', () => {
    console.log('Database Connected');
  });

  app.use(express.json());
  app.use(cookieParser());
  app.use(morgan('dev'));
  app.use(mongoSanitize());
  app.use(helmet({ crossOriginResourcePolicy: false }));
  const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
  app.use(limiter);
  app.use(cors());

  app.use('/api', AuthRouter, UserRouter, BookRouter, BasketRouter, OrderRouter);
  app.use(errorHandler);

  return app;
};

const app = createApp();

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerFile)
);
app.listen(process.env.PORT || 3001, () => {
  console.log(`Listening on port ${process.env.PORT || 3001}`);
});

export default createApp;