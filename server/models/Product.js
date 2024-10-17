const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: [{ type: String, required: true }],
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stock: { type: Number, required: true },
  images: [String],
  ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
