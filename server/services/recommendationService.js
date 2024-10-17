// services/recommendationService.js
const Product = require('../models/Product');
const Order = require('../models/Order');

const getRecommendedProducts = async (userId) => {
  // Get user's purchase history
  const userOrders = await Order.find({ buyer: userId }).populate('products.product');
  
  // Extract categories and sellers from purchase history
  const purchasedCategories = new Set();
  const purchasedSellers = new Set();
  userOrders.forEach(order => {
    order.products.forEach(item => {
      purchasedCategories.add(item.product.category);
      purchasedSellers.add(item.product.seller.toString());
    });
  });

  // Find products in the same categories or from the same sellers
  const recommendedProducts = await Product.find({
    $or: [
      { category: { $in: Array.from(purchasedCategories) } },
      { seller: { $in: Array.from(purchasedSellers) } }
    ],
    _id: { $nin: userOrders.flatMap(order => order.products.map(item => item.product._id)) } // Exclude already purchased products
  }).limit(10);

  return recommendedProducts;
};

module.exports = { getRecommendedProducts };