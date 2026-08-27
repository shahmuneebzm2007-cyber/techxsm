const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const products = require('../data/products');

dotenv.config();

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/techxsm';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // Warning: this clears all existing products
    await Product.deleteMany();
    console.log('Existing products cleared.');

    // Insert new data
    await Product.insertMany(products);
    console.log(`${products.length} products inserted successfully.`);
    
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seedDB();
