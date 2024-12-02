const express = require('express');
const { protect } = require('../middleware/auth');
const {
    createOrder,
    getOrderById,
    cancelOrder,
    getOrderHistory,
    updateOrderStatus,
    viewSales,
    returnOrder
} = require('../controllers/orderController');

const router = express.Router();

router.use(protect);


router.get('/sales', viewSales);
router.post('/', createOrder);
router.get('/history', getOrderHistory);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);
router.put('/:id/status', updateOrderStatus);
router.post('/:id/return', returnOrder);
module.exports = router;