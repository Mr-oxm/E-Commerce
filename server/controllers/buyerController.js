// controllers/buyerController.js
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');

exports.browseProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('seller', 'username');
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.viewProductDetails = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'username').populate('ratings');
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.addToCart = async (req, res) => {
  // This would typically be handled on the client-side
  res.status(200).json({ success: true, message: 'Product added to cart' });
};

exports.removeFromCart = async (req, res) => {
  // This would typically be handled on the client-side
  res.status(200).json({ success: true, message: 'Product removed from cart' });
};

exports.checkout = async (req, res) => {
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

exports.viewOrder = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id).populate('products.product');
      if (!order || order.buyer.toString() !== req.user.id) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }
      res.status(200).json({ success: true, data: order });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
  
  exports.rateProduct = async (req, res) => {
    try {
      const { productId, rating, comment } = req.body;
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }
      const review = await Review.create({
        user: req.user.id,
        product: productId,
        rating,
        comment,
      });
      product.ratings.push(review._id);
      await product.save();
      res.status(201).json({ success: true, data: review });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
  
  exports.viewOrderHistory = async (req, res) => {
    try {
      const orders = await Order.find({ buyer: req.user.id }).populate('products.product');
      res.status(200).json({ success: true, data: orders });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
  
  exports.cancelOrder = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order || order.buyer.toString() !== req.user.id) {
        return res.status(404).json({ success: false, error: 'Order not found' });
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