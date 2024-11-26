const express = require('express');
const { protect } = require('../middleware/auth');
const { 
    getAllProducts,
    getProductById,
    getFeaturedProducts,
    getRecommendedProducts,
    calculatePrice,
    listNewProduct,
    editProductDetails,
    removeProduct,
    getSellerProducts,
    manageInventory,
    searchProducts,
    filterProducts,
    getSellerProductsById
} = require('../controllers/productController');

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/recommended', getRecommendedProducts);
router.get('/search', searchProducts);
router.get('/filter', filterProducts);
router.get('/seller/products/:id', getSellerProductsById);
router.get('/:id', getProductById);
router.post('/calculate-price', calculatePrice);

// Protected routes
router.use(protect);
router.post('/create', listNewProduct);
router.put('/edit/:id', editProductDetails);
router.delete('/remove/:id', removeProduct);
router.get('/seller/products', getSellerProducts);
router.put('/inventory', manageInventory);

module.exports = router;