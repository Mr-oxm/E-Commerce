const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  amount: { 
    type: Number, 
    required: true 
  },
  method: {
    type: String,
    enum: ['cash', 'credit'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paypalPaymentId: String,
  paypalOrderId: String,
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
