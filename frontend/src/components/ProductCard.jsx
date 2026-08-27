import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/constants';
import './ProductCard.css';

const ProductCard = memo(({ product, isLoading }) => {
  // Use a fallback object for destructuring when loading, so we don't crash
  const data = product || {};
  const { addToCart } = useCart ? useCart() : { addToCart: () => {} };

  if (isLoading) {
    return (
      <div className="product-card skeleton">
        <div className="skeleton-img shimmer"></div>
        <div className="skeleton-content">
          <div className="skeleton-text title shimmer"></div>
          <div className="skeleton-text price shimmer"></div>
        </div>
      </div>
    );
  }

  const { _id, id, name, category, price, originalPrice, images, rating, reviewCount } = data;
  const productId = _id || id;
  const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const mainImage = images && images.length > 0 ? images[0] : 'https://placehold.co/400x400/1e1e1e/fff?text=No+Image';

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(data);
  };

  return (
    <motion.div 
      className="product-card"
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Link to={`/products/${productId}`} className="product-link">
        <div className="product-image-container">
          <img src={mainImage} alt={name} className="product-image" />
          {discount > 0 && <div className="discount-badge">-{discount}%</div>}
          <div className="category-badge">{category}</div>
          
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            <FiShoppingCart className="cart-icon" /> Add to Cart
          </button>
        </div>
      </Link>
      
      <div className="product-info">
        <h3 className="product-name" title={name}>{name}</h3>
        <div className="product-rating">
          <FiStar className="star-icon filled" />
          <span className="rating-text">{rating} ({reviewCount})</span>
        </div>
        <div className="product-price-section">
          <span className="current-price">{formatCurrency(price)}</span>
          {discount > 0 && <span className="original-price">{formatCurrency(originalPrice)}</span>}
        </div>
      </div>
    </motion.div>
  );
});

export default ProductCard;
