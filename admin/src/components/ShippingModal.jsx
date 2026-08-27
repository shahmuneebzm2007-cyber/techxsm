import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './ShippingModal.css';

const ShippingModal = ({ isOpen, onClose, onSubmit }) => {
  const [courier, setCourier] = useState('TCS');
  const [trackingId, setTrackingId] = useState('');
  const [estimatedDate, setEstimatedDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const couriers = ['TCS', 'Leopards Courier', 'M&P Express', 'Trax', 'PostEx', 'Call Courier', 'Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!trackingId || !estimatedDate) {
      toast.error('Please fill all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ courier, trackingId, estimatedDate });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setIsSubmitting(false);
        onClose();
        // Reset form
        setCourier('TCS');
        setTrackingId('');
        setEstimatedDate('');
      }, 1500);
    } catch (error) {
      setIsSubmitting(false);
      toast.error('Failed to update shipping status');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-backdrop"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="modal-content glass-panel"
          >
            <div className="modal-header">
              <h3>Mark as Shipped</h3>
              <button className="close-btn" onClick={onClose}><FiX /></button>
            </div>

            {isSuccess ? (
              <div className="success-state">
                <motion.div 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  className="success-icon"
                >
                  <FiCheck />
                </motion.div>
                <p>Order shipped successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                  <label className="form-label">Courier Name</label>
                  <select 
                    className="form-input" 
                    value={courier} 
                    onChange={(e) => setCourier(e.target.value)}
                  >
                    {couriers.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Tracking ID</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Enter tracking number"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Estimated Delivery Date</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={estimatedDate}
                    onChange={(e) => setEstimatedDate(e.target.value)}
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-outline" onClick={onClose}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Processing...' : 'Confirm Shipment'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ShippingModal;
