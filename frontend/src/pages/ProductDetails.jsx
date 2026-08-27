import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiMinus, FiPlus, FiStar, FiShoppingCart, FiCheckCircle } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import { formatCurrency } from '../utils/constants';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Mock fallback if api fails
        let data;
        try {
            const res = await api.getProduct(id);
            data = res.data;
        } catch(e) {
            data = {
                id,
                name: 'TechX Pro Wireless Headphones',
                category: 'Audio',
                price: 4999,
                originalPrice: 7999,
                discount: 37,
                rating: 4.5,
                reviewCount: 328,
                description: 'Experience pure sound with active noise cancellation and 40-hour battery life. Designed for audiophiles.',
                specifications: {
                    Brand: 'TechX',
                    Type: 'Over-ear',
                    Connectivity: 'Bluetooth 5.3',
                    Battery: '40 Hours'
                },
                stock: 15,
                images: [
                    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
                    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80',
                    'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80'
                ]
            };
        }
        setProduct(data);
        setMainImage(data.images[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="pd-skeleton-container">
        <div className="pd-skeleton-img pulse"></div>
        <div className="pd-skeleton-info">
          <div className="pd-skeleton-title pulse"></div>
          <div className="pd-skeleton-price pulse"></div>
          <div className="pd-skeleton-desc pulse"></div>
        </div>
      </div>
    );
  }

  if (!product) return <div className="pd-error">Product not found</div>;

  const handleAddToCart = () => {
    setAdding(true);
    addToCart(product, quantity);
    setTimeout(() => setAdding(false), 1000);
  };

  return (
    <motion.div 
      className="product-details-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <button className="pd-back-btn" onClick={() => navigate(-1)}>
        <FiArrowLeft /> Back
      </button>

      <div className="pd-breadcrumb">
        <Link to="/">Home</Link> <span className="sep">/</span> <Link to={`/category/${product.category.toLowerCase()}`}>{product.category}</Link> <span className="sep">/</span> <span className="current">{product.name}</span>
      </div>

      <div className="pd-content">
        <div className="pd-gallery">
          <motion.div 
            className="pd-main-image-container"
            key={mainImage}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <img src={mainImage} alt={product.name} className="pd-main-image" />
          </motion.div>
          <div className="pd-thumbnails">
            {product.images?.map((img, idx) => (
              <img 
                key={idx}
                src={img}
                alt={`Thumb ${idx}`}
                className={`pd-thumb ${mainImage === img ? 'active' : ''}`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        <div className="pd-info">
          <h1 className="pd-title">{product.name}</h1>
          <div className="pd-rating">
            <span className="stars">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className={i < Math.round(product.rating) ? 'star-filled' : 'star-empty'} />
              ))}
            </span>
            <span className="reviews-count">({product.reviewCount} reviews)</span>
          </div>

          <div className="pd-pricing">
            <span className="pd-price">{formatCurrency(product.price)}</span>
            {product.originalPrice && <span className="pd-original-price">{formatCurrency(product.originalPrice)}</span>}
            {product.discount && <span className="pd-discount-badge">{product.discount}% OFF</span>}
          </div>

          <p className="pd-description">{product.description}</p>

          <div className="pd-specs">
            {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
              <div className="pd-spec-item" key={key}>
                <span className="pd-spec-key">{key}</span>
                <span className="pd-spec-value">{value}</span>
              </div>
            ))}
          </div>

          <div className="pd-stock">
            {product.stock > 10 ? (
              <span className="stock-in"><FiCheckCircle /> In Stock</span>
            ) : product.stock > 0 ? (
              <span className="stock-low">Low Stock ({product.stock} left)</span>
            ) : (
              <span className="stock-out">Out of Stock</span>
            )}
          </div>

          <div className="pd-actions">
            <div className="pd-quantity">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}><FiMinus /></button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} disabled={quantity >= product.stock}><FiPlus /></button>
            </div>
            
            <button 
              className={`pd-add-to-cart ${adding ? 'adding' : ''}`} 
              onClick={handleAddToCart}
              disabled={product.stock === 0 || adding}
            >
              {adding ? 'Added to Cart ✓' : <><FiShoppingCart /> Add to Cart</>}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetails;
