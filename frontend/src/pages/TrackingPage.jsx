import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiPackage, FiCheck, FiTruck, FiMapPin, FiHome, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import api from '../utils/api';
import './TrackingPage.css';

const TrackingPage = () => {
  const { trackingId } = useParams();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const recentSearches = JSON.parse(localStorage.getItem('recentTracking') || '[]');

  useEffect(() => {
    if (trackingId) {
      fetchTrackingData(trackingId);
    } else {
      setTrackingData(null);
    }
  }, [trackingId]);

  const fetchTrackingData = async (id) => {
    setLoading(true);
    setError('');
    try {
      // Mock API call fallback
      let data;
      try {
        const res = await api.getTracking(id);
        data = res.data;
      } catch(e) {
        // Mock data
        if (id === 'NOTFOUND') throw new Error('Not found');
        data = {
          id: id,
          orderId: 'ORD-8923-441',
          date: '2023-10-24T10:30:00Z',
          estimatedDelivery: '2023-10-28',
          courier: 'TCS Express',
          currentLocation: 'Karachi Sorting Facility',
          currentStep: 3, // 1-5
          steps: [
            { id: 1, title: 'Order Placed', message: 'We have received your order', timestamp: 'Oct 24, 10:30 AM', icon: FiPackage },
            { id: 2, title: 'Confirmed', message: 'Order has been confirmed and is being processed', timestamp: 'Oct 24, 14:15 PM', icon: FiCheck },
            { id: 3, title: 'Shipped', message: 'Package has been handed over to courier', timestamp: 'Oct 25, 09:00 AM', icon: FiTruck },
            { id: 4, title: 'In Transit', message: 'Package is on the way to your city', timestamp: '', icon: FiMapPin },
            { id: 5, title: 'Delivered', message: 'Package will be delivered soon', timestamp: '', icon: FiHome }
          ]
        };
      }
      setTrackingData(data);
      
      // Add to recent searches
      const newRecents = [id, ...recentSearches.filter(r => r !== id)].slice(0, 3);
      localStorage.setItem('recentTracking', JSON.stringify(newRecents));
    } catch (err) {
      setError('Tracking ID not found. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/track/${searchInput.trim()}`);
    }
  };

  return (
    <motion.div 
      className="tracking-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {!trackingData && !loading && (
        <div className="tracking-search-view">
          <motion.div 
            className="tracking-search-card"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <h1>Track Your Order</h1>
            <p>Enter your tracking ID or order number to see the current status of your shipment.</p>
            
            <form onSubmit={handleSearch} className="tracking-form">
              <div className="input-group">
                <FiSearch className="input-icon" />
                <input 
                  type="text" 
                  placeholder="Enter Tracking ID (e.g. TX123456789)"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="search-btn">Track Order</button>
            </form>
            
            {error && (
              <div className="tracking-error">
                <FiAlertCircle /> {error}
              </div>
            )}

            {recentSearches.length > 0 && (
              <div className="recent-searches">
                <h3>Recent Searches</h3>
                <div className="recent-tags">
                  {recentSearches.map(id => (
                    <button key={id} onClick={() => navigate(`/track/${id}`)} className="recent-tag">
                      {id}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {loading && (
        <div className="tracking-loading">
          <FiRefreshCw className="spin-icon" />
          <p>Locating your package...</p>
        </div>
      )}

      {trackingData && !loading && (
        <motion.div 
          className="tracking-results-view"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="tracking-header">
            <div>
              <h2>Order #{trackingData.orderId}</h2>
              <p className="tracking-id-text">Tracking ID: <span>{trackingData.id}</span></p>
            </div>
            <button className="refresh-btn" onClick={() => fetchTrackingData(trackingData.id)}>
              <FiRefreshCw /> Refresh
            </button>
          </div>

          <div className="tracking-info-cards">
            <div className="info-card">
              <h4>Estimated Delivery</h4>
              <p className="highlight">{trackingData.estimatedDelivery}</p>
            </div>
            <div className="info-card">
              <h4>Courier</h4>
              <p>{trackingData.courier}</p>
            </div>
            <div className="info-card">
              <h4>Current Location</h4>
              <p>{trackingData.currentLocation || 'N/A'}</p>
            </div>
          </div>

          <div className="timeline-container">
            {trackingData.steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = step.id < trackingData.currentStep;
              const isCurrent = step.id === trackingData.currentStep;
              const isFuture = step.id > trackingData.currentStep;
              
              return (
                <div key={step.id} className={`timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isFuture ? 'future' : ''}`}>
                  <div className="timeline-icon-container">
                    <div className="timeline-icon">
                      <Icon />
                    </div>
                    {index < trackingData.steps.length - 1 && (
                      <div className="timeline-line"></div>
                    )}
                  </div>
                  
                  <div className="timeline-content">
                    <h3 className="step-title">{step.title}</h3>
                    <p className="step-message">{step.message}</p>
                    {step.timestamp && <span className="step-time">{step.timestamp}</span>}
                  </div>
                </div>
              );
            })}
          </div>
          
          <button className="back-to-search" onClick={() => navigate('/track')}>
            Track Another Order
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TrackingPage;
