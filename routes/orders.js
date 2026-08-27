const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Tracking = require('../models/Tracking');
const Product = require('../models/Product');
const { authenticate } = require('../middleware/auth');
const { sendOrderConfirmation } = require('../utils/emailService');

// All order routes require authentication
router.use(authenticate);

router.post('/', [
  body('items', 'Items are required').isArray({ min: 1 }),
  body('shippingAddress', 'Shipping address is required').isObject(),
  body('totalAmount', 'Total amount is required').isNumeric()
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const { items, shippingAddress, totalAmount } = req.body;
    
    // Create the order (COD)
    const order = await Order.create({
      user: {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone
      },
      items,
      totalAmount,
      shippingAddress,
      paymentMethod: 'COD',
      paymentStatus: 'cod',
      orderStatus: 'confirmed' // Auto confirm for COD
    });

    // Create tracking entry
    const tracking = await Tracking.create({
      orderId: order._id,
      orderID: order.orderID,
      status: 'confirmed',
      updates: [{
        status: 'confirmed',
        message: 'Order received and confirmed (COD).',
        location: 'Warehouse'
      }]
    });

    // Reduce stock
    for (const item of items) {
      if (item.productId) {
        await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
      }
    }

    // Send email
    await sendOrderConfirmation(order);

    res.status(201).json({ success: true, data: { order, tracking } });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const orders = await Order.find({ 'user.email': req.user.email }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderID: req.params.id, 'user.email': req.user.email });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    
    const tracking = await Tracking.findOne({ orderId: order._id });
    
    res.json({ success: true, data: { order, tracking } });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
