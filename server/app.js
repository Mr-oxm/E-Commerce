// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const { createRouteHandler } = require("uploadthing/express");
const uploadRouter = require('./utils/uploadthing');

const app = express();

app.use(cors());
app.use(express.json());

app.use(
    "/api/uploadthing",
    createRouteHandler({
      router: uploadRouter,
      config: { token: process.env.UPLOADTHING_TOKEN },
    }),
  );
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);

app.use(errorHandler);

module.exports = app;

