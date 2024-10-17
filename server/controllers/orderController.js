// controllers/orderController.js
const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  try {
    const { products, shippingAddress } = req.body;
    let totalAmount = 0;
    const orderProducts = [];

    for (let item of products) {
      const product = await Product.findById(item.productId);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ success: false, error: 'Product not available' });
      }
      totalAmount += product.price * item.quantity;
      orderProducts.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      buyer: req.user.id,
      products: orderProducts,
      totalAmount,
      shippingAddress,
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('products.product').populate('buyer', 'username email');
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    // Check if the user is the buyer or the seller of any product in the order
    const isBuyer = order.buyer._id.toString() === req.user.id;
    const isSeller = await Product.exists({ _id: { $in: order.products.map(p => p.product._id) }, seller: req.user.id });
    if (!isBuyer && !isSeller) {
      return res.status(403).json({ success: false, error: 'Not authorized to view this order' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    if (order.buyer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized to cancel this order' });
    }
    if (order.status !== 'pending') {
      return res.status(400).json({ success: false, error: 'Order cannot be cancelled' });
    }
    order.status = 'cancelled';
    await order.save();
    
    // Restore product stock
    for (let item of order.products) {
      const product = await Product.findById(item.product);
      product.stock += item.quantity;
      await product.save();
    }
    
    res.status(200).json({ success: true, message: 'Order cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id }).populate('products.product');
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
    try {
      const { status } = req.body;
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }
      // Check if the user is the seller of any product in the order
      const isSeller = await Product.exists({ _id: { $in: order.products.map(p => p.product) }, seller: req.user.id });
      if (!isSeller) {
        return res.status(403).json({ success: false, error: 'Not authorized to update this order' });
      }
      order.status = status;
      await order.save();
      res.status(200).json({ success: true, data: order });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
  
  exports.getShippingDetails = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }
      // Check if the user is the buyer or the seller of any product in the order
      const isBuyer = order.buyer.toString() === req.user.id;
      const isSeller = await Product.exists({ _id: { $in: order.products.map(p => p.product) }, seller: req.user.id });
      if (!isBuyer && !isSeller) {
        return res.status(403).json({ success: false, error: 'Not authorized to view shipping details' });
      }
      // In a real application, you might want to integrate with a shipping API to get real-time shipping information
      const shippingDetails = {
        address: order.shippingAddress,
        status: order.status,
        estimatedDelivery: new Date(order.createdAt.getTime() + 7*24*60*60*1000) // Example: delivery in 7 days
      };
      res.status(200).json({ success: true, data: shippingDetails });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };