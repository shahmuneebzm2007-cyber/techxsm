import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import api from '../utils/api';
import './Checkout.css';
import { slideUp, formatCurrency } from '../utils/constants';

const Checkout = () => {
  const { cartTotal, cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', city: '', zip: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.phone) {
      toast.error('Please fill all required fields');
      return;
    }
    
    setLoading(true);
    try {
      const orderRes = await api.createOrder({
        items: cartItems,
        total: cartTotal,
        shipping: formData,
        paymentMethod: 'COD'
      });
      
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${orderRes.data.id}`);
    } catch (err) {
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="checkout-container" variants={slideUp} initial="hidden" animate="visible">
      <div className="checkout-content glass">
        <h2>Checkout</h2>
        <form onSubmit={handlePlaceOrder} className="checkout-form">
          <div className="form-section">
            <h3>Shipping Details</h3>
            <div className="input-group">
              <input type="text" name="name" placeholder="Full Name *" onChange={handleChange} required />
              <input type="email" name="email" placeholder="Email" onChange={handleChange} />
            </div>
            <div className="input-group">
              <input type="tel" name="phone" placeholder="Phone Number (e.g. 03xx-xxxxxxx) *" onChange={handleChange} required pattern="^(\+92|0)3[0-9]{2}[-\s]?[0-9]{7}$" title="Enter a valid Pakistani mobile number" />
            </div>
            <textarea name="address" placeholder="Delivery Address *" onChange={handleChange} required rows="3"></textarea>
            <div className="input-group">
              <input type="text" name="city" placeholder="City *" onChange={handleChange} required />
              <input type="text" name="zip" placeholder="Postal Code *" onChange={handleChange} required />
            </div>
          </div>

          <div className="form-section payment-section">
            <h3>Payment Method</h3>
            <div className="cod-badge">
              <span>🚚 Cash on Delivery (COD)</span>
              <p>Pay conveniently at your doorstep when the order arrives.</p>
            </div>
          </div>

          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatCurrency(cartTotal)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span className="text-gradient">{formatCurrency(cartTotal)}</span>
            </div>
          </div>

          <button type="submit" className="place-order-btn" disabled={loading || cartItems.length === 0}>
            {loading ? 'Processing...' : 'Place Order (COD)'}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default Checkout;
