import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ProductForm from '../components/ProductForm';
import { addProduct } from '../utils/api';

const AddProduct = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (productData) => {
    setIsSubmitting(true);
    try {
      await addProduct(productData);
      toast.success('Product added successfully!');
      navigate('/products');
    } catch (error) {
      toast.error('Failed to add product');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-product-page">
      <div className="page-header">
        <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            className="back-btn" 
            onClick={() => navigate('/products')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', paddingRight: '1rem', borderRight: '1px solid var(--border)' }}
          >
            <FiArrowLeft /> Back
          </button>
          <h1 className="page-title">Add New Product</h1>
        </div>
      </div>

      <ProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
};

export default AddProduct;
