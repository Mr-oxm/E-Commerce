const express = require('express');
const { protect } = require('../middleware/auth');
const {
    createOrder,
    getOrderById,
    cancelOrder,
    getOrderHistory,
    updateOrderStatus,
    getShippingDetails,
    viewSales,
    viewOrdersForProduct,
    shipOrder
} = require('../controllers/orderController');

const router = express.Router();

router.use(protect);

// Buyer routes
router.post('/', createOrder);
router.get('/history', getOrderHistory);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);
router.get('/:id/shipping', getShippingDetails);

// Seller routes
router.get('/sales', viewSales);
router.get('/product/:productId', viewOrdersForProduct);
router.put('/:id/status', updateOrderStatus);
router.put('/:id/ship', shipOrder);

module.exports = router;