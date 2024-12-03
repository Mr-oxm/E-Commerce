const express = require('express');
const { protect } = require('../middleware/auth');
const { 
    getAllProducts,
    getProductById,
    listNewProduct,
    editProductDetails,
    removeProduct,
    getSellerProducts,
    searchProducts,
    filterProducts,
    getSellerProductsById
} = require('../controllers/productController');
const { validate, schemas } = require('../utils/inputValidators');

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/filter', filterProducts);
router.get('/seller/products/:id', getSellerProductsById);
router.get('/:id', getProductById);

// Protected routes
router.use(protect);
router.post('/create', listNewProduct);
router.put('/edit/:id', editProductDetails);
router.delete('/remove/:id', removeProduct);
router.get('/seller/products', getSellerProducts);

module.exports = router;