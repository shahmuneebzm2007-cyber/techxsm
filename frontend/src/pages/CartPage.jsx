import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/constants';
import './CartPage.css';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  
  // Mock cart logic if context is empty for preview
  const items = cart?.length ? cart : [];
  
  const subtotal = getCartTotal ? getCartTotal() : items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <motion.div 
        className="cart-empty"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="empty-icon-container">
          <FiShoppingBag className="empty-icon" />
        </div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="continue-shopping-btn">
          Continue Shopping <FiArrowRight />
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="cart-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="cart-title">Shopping Cart</h1>
      
      <div className="cart-container">
        <div className="cart-items">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div 
                key={item.id}
                className="cart-item"
                layout
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <div className="cart-item-img-container">
                  <img src={item.images?.[0] || item.image} alt={item.name} />
                </div>
                
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p className="cart-item-price">{formatCurrency(item.price)}</p>
                </div>
                
                <div className="cart-item-actions">
                  <div className="qty-stepper">
                    <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} disabled={item.quantity <= 1}>
                      <FiMinus />
                    </button>
                    <motion.span key={item.quantity} initial={{ scale: 1.5 }} animate={{ scale: 1 }}>
                      {item.quantity}
                    </motion.span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      <FiPlus />
                    </button>
                  </div>
                  
                  <div className="cart-item-total">
                    <motion.div key={item.quantity * item.price} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                      {formatCurrency(item.price * item.quantity)}
                    </motion.div>
                  </div>
                  
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                    <FiTrash2 />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          
          <div className="summary-row">
            <span>Shipping</span>
            <span>
              <span className="strikethrough">Rs 250</span> <span className="free">Free</span>
            </span>
          </div>
          
          <div className="summary-divider"></div>
          
          <div className="summary-row total-row">
            <span>Total</span>
            <span className="total-price">{formatCurrency(total)}</span>
          </div>
          
          <Link to="/checkout" className="checkout-btn">
            Proceed to Checkout
          </Link>
          
          <Link to="/products" className="continue-link">
            Continue Shopping
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CartPage;
