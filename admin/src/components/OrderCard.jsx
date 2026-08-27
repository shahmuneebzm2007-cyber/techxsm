import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCopy } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './OrderCard.css';

const OrderCard = ({ order }) => {
  const navigate = useNavigate();

  const handleCopy = (e, text) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    toast.success('Order ID copied');
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-PK', options);
  };

  const formatCurrency = (amount) => {
    return `Rs ${new Intl.NumberFormat('en-PK').format(amount)}`;
  };

  return (
    <div className="order-card glass-panel" onClick={() => navigate(`/orders/${order._id}`)}>
      <div className="order-card-header">
        <div className="order-id-wrapper">
          <span className="order-id">#{order._id}</span>
          <button className="copy-btn" onClick={(e) => handleCopy(e, order._id)}>
            <FiCopy />
          </button>
        </div>
        <span className={`badge ${order.status}`}>{order.status.replace('_', ' ')}</span>
      </div>
      
      <div className="order-card-body">
        <div className="customer-info">
          <span className="customer-name">{order.customerName}</span>
          <span className="customer-email">{order.customerEmail}</span>
        </div>
        <div className="order-details">
          <span className="order-date">{formatDate(order.createdAt)}</span>
          <span className="order-items">{order.items.length} item(s)</span>
        </div>
      </div>
      
      <div className="order-card-footer">
        <span className="order-amount gradient-text">{formatCurrency(order.totalAmount)}</span>
        <span className="view-details">View Details &rarr;</span>
      </div>
    </div>
  );
};

export default OrderCard;
