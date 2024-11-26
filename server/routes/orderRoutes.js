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
    shipOrder,
    returnOrder
} = require('../controllers/orderController');

const router = express.Router();

router.use(protect);

// Seller routes
router.get('/sales', viewSales);
// Buyer routes
router.post('/', createOrder);
router.get('/history', getOrderHistory);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);
router.get('/:id/shipping', getShippingDetails);

router.get('/product/:productId', viewOrdersForProduct);
router.put('/:id/status', updateOrderStatus);
router.put('/:id/ship', shipOrder);
router.post('/:id/return', returnOrder);
module.exports = router;