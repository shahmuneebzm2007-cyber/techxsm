import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiYoutube, FiFacebook } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="techxsm-footer">
      <div className="footer-gradient-bar"></div>
      <div className="footer-container">
        <div className="footer-grid">
          
          <div className="footer-col brand-col">
            <Link to="/" className="footer-logo">TechXSM</Link>
            <p className="brand-desc">
              Your ultimate destination for premium tech gadgets, smartphones, and accessories.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Instagram"><FiInstagram /></a>
              <a href="#" aria-label="Twitter"><FiTwitter /></a>
              <a href="#" aria-label="YouTube"><FiYoutube /></a>
              <a href="#" aria-label="Facebook"><FiFacebook /></a>
            </div>
          </div>

          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Shop</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Categories</h3>
            <ul>
              <li><Link to="/products?category=laptops">Laptops</Link></li>
              <li><Link to="/products?category=smartphones">Smartphones</Link></li>
              <li><Link to="/products?category=accessories">Accessories</Link></li>
              <li><Link to="/products?category=gaming">Gaming</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Contact Us</h3>
            <ul className="contact-info">
              <li>Email: support@techxsm.pk</li>
              <li>Phone: +92 300 1234567</li>
              <li>Address: Plot 45, Gulberg III, Lahore, Pakistan</li>
            </ul>
          </div>

        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} TechXSM. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
