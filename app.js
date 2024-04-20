const express = require('express');
const mongoose = require('mongoose');

const port = 3000;

mongoose.set('strictQuery', true);

const app = express();

app.use(express.json());

app.listen(port, () => {
  console.log(`Server Started at ${port}`)
})