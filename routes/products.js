const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const categories = require('../data/categories');

router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, subcategory, search, sort, minPrice, maxPrice, featured } = req.query;
    
    let query = {};
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (featured) query.featured = featured === 'true';
    if (search) query.name = { $regex: search, $options: 'i' };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 }; // newest
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };

    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .lean(); // .lean() skips Mongoose document hydration for faster read-only responses
    
    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get('/categories', (req, res) => {
  res.json({ success: true, data: categories });
});

router.get('/featured', async (req, res, next) => {
  try {
    const products = await Product.find({ featured: true }).limit(8).lean();
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
