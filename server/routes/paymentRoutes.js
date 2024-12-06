const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createPayPalPayment, executePayPalPayment } = require('../controllers/paymentController');

router.post('/create-paypal-payment', protect, createPayPalPayment);
router.get('/execute-paypal-payment', protect, executePayPalPayment);

module.exports = router;
