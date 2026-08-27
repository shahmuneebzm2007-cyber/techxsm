import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiMapPin, FiPackage, FiTruck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getOrder, updateOrderStatus, shipOrder } from '../utils/api';
import OrderTimeline from '../components/OrderTimeline';
import ShippingModal from '../components/ShippingModal';
import './OrderDetail.css';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const data = await getOrder(id);
      setOrder(data);
    } catch (error) {
      toast.error('Failed to load order details');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (window.confirm(`Are you sure you want to mark this order as ${newStatus.replace('_', ' ')}?`)) {
      setActionLoading(true);
      try {
        await updateOrderStatus(id, newStatus);
        toast.success(`Order marked as ${newStatus.replace('_', ' ')}`);
        fetchOrder();
      } catch (error) {
        toast.error('Failed to update status');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleShipSubmit = async (shippingDetails) => {
    await shipOrder(id, shippingDetails);
    fetchOrder();
  };

  const formatCurrency = (amount) => {
    return `Rs ${new Intl.NumberFormat('en-PK').format(amount)}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PK', { 
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  if (loading) return <div className="loading-state">Loading order details...</div>;
  if (!order) return null;

  return (
    <div className="order-detail-page">
      <div className="page-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/orders')}>
            <FiArrowLeft /> Back to Orders
          </button>
          <h1 className="page-title">Order #{order._id}</h1>
          <span className={`badge ${order.status}`}>{order.status.replace('_', ' ')}</span>
        </div>
        <div className="header-right">
          <div className="order-date">{formatDate(order.createdAt)}</div>
        </div>
      </div>

      <div className="order-content-grid">
        <div className="main-column">
          <div className="glass-panel section-card">
            <h3 className="section-title"><FiPackage /> Order Items</h3>
            <div className="items-list">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="item-image-placeholder">
                    {item.image ? <img src={item.image} alt={item.name} /> : <FiPackage />}
                  </div>
                  <div className="item-details">
                    <div className="item-name">{item.name}</div>
                    <div className="item-meta">Qty: {item.quantity} × {formatCurrency(item.price)}</div>
                  </div>
                  <div className="item-total">{formatCurrency(item.quantity * item.price)}</div>
                </div>
              ))}
            </div>
            <div className="order-summary">
              <div className="summary-row total">
                <span>Total Amount</span>
                <span className="gradient-text">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          <div className="glass-panel section-card">
            <h3 className="section-title">Order Timeline</h3>
            <OrderTimeline timeline={order.timeline} currentStatus={order.status} />
          </div>
        </div>

        <div className="side-column">
          <div className="glass-panel section-card">
            <h3 className="section-title"><FiUser /> Customer</h3>
            <div className="info-block">
              <p className="info-main">{order.customerName}</p>
              <p className="info-sub">{order.customerEmail}</p>
              <p className="info-sub">{order.customerPhone}</p>
            </div>
          </div>

          <div className="glass-panel section-card">
            <h3 className="section-title"><FiMapPin /> Shipping Address</h3>
            <div className="info-block">
              <p className="info-text">{order.shippingAddress}</p>
            </div>
          </div>

          <div className="glass-panel section-card">
            <h3 className="section-title">Payment Info</h3>
            <div className="info-block payment-info">
              <p className="info-text"><strong>Method:</strong> Cash on Delivery (COD)</p>
              <p className="info-text"><strong>Status:</strong> {order.status === 'delivered' ? 'Paid' : 'Pending Payment'}</p>
            </div>
          </div>

          {order.tracking && (
            <div className="glass-panel section-card">
              <h3 className="section-title"><FiTruck /> Tracking Info</h3>
              <div className="info-block tracking-info">
                <p className="info-text"><strong>Courier:</strong> {order.tracking.courier}</p>
                <p className="info-text"><strong>Tracking ID:</strong> {order.tracking.trackingId}</p>
                <p className="info-text"><strong>Est. Delivery:</strong> {order.tracking.estimatedDate}</p>
              </div>
            </div>
          )}

          <div className="glass-panel section-card action-card">
            <h3 className="section-title">Update Status</h3>
            <div className="action-buttons">
              {(order.status === 'pending' || order.status === 'confirmed') && (
                <button 
                  className="btn-primary full-width" 
                  onClick={() => setIsShippingModalOpen(true)}
                >
                  Mark as Shipped
                </button>
              )}
              
              {order.status === 'shipped' && (
                <button 
                  className="btn-primary full-width" 
                  onClick={() => handleStatusUpdate('in_transit')}
                  disabled={actionLoading}
                >
                  Mark as In Transit
                </button>
              )}
              
              {order.status === 'in_transit' && (
                <button 
                  className="btn-primary full-width" 
                  onClick={() => handleStatusUpdate('delivered')}
                  disabled={actionLoading}
                >
                  Mark as Delivered
                </button>
              )}
              
              {(order.status !== 'delivered' && order.status !== 'cancelled') && (
                <button 
                  className="btn-outline danger full-width" 
                  onClick={() => handleStatusUpdate('cancelled')}
                  disabled={actionLoading}
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <ShippingModal 
        isOpen={isShippingModalOpen} 
        onClose={() => setIsShippingModalOpen(false)} 
        onSubmit={handleShipSubmit} 
      />
    </div>
  );
};

export default OrderDetail;
