// routes/productRoutes.js
const express = require('express');
const { getAllProducts, getProductById, getFeaturedProducts, getRecommendedProducts, calculatePrice } = require('../controllers/productController');

const router = express.Router();

router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/recommended', getRecommendedProducts);
router.get('/:id', getProductById);
router.post('/calculate-price', calculatePrice);

module.exports = router;