import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { FiShoppingCart, FiSearch, FiMoon, FiSun, FiMenu, FiUser, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

const Navbar = () => {
  const { cartCount } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const [theme, setTheme] = useState('dark');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.body.classList.toggle('light-mode', newTheme === 'light');
  };

  return (
    <nav className="navbar glass">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="text-gradient">TechXSM</span>
        </Link>
        
        <div className="nav-links desktop-only">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Products</Link>
          <Link to="/track" className="nav-link">Track Order</Link>
        </div>

        <div className="nav-actions">
          <div className="search-bar desktop-only">
            <FiSearch className="search-icon" />
            <input type="text" placeholder="Search..." />
          </div>
          
          <button onClick={toggleTheme} className="icon-btn theme-toggle">
            <motion.div animate={{ rotate: theme === 'dark' ? 0 : 360 }} transition={{ duration: 0.5 }}>
              {theme === 'dark' ? <FiMoon /> : <FiSun />}
            </motion.div>
          </button>

          <Link to="/cart" className="icon-btn cart-btn">
            <FiShoppingCart />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  exit={{ scale: 0 }}
                  className="cart-badge"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {isAuthenticated ? (
            <button onClick={logout} className="icon-btn"><FiUser /></button>
          ) : (
            <button onClick={() => navigate('/login')} className="icon-btn"><FiUser /></button>
          )}

          <button className="icon-btn mobile-only" onClick={() => setIsMobileMenuOpen(true)}>
            <FiMenu />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="mobile-menu"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween' }}
          >
            <button className="close-btn" onClick={() => setIsMobileMenuOpen(false)}>
              <FiX />
            </button>
            <div className="mobile-links">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>Products</Link>
              <Link to="/track" onClick={() => setIsMobileMenuOpen(false)}>Track Order</Link>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login / Register</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
