const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true, index: true },
  subcategory: { type: String, index: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  description: { type: String },
  specifications: { type: Map, of: String },
  images: [{ type: String }],
  stock: { type: Number, default: 0 },
  sku: { type: String, unique: true },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  tags: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
