import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getProducts, deleteProduct } from '../utils/api';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const navigate = useNavigate();

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'audio', label: 'Audio' },
    { value: 'charging', label: 'Charging' },
    { value: 'wearables', label: 'Wearables' },
    { value: 'phone-accessories', label: 'Phone Accessories' },
    { value: 'computer-accessories', label: 'Computer Accessories' },
    { value: 'smart-home', label: 'Smart Home' }
  ];

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const formatCurrency = (amount) => {
    return `Rs ${new Intl.NumberFormat('en-PK').format(amount)}`;
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="products-page">
      <div className="page-header">
        <h1 className="page-title">Products Inventory</h1>
        <button className="btn-primary" onClick={() => navigate('/products/new')}>
          <FiPlus /> Add Product
        </button>
      </div>

      <div className="filters-bar glass-panel">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-box">
          <FiFilter className="filter-icon" />
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="glass-panel table-container">
        {loading ? (
          <div className="loading-state">Loading products...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product._id}>
                  <td>
                    <div className="product-cell">
                      <div className="product-thumb">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} />
                        ) : (
                          <div className="thumb-placeholder">IMG</div>
                        )}
                      </div>
                      <span className="product-name">{product.name}</span>
                    </div>
                  </td>
                  <td className="capitalize">{product.category.replace('-', ' ')}</td>
                  <td className="font-semibold">{formatCurrency(product.price)}</td>
                  <td>
                    <span className={`stock-badge ${product.stock < 10 ? 'low-stock' : 'in-stock'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    {product.featured ? <span className="badge confirmed">Featured</span> : <span className="badge pending">Standard</span>}
                  </td>
                  <td>
                    <div className="action-buttons-row">
                      <button className="icon-btn edit" onClick={() => navigate(`/products/edit/${product._id}`)}>
                        <FiEdit2 />
                      </button>
                      <button className="icon-btn delete" onClick={() => handleDelete(product._id)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Products;
