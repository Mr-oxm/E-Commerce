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
    await Product.findByIdAndDelete(req.params.id);
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

exports.searchProducts = async (req, res) => {
  try {
    const { keyword } = req.query;
    const products = await Product.find({
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ],
    }).populate('seller', 'username');
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.filterProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice } = req.query;
    let query = {};
    if (category) {
      query.category = category;
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    const products = await Product.find(query).populate('seller', 'username');
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};