const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const trackingRoutes = require('./routes/tracking');
const adminRoutes = require('./routes/admin');

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(compression()); // gzip responses for faster load, especially useful on Pakistan's average mobile connection speeds
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// DB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/techxsm')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
