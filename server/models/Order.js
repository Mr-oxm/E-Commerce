const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'return_requested', 'return_approved', 'return_rejected'],
      default: 'pending'
    },
    selectedVariations: [{
      name: String,
      option: String,
      price: Number
    }]
  }],
  totalAmount: { type: Number, required: true },
  shippingAddress: { type: String, required: true },
  status: {
    type: String,
    enum: [
      'pending',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'return_requested',
      'return_approved',
      'return_rejected'
    ],
    default: 'pending'
  },
  returnReason: { type: String },
  returnRequestDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;