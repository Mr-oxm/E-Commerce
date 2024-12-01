// controllers/orderController.js
const Order = require('../models/Order');
const Product = require('../models/Product');
const Payment = require('../models/Payment');

exports.createOrder = async (req, res) => {
  try {
    const { products, shippingAddress, phoneNumber, paymentMethod, paymentId } = req.body;
    
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Products array is required' 
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        error: 'Shipping address is required'
      });
    }

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        error: 'Phone number is required'
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        error: 'Payment method is required'
      });
    }

    let totalAmount = 0;
    const orderProducts = [];

    for (let item of products) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return res.status(400).json({ 
          success: false, 
          error: `Product with ID ${item.productId} not found` 
        });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          error: `Insufficient stock for product ${product.name}` 
        });
      }

      const itemPrice = item.price;
      totalAmount += itemPrice * item.quantity;
      
      orderProducts.push({
        product: product._id,
        quantity: item.quantity,
        price: itemPrice,
        seller: product.seller,
        selectedVariations: item.selectedVariations || []
      });

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    let payment;
    if (paymentMethod === 'credit') {
      // For credit card payments, payment should already exist
      payment = await Payment.findOne({paypalPaymentId: paymentId});
      if (!payment) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid payment' 
        });
      }
      
      // Update payment status to completed if it's not already
      if (payment.status !== 'completed') {
        payment.status = 'completed';
        await payment.save();
      }
    } else {
      // For cash payments, create new payment
      payment = await Payment.create({
        amount: totalAmount,
        method: 'cash',
        status: 'pending'
      });
    }

    const order = await Order.create({
      buyer: req.user.id,
      products: orderProducts,
      totalAmount,
      shippingAddress,
      phoneNumber,
      payment: payment._id,
      status: 'pending'
    });

    // Populate the order
    await order.populate([
      {
        path: 'products.product',
        select: 'name price images'
      },
      {
        path: 'products.seller',
        select: 'username email'
      },
      {
        path: 'payment'
      }
    ]);

    res.status(201).json({ 
      success: true, 
      data: order 
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Error creating order' 
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('products.product').populate('buyer', 'username email').populate('payment');
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

    // Update main order status
    order.status = 'cancelled';
    // Update all products' status to cancelled
    order.products.forEach(product => {
      product.status = 'cancelled';
    });
    
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
    const orders = await Order.find({ buyer: req.user.id }).populate('products.product').populate('payment');
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { productId, status } = req.body;
    const order = await Order.findById(req.params.id).populate('payment');
    
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    // Find the specific product in the order
    const productItem = order.products.find(
      p => p._id.toString() === productId && p.seller.toString() === req.user.id
    );

    if (!productItem) {
      return res.status(403).json({ 
        success: false, 
        error: 'Not authorized to update this product status' 
      });
    }

    // Update the specific product status
    productItem.status = status;

    // Update order status based on product statuses
    const allProductsStatus = order.products.every(p => p.status === status);
    if (allProductsStatus) {
      order.status = status;
    }

    // Special cases for cancelled and delivered
    const allDelivered = order.products.every(p => p.status === 'delivered');
    if (allDelivered) {
      order.status = 'delivered';
    }

    const allCancelled = order.products.every(p => p.status === 'cancelled');
    if (allCancelled) {
      order.status = 'cancelled';
    }

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

exports.viewSales = async (req, res) => {
  try {
    const orders = await Order.find({ 'products.seller': req.user.id })
      .populate('products.product').populate('buyer', 'profile.fullName').populate('payment');
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.viewOrdersForProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product || product.seller.toString() !== req.user.id) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    const orders = await Order.find({ 'products.product': req.params.productId }).populate('buyer', 'username email').populate('payment');
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.shipOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    // Check if the seller owns at least one product in the order
    const hasProduct = order.products.some(async (item) => {
      const product = await Product.findById(item.product);
      return product && product.seller.toString() === req.user.id;
    });
    if (!hasProduct) {
      return res.status(403).json({ success: false, error: 'Not authorized to ship this order' });
    }
    order.status = 'shipped';
    await order.save();
    res.status(200).json({ success: true, message: 'Order shipped successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
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

exports.viewOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id }).populate('products.product');
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.returnOrder = async (req, res) => {
  try {
    const { reason, productIds } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    if (order.buyer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }
    
    // Validate that all products are delivered
    const selectedProducts = order.products.filter(p => productIds.includes(p._id.toString()));
    if (selectedProducts.some(p => p.status !== 'delivered')) {
      return res.status(400).json({ 
        success: false, 
        error: 'All selected products must be delivered before requesting return' 
      });
    }
    
    // Update only selected products status
    order.products.forEach(product => {
      if (productIds.includes(product._id.toString())) {
        product.status = 'return_requested';
      }
    });
    
    // Update order status if all products are being returned
    if (order.products.every(p => p.status === 'return_requested')) {
      order.status = 'return_requested';
    }
    
    order.returnReason = reason;
    order.returnRequestDate = Date.now();
    
    await order.save();
    
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.approveReturn = async (req, res) => {
  try {
    const { approved } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    // Verify seller owns at least one product in the order
    const isSeller = await Product.exists({ 
      _id: { $in: order.products.map(p => p.product) }, 
      seller: req.user.id 
    });
    
    if (!isSeller) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }
    
    order.status = approved ? 'return_approved' : 'return_rejected';
    await order.save();
    
    if (approved) {
      // Restore product stock
      for (let item of order.products) {
        const product = await Product.findById(item.product);
        product.stock += item.quantity;
        await product.save();
      }
    }
    
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};