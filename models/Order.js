const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderID: { type: String, unique: true },
  user: {
    name: String,
    email: String,
    phone: String
  },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    fullName: String,
    phone: String
  },
  paymentMethod: { type: String, default: 'COD' },
  paymentStatus: { type: String, enum: ['pending', 'cod'], default: 'cod' },
  orderStatus: { 
    type: String, 
    enum: ['pending', 'confirmed', 'shipped', 'in_transit', 'delivered', 'cancelled'], 
    default: 'pending' 
  }
}, { timestamps: true });

orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const year = new Date().getFullYear();
    const count = await this.constructor.countDocuments();
    this.orderID = `TXM-${year}${(count + 1).toString().padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
