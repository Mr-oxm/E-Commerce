const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createPayPalPayment, executePayPalPayment, getPayment, getPaymentByPayPalId } = require('../controllers/paymentController');

router.post('/create-paypal-payment', protect, createPayPalPayment);
router.get('/execute-paypal-payment', protect, executePayPalPayment);
router.get('/:id', protect, getPayment);
router.get('/paypal/:paypalPaymentId', protect, getPaymentByPayPalId);

module.exports = router;
