// routes/buyerRoutes.js
const express = require('express');
const { browseProducts, viewProductDetails, addToCart, removeFromCart, checkout, viewOrder, rateProduct, viewOrderHistory, cancelOrder } = require('../controllers/buyerController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/products', browseProducts);
router.get('/products/:id', viewProductDetails);
router.post('/cart/add', addToCart);
router.post('/cart/remove', removeFromCart);
router.post('/checkout', checkout);
router.get('/orders/:id', viewOrder);
router.post('/rate', rateProduct);
router.get('/orders', viewOrderHistory);
router.put('/orders/:id/cancel', cancelOrder);

module.exports = router;