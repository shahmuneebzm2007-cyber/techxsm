const mongoose = require('mongoose');

const trackingSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  orderID: { type: String }, // Human readable ID
  trackingID: { type: String, unique: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'shipped', 'in_transit', 'delivered'],
    default: 'pending'
  },
  courierName: { type: String },
  courierTrackingId: { type: String },
  updates: [{
    status: String,
    message: String,
    location: String,
    timestamp: { type: Date, default: Date.now }
  }],
  estimatedDelivery: { type: Date },
  currentLocation: { type: String }
}, { timestamps: true });

trackingSchema.pre('save', async function(next) {
  if (this.isNew) {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    this.trackingID = `TXM-TRK-${randomSuffix}`;
  }
  next();
});

module.exports = mongoose.model('Tracking', trackingSchema);
