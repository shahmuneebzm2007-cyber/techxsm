import React, { useState, useEffect } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import './ProductForm.css';

const categories = {
  audio: ['earbuds', 'headphones', 'speakers'],
  charging: ['power-banks', 'chargers', 'cables'],
  wearables: ['smartwatches', 'fitness-bands'],
  'phone-accessories': ['cases', 'screen-protectors', 'mounts'],
  'computer-accessories': ['keyboards', 'mice', 'hubs'],
  'smart-home': ['smart-plugs', 'lights', 'cameras']
};

const ProductForm = ({ initialData, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'audio',
    subcategory: 'earbuds',
    price: '',
    originalPrice: '',
    stock: '',
    sku: '',
    description: '',
    images: [''],
    tags: '',
    featured: false,
    ...initialData
  });

  const [specs, setSpecs] = useState(
    initialData?.specs 
      ? Object.entries(initialData.specs).map(([key, value]) => ({ key, value }))
      : [{ key: '', value: '' }]
  );

  useEffect(() => {
    // Update subcategory if category changes and current subcategory is invalid
    if (!categories[formData.category]?.includes(formData.subcategory)) {
      setFormData(prev => ({
        ...prev,
        subcategory: categories[formData.category]?.[0] || ''
      }));
    }
  }, [formData.category]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };

  const addSpec = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const removeSpec = (index) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Format specs array back to object
    const specsObject = {};
    specs.forEach(spec => {
      if (spec.key && spec.value) {
        specsObject[spec.key] = spec.value;
      }
    });

    const submitData = {
      ...formData,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      stock: Number(formData.stock),
      images: formData.images.filter(img => img.trim() !== ''),
      tags: formData.tags ? (typeof formData.tags === 'string' ? formData.tags.split(',').map(t => t.trim()) : formData.tags) : [],
      specs: specsObject
    };

    onSubmit(submitData);
  };

  return (
    <form className="product-form glass-panel" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group span-2">
          <label className="form-label">Product Name</label>
          <input required type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <select required name="category" className="form-input" value={formData.category} onChange={handleChange}>
            {Object.keys(categories).map(cat => (
              <option key={cat} value={cat}>{cat.replace('-', ' ')}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Subcategory</label>
          <select required name="subcategory" className="form-input" value={formData.subcategory} onChange={handleChange}>
            {categories[formData.category]?.map(sub => (
              <option key={sub} value={sub}>{sub.replace('-', ' ')}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Price (Rs)</label>
          <input required type="number" name="price" className="form-input" value={formData.price} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label">Original Price (Rs) - Optional</label>
          <input type="number" name="originalPrice" className="form-input" value={formData.originalPrice} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label">Stock Quantity</label>
          <input required type="number" name="stock" className="form-input" value={formData.stock} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label">SKU</label>
          <input required type="text" name="sku" className="form-input" value={formData.sku} onChange={handleChange} />
        </div>

        <div className="form-group span-2">
          <label className="form-label">Description</label>
          <textarea required name="description" className="form-input" rows="4" value={formData.description} onChange={handleChange} />
        </div>
      </div>

      <div className="form-section">
        <h4 className="section-title">Images</h4>
        {formData.images.map((img, index) => (
          <div key={index} className="image-input-group">
            <input 
              type="text" 
              className="form-input" 
              placeholder="Image URL" 
              value={img} 
              onChange={(e) => handleImageChange(index, e.target.value)} 
            />
            {formData.images.length > 1 && (
              <button type="button" className="remove-btn" onClick={() => removeImageField(index)}>
                <FiX />
              </button>
            )}
            {img && <img src={img} alt="Preview" className="img-preview-mini" onError={(e) => e.target.style.display='none'} />}
          </div>
        ))}
        <button type="button" className="add-btn" onClick={addImageField}>
          <FiPlus /> Add Image
        </button>
      </div>

      <div className="form-section">
        <h4 className="section-title">Specifications</h4>
        {specs.map((spec, index) => (
          <div key={index} className="spec-input-group">
            <input 
              type="text" 
              className="form-input" 
              placeholder="Key (e.g. Battery)" 
              value={spec.key} 
              onChange={(e) => handleSpecChange(index, 'key', e.target.value)} 
            />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Value (e.g. 48 hours)" 
              value={spec.value} 
              onChange={(e) => handleSpecChange(index, 'value', e.target.value)} 
            />
            <button type="button" className="remove-btn" onClick={() => removeSpec(index)}>
              <FiX />
            </button>
          </div>
        ))}
        <button type="button" className="add-btn" onClick={addSpec}>
          <FiPlus /> Add Specification
        </button>
      </div>

      <div className="form-group">
        <label className="form-label">Tags (comma separated)</label>
        <input 
          type="text" 
          name="tags" 
          className="form-input" 
          placeholder="wireless, bass, premium"
          value={typeof formData.tags === 'string' ? formData.tags : formData.tags?.join(', ')} 
          onChange={handleChange} 
        />
      </div>

      <div className="form-group checkbox-group">
        <input type="checkbox" id="featured" name="featured" checked={formData.featured} onChange={handleChange} />
        <label htmlFor="featured">Featured Product</label>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
