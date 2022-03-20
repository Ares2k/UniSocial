const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const userRouter = require('./Routes/users');

const app = express();
const port = process.env.PORT || 5000;
const db_url = process.env.MONGO_URL;

mongoose.connect(db_url)
.then(console.log('Database Connected...'))
.catch(err => console.log(err));

app.use(cors());
app.use(express.json());

app.use('/api', userRouter);

app.use((req, res, next) => {
  res.json({
    status: 404,
    message: 'Route does not exist'});
});

app.use((err, req, res, next) => {
  res.json({
    status: err.status || 500,
    message: 'Route does not exist'});
});

app.listen(port);