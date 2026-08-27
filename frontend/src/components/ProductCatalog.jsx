import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiChevronDown } from 'react-icons/fi';
import ProductCard from './ProductCard';
import LoadingSkeleton from './LoadingSkeleton';
import './ProductCatalog.css';

// Mock API for demonstration if real API is missing
const mockApi = {
  getProducts: () => Promise.resolve({ data: [] }),
  getCategories: () => Promise.resolve({ data: [] })
};

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSubcategory, setActiveSubcategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Featured');
  
  // Try to use a real API if available, fallback to mock
  const api = window.api || mockApi;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.getProducts().catch(() => ({ data: [] })),
          api.getCategories().catch(() => ({ data: [] }))
        ]);
        
        // Populate with mock data if empty for demo purposes
        const fetchedProducts = productsRes.data?.length ? productsRes.data : generateMockProducts();
        const fetchedCategories = categoriesRes.data?.length ? categoriesRes.data : ['Electronics', 'Wearables', 'Audio'];
        
        setProducts(fetchedProducts);
        setCategories(['All', ...fetchedCategories]);
      } catch (error) {
        console.error('Error fetching catalog data:', error);
      } finally {
        // Add a slight delay for smoother skeleton demo
        setTimeout(() => setLoading(false), 1000);
      }
    };
    fetchData();
  }, []);

  // Filter and Sort Logic — memoized so it only recomputes when its actual inputs change,
  // instead of on every render (e.g. when unrelated state like loading toggles)
  const filteredProducts = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    return products
      .filter(p => (activeCategory === 'All' || p.category === activeCategory))
      .filter(p => (activeSubcategory === 'All' || p.subcategory === activeSubcategory))
      .filter(p => p.name.toLowerCase().includes(searchLower))
      .sort((a, b) => {
        switch (sortBy) {
          case 'Price Low-High': return a.price - b.price;
          case 'Price High-Low': return b.price - a.price;
          case 'Rating': return b.rating - a.rating;
          case 'Newest': return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
          default: return 0; // Featured
        }
      });
  }, [products, activeCategory, activeSubcategory, searchQuery, sortBy]);

  // Extract unique subcategories for the active category
  const subcategories = useMemo(() => (
    activeCategory === 'All'
      ? []
      : ['All', ...new Set(products.filter(p => p.category === activeCategory && p.subcategory).map(p => p.subcategory))]
  ), [products, activeCategory]);

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="product-catalog-container">
      <div className="catalog-header">
        <div className="catalog-title-group">
          <h1 className="catalog-title">Discover Tech</h1>
          <p className="catalog-subtitle">Explore our latest premium collection</p>
        </div>
        
        <div className="catalog-controls">
          <div className="search-wrapper">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              className="search-input"
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="sort-wrapper">
            <FiFilter className="filter-icon" />
            <select 
              className="sort-select"
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option>Featured</option>
              <option>Price Low-High</option>
              <option>Price High-Low</option>
              <option>Newest</option>
              <option>Rating</option>
            </select>
            <FiChevronDown className="select-arrow" />
          </div>
        </div>
      </div>

      <div className="filters-section">
        <div className="category-chips">
          {categories.map(cat => (
            <button
              key={cat}
              className={`chip ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory(cat);
                setActiveSubcategory('All');
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {subcategories.length > 1 && (
            <motion.div 
              className="subcategory-chips"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {subcategories.map(sub => (
                <button
                  key={sub}
                  className={`sub-chip ${activeSubcategory === sub ? 'active' : ''}`}
                  onClick={() => setActiveSubcategory(sub)}
                >
                  {sub}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {loading ? (
        <div className="product-grid">
          {[...Array(8)].map((_, i) => (
            <LoadingSkeleton key={i} type="card" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <motion.div 
          className="empty-state"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="empty-icon">🔍</div>
          <h2>No products found</h2>
          <p>We couldn't find any products matching your current filters.</p>
          <button className="reset-btn" onClick={() => {
            setSearchQuery('');
            setActiveCategory('All');
          }}>Reset Filters</button>
        </motion.div>
      ) : (
        <motion.div 
          className="product-grid"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {filteredProducts.map(product => (
            <motion.div key={product._id || product.id} variants={itemVariants} layout>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

// Helper for generating mock data if no API
function generateMockProducts() {
  return Array.from({ length: 12 }).map((_, i) => ({
    id: `prod-${i}`,
    name: `Premium Tech Item ${i + 1}`,
    category: ['Electronics', 'Wearables', 'Audio'][i % 3],
    subcategory: ['Phones', 'Watches', 'Headphones'][i % 3],
    price: 199.99 + (i * 50),
    originalPrice: i % 4 === 0 ? 299.99 + (i * 60) : 199.99 + (i * 50),
    rating: (4 + Math.random()).toFixed(1),
    reviewCount: Math.floor(Math.random() * 500) + 10,
    images: [`https://placehold.co/400x400/1e1e1e/8b5cf6?text=Product+${i+1}`]
  }));
}

export default ProductCatalog;
