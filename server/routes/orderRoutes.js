// routes/orderRoutes.js
const express = require('express');
const { createOrder, getOrderById, cancelOrder, getOrderHistory, updateOrderStatus, getShippingDetails } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', createOrder);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);
router.get('/', getOrderHistory);
router.put('/:id/status', updateOrderStatus);
router.get('/:id/shipping', getShippingDetails);

module.exports = router;