// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');
const placeRoutes = require('./routes/places');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use('/api/places', placeRoutes);
app.use('/api/users', userRoutes);

app.listen(5000, () => {
  console.log('Server is running on: http://localhost:5000');
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });
