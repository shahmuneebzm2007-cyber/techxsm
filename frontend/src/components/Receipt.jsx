import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCopy, FiCheck, FiDownload, FiMapPin } from 'react-icons/fi';
import './Receipt.css';
import { slideUp, staggerContainer } from '../utils/constants';

const Confetti = () => {
  return (
    <div className="confetti-container">
      {Array.from({ length: 50 }).map((_, i) => (
        <div key={i} className={`confetti-piece c-${i % 5}`} style={{
          left: `${Math.random() * 100}vw`,
          animationDuration: `${Math.random() * 3 + 2}s`,
          animationDelay: `${Math.random() * 2}s`
        }} />
      ))}
    </div>
  );
};

const Receipt = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="receipt-page">
      <Confetti />
      <div className="bokeh-bg"></div>

      <motion.div 
        className="receipt-container glass"
        variants={slideUp}
        initial="hidden"
        animate="visible"
      >
        <div className="receipt-header">
          <motion.div 
            className="success-checkmark"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.3 }}
          >
            <svg viewBox="0 0 52 52">
              <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
              <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            Order Confirmed!
          </motion.h1>
        </div>

        <motion.div 
          className="receipt-body"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="receipt-section" variants={slideUp}>
            <span className="label">Order ID</span>
            <div className="order-id-box">
              <span className="id-text">{orderId}</span>
              <button onClick={handleCopy} className="icon-btn">
                {copied ? <FiCheck color="var(--success)" /> : <FiCopy />}
              </button>
            </div>
          </motion.div>

          <motion.div className="receipt-section" variants={slideUp}>
            <span className="label">Payment Method</span>
            <span className="value success-text">Cash on Delivery (COD)</span>
          </motion.div>

          <motion.div className="receipt-section" variants={slideUp}>
            <span className="label">Date</span>
            <span className="value">{new Date().toLocaleDateString()}</span>
          </motion.div>

          <motion.div className="receipt-actions" variants={slideUp}>
            <button className="primary-btn" onClick={() => navigate(`/track/${orderId}`)}>
              <FiMapPin /> Track Order
            </button>
            <button className="secondary-btn">
              <FiDownload /> Download Invoice
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Receipt;
