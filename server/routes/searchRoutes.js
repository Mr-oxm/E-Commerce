// routes/searchRoutes.js
const express = require('express');
const { searchProducts, filterProducts } = require('../controllers/searchController');

const router = express.Router();

router.get('/', searchProducts);
router.get('/filter', filterProducts);

module.exports = router;