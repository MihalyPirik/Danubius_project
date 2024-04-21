const express = require('express');
require('dotenv').config();

const mongoose = require('mongoose');
mongoose.set("strictQuery", true); // ellenőrzi a lekérdezéseket, hogy a sémának megfelelnek-e
const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString);
const database = mongoose.connection;

const port = process.env.PORT;

const AuthRouter = require('./routes/authRoutes');
const UserRouter = require('./routes/userRoutes');

database.on('error', (error) => {
  console.log(error);
});
database.once('connected', () => {
  console.log('Database Connected');
});

const app = express();
app.use(express.json());

app.use('/api/auth', AuthRouter);
app.use('/api/user', UserRouter);

app.listen(port, () => {
  console.log(`Server Started at ${port}`);
});