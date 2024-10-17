// controllers/productController.js
const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('seller', 'username');
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getProductById = async (req, res) => {
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

exports.getFeaturedProducts = async (req, res) => {
  try {
    // This is a simple implementation. You might want to add more complex logic to determine featured products.
    const featuredProducts = await Product.find().sort('-ratings').limit(5).populate('seller', 'username');
    res.status(200).json({ success: true, data: featuredProducts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getRecommendedProducts = async (req, res) => {
  try {
    // This is a placeholder. In a real application, you'd implement a recommendation algorithm.
    const recommendedProducts = await Product.find().sort('-createdAt').limit(5).populate('seller', 'username');
    res.status(200).json({ success: true, data: recommendedProducts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.calculatePrice = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    const totalPrice = product.price * quantity;
    // You might want to add logic for discounts, shipping, etc. here
    res.status(200).json({ success: true, data: { totalPrice } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};