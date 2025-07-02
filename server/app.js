require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// import routes
const categoryRoutes     = require('./routes/CategoryRoutes');
const brandRoutes        = require('./routes/BrandRoutes');
const productRoutes      = require('./routes/ProductRoutes');
const variantRoutes      = require('./routes/ProductVariantRoutes');
const offerRoutes        = require('./routes/ProductOfferRoutes');
const reviewRoutes       = require('./routes/ReviewRoutes');
const filterRoutes       = require('./routes/FilterRoutes');
const optionRoutes       = require('./routes/FilterOptionRoutes');
const productFilterRoutes= require('./routes/ProductFilterRoutes');
const userRoutes         = require('./routes/UserRoutes');

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));        // allow all origins for now
app.use(express.json());       // parse JSON bodies

// mount routes
app.use('/api/categories',     categoryRoutes);
app.use('/api/brands',         brandRoutes);
app.use('/api/products',       productRoutes);
app.use('/api/variants',       variantRoutes);
app.use('/api/offers',         offerRoutes);
app.use('/api/reviews',        reviewRoutes);
app.use('/api/filters',        filterRoutes);
app.use('/api/options',        optionRoutes);
app.use('/api/product-filters',productFilterRoutes);
app.use('/api/users'          ,userRoutes);

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });
