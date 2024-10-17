// controllers/sellerController.js
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.listNewProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, images } = req.body;
    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      images,
      seller: req.user.id,
    });
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.editProductDetails = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product || product.seller.toString() !== req.user.id) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.removeProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || product.seller.toString() !== req.user.id) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    await product.remove();
    res.status(200).json({ success: true, message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id });

    if (!products) {
      return res.status(404).json({
        success: false,
        error: 'No products found for this seller'
      });
    }

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

exports.viewSales = async (req, res) => {
  try {
    const orders = await Order.find({ 'products.product': { $in: await Product.find({ seller: req.user.id }).select('_id') } })
      .populate('products.product');
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
    const orders = await Order.find({ 'products.product': req.params.productId }).populate('buyer', 'username email');
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

exports.manageInventory = async (req, res) => {
  try {
    const { productId, newStock } = req.body;
    const product = await Product.findById(productId);
    if (!product || product.seller.toString() !== req.user.id) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    product.stock = newStock;
    await product.save();
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};