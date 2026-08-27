import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ProductForm from '../components/ProductForm';
import { updateProduct, getProducts } from '../utils/api'; // Assuming a getProductById might exist, using getProducts to mock

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProducts();
        const found = data.find(p => p._id === id) || data[0]; // Mock finding the product
        setProduct(found);
      } catch (error) {
        toast.error('Failed to load product');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleSubmit = async (productData) => {
    setIsSubmitting(true);
    try {
      await updateProduct(id, productData);
      toast.success('Product updated successfully!');
      navigate('/products');
    } catch (error) {
      toast.error('Failed to update product');
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="loading-state">Loading product details...</div>;

  return (
    <div className="edit-product-page">
      <div className="page-header">
        <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            className="back-btn" 
            onClick={() => navigate('/products')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', paddingRight: '1rem', borderRight: '1px solid var(--border)' }}
          >
            <FiArrowLeft /> Back
          </button>
          <h1 className="page-title">Edit Product</h1>
        </div>
      </div>

      {product && <ProductForm initialData={product} onSubmit={handleSubmit} isSubmitting={isSubmitting} />}
    </div>
  );
};

export default EditProduct;
