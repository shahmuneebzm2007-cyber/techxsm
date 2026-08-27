import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiTruck, FiDollarSign, FiStar, FiClock, FiArrowRight } from 'react-icons/fi';
import './Home.css';
// import Hero from '../components/Hero'; // Assuming it exists

const categories = [
  { slug: 'laptops', name: 'Laptops', icon: '💻', count: 120 },
  { slug: 'smartphones', name: 'Smartphones', icon: '📱', count: 250 },
  { slug: 'accessories', name: 'Accessories', icon: '🎧', count: 300 },
  { slug: 'gaming', name: 'Gaming', icon: '🎮', count: 80 },
];

const features = [
  { icon: <FiTruck />, title: 'Free Shipping', desc: 'On orders over Rs 2,500' },
  { icon: <FiDollarSign />, title: 'Cash on Delivery', desc: 'Pay when you receive' },
  { icon: <FiStar />, title: 'Premium Quality', desc: 'Top brand guarantees' },
  { icon: <FiClock />, title: '24/7 Support', desc: 'Always here to help' },
];

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 },
};

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    // Mock API fetch
    const mockProducts = [
      { id: 1, name: 'TechX Pro Laptop', price: 1299, image: 'https://via.placeholder.com/200' },
      { id: 2, name: 'XPhone 13 Max', price: 999, image: 'https://via.placeholder.com/200' },
      { id: 3, name: 'Wireless Earbuds', price: 149, image: 'https://via.placeholder.com/200' },
      { id: 4, name: 'Gaming Mouse', price: 79, image: 'https://via.placeholder.com/200' },
    ];
    setFeaturedProducts(mockProducts);
  }, []);

  return (
    <motion.div
      className="home-page"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.4 }}
    >
      {/* <Hero /> */}
      
      <section className="featured-section">
        <div className="container">
          <h2 className="section-title">
            Featured Products
            <span className="underline"></span>
          </h2>
          <motion.div 
            className="products-grid"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {featuredProducts.map(product => (
              <div key={product.id} className="product-card">
                <img src={product.image} alt={product.name} className="product-image" />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="price">${product.price}</p>
                  <button className="add-btn">Add to Cart</button>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">
            Shop by Category
            <span className="underline"></span>
          </h2>
          <div className="categories-grid">
            {categories.map((cat, index) => (
              <motion.div 
                key={cat.slug}
                className="category-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link to={`/products?category=${cat.slug}`}>
                  <span className="cat-icon">{cat.icon}</span>
                  <h3>{cat.name}</h3>
                  <p>{cat.count} products</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="why-us-section">
        <div className="container">
          <h2 className="section-title">
            Why TechXSM
            <span className="underline"></span>
          </h2>
          <div className="features-grid">
            {features.map((feat, index) => (
              <motion.div 
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <div className="icon-wrapper">{feat.icon}</div>
                <h3>{feat.title}</h3>
                <p>{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="newsletter-section">
        <div className="container">
          <motion.div 
            className="newsletter-box"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Stay Updated</h2>
            <p>Subscribe to our newsletter for the latest tech news and exclusive offers.</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email address" required />
              <button type="submit">
                Subscribe <FiArrowRight />
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
