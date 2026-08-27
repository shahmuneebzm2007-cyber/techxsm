const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Tracking = require('../models/Tracking');
const { adminAuth } = require('../middleware/auth');
const { sendShippingNotification } = require('../utils/emailService');

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });
    return res.json({ success: true, data: { token } });
  }
  return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
});

router.use(adminAuth);

router.get('/orders', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    let query = {};
    if (status) query.orderStatus = status;

    const skip = (page - 1) * limit;
    const orders = await Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
});

router.get('/orders/:id', async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderID: req.params.id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    const tracking = await Tracking.findOne({ orderId: order._id });
    res.json({ success: true, data: { order, tracking } });
  } catch (error) {
    next(error);
  }
});

router.put('/orders/:id/ship', async (req, res, next) => {
  try {
    const { courierName, courierTrackingId, estimatedDelivery } = req.body;
    const order = await Order.findOne({ orderID: req.params.id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.orderStatus = 'shipped';
    await order.save();

    let tracking = await Tracking.findOne({ orderId: order._id });
    if (tracking) {
      tracking.status = 'shipped';
      tracking.courierName = courierName;
      tracking.courierTrackingId = courierTrackingId;
      tracking.estimatedDelivery = estimatedDelivery;
      tracking.updates.push({
        status: 'shipped',
        message: `Order shipped via ${courierName}. Tracking ID: ${courierTrackingId}`,
        location: 'Courier Facility'
      });
      await tracking.save();
    }
    
    await sendShippingNotification(order, tracking);
    res.json({ success: true, data: { order, tracking } });
  } catch (error) {
    next(error);
  }
});

router.put('/orders/:id/status', async (req, res, next) => {
  try {
    const { status, message, location } = req.body;
    const order = await Order.findOne({ orderID: req.params.id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.orderStatus = status;
    await order.save();

    let tracking = await Tracking.findOne({ orderId: order._id });
    if (tracking) {
      tracking.status = status;
      tracking.updates.push({
        status,
        message: message || `Order status updated to ${status}`,
        location: location || ''
      });
      await tracking.save();
    }
    res.json({ success: true, data: { order, tracking } });
  } catch (error) {
    next(error);
  }
});

router.get('/stats', async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
    const shippedOrders = await Order.countDocuments({ orderStatus: 'shipped' });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'delivered' });
    
    const revenueAggregation = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].total : 0;
    
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);
    
    res.json({
      success: true,
      data: { totalOrders, pendingOrders, shippedOrders, deliveredOrders, totalRevenue, recentOrders }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/products', async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

router.put('/products/:id', async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

router.delete('/products/:id', async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
