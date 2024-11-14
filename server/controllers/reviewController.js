// New reviewController.js - Contains all review-related functions
const Review = require('../models/Review');
const Product = require('../models/Product');

exports.createReview = async (req, res) => {
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

exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }

    // Check if the user owns this review
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized to update this review' });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();

    res.status(200).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }

    // Check if the user owns this review
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized to delete this review' });
    }

    // Remove review reference from product
    const product = await Product.findById(review.product);
    if (product) {
      product.ratings = product.ratings.filter(
        (ratingId) => ratingId.toString() !== review._id.toString()
      );
      await product.save();
    }

    await review.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};