// controllers/productController.js
const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('seller', 'username').populate('ratings');
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'profile.fullName').populate('ratings');
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
    const { productId, quantity, selectedVariations } = req.body;
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    let totalPrice;

    if (product.hasVariations && selectedVariations) {
      // Validate that all required variations are selected
      if (selectedVariations.length !== product.variations.length) {
        return res.status(400).json({ 
          success: false, 
          error: 'Please select all required variations' 
        });
      }

      // Find the selected option's price
      const selectedOption = product.variations[0].options.find(
        option => option._id.toString() === selectedVariations[0].optionId
      );

      if (!selectedOption) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid variation selection' 
        });
      }

      totalPrice = selectedOption.price * quantity;
    } else {
      totalPrice = product.price * quantity;
    }

    res.status(200).json({ 
      success: true, 
      data: { 
        totalPrice,
        basePrice: product.hasVariations ? product.basePrice : product.price,
        quantity,
        selectedVariations 
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


exports.listNewProduct = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      price, 
      category, 
      stock, 
      images, 
      hasVariations, 
      variations, 
      basePrice 
    } = req.body;

    // Validate variations if they exist
    if (hasVariations) {
      if (!variations || !Array.isArray(variations) || variations.length === 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'Product variations are required when hasVariations is true' 
        });
      }

      // Validate each variation
      for (const variation of variations) {
        if (!variation.name || !variation.options || variation.options.length === 0) {
          return res.status(400).json({ 
            success: false, 
            error: 'Each variation must have a name and at least one option' 
          });
        }

        // Validate each option
        for (const option of variation.options) {
          if (!option.name || !option.price || !option.stock) {
            return res.status(400).json({ 
              success: false, 
              error: 'Each option must have a name, price, and stock' 
            });
          }
        }
      }
    }

    const product = await Product.create({
      name,
      description,
      price: hasVariations ? basePrice : price,
      category,
      stock: hasVariations ? variations.reduce((total, variation) => 
        total + variation.options.reduce((sum, option) => sum + option.stock, 0), 0) : stock,
      images,
      seller: req.user.id,
      hasVariations,
      variations,
      basePrice: hasVariations ? basePrice : undefined
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

    const { 
      hasVariations, 
      variations, 
      basePrice,
      price,
      stock,
      ...otherDetails 
    } = req.body;

    // Validate variations if they exist
    if (hasVariations) {
      if (!variations || !Array.isArray(variations) || variations.length === 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'Product variations are required when hasVariations is true' 
        });
      }

      // Calculate total stock from variations
      const totalStock = variations.reduce((total, variation) => 
        total + variation.options.reduce((sum, option) => sum + option.stock, 0), 0);

      product = await Product.findByIdAndUpdate(
        req.params.id, 
        {
          ...otherDetails,
          hasVariations,
          variations,
          basePrice,
          price: basePrice, // Use basePrice as the main price when variations exist
          stock: totalStock
        },
        {
          new: true,
          runValidators: true,
        }
      );
    } else {
      // Update without variations
      product = await Product.findByIdAndUpdate(
        req.params.id,
        {
          ...otherDetails,
          hasVariations: false,
          variations: [],
          basePrice: undefined,
          price,
          stock
        },
        {
          new: true,
          runValidators: true,
        }
      );
    }

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
    const { productId, newStock, variationUpdates } = req.body;
    const product = await Product.findById(productId);
    
    if (!product || product.seller.toString() !== req.user.id) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    if (product.hasVariations && variationUpdates) {
      // Update stock for specific variations
      product.variations = product.variations.map(variation => {
        const updateData = variationUpdates.find(update => update.variationId === variation._id.toString());
        if (updateData) {
          variation.options = variation.options.map(option => {
            const optionUpdate = updateData.options.find(update => update.optionId === option._id.toString());
            if (optionUpdate) {
              option.stock = optionUpdate.newStock;
            }
            return option;
          });
        }
        return variation;
      });

      // Calculate and update total stock
      product.stock = product.variations.reduce((total, variation) => 
        total + variation.options.reduce((sum, option) => sum + option.stock, 0), 0);
    } else {
      // Update stock for non-variation product
      product.stock = newStock;
    }

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
    })
    .populate('seller', 'username')
    .populate('ratings');
    
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.filterProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice } = req.query;
    let query = {};

    // Add category filter if provided
    if (category && category !== 'All Categories') {
      query.category = { $in: [category] };
    }

    // Add price range filter if provided
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(query)
      .populate('seller', 'username')
      .populate('ratings');

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getSellerProductsById = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.params.id }).populate('ratings');

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