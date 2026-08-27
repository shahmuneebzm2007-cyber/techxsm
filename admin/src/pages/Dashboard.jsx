import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiDollarSign, FiClock, FiTruck, FiCheckCircle, FiEye } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../components/StatsCard';
import { getStats, getOrders } from '../utils/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      const statsData = await getStats();
      const ordersData = await getOrders(); // Should ideally be a separate endpoint for recent 10
      
      setStats(statsData);
      setRecentOrders(ordersData.slice(0, 10)); // Take only first 10
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount) => {
    return `Rs ${new Intl.NumberFormat('en-PK').format(amount)}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PK', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return <div className="loading-state">Loading Dashboard...</div>;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
        <div className="last-updated">Auto-refreshes every 30s</div>
      </div>

      <motion.div 
        className="stats-grid"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants}>
          <StatsCard title="Total Orders" value={stats.totalOrders} icon={<FiShoppingBag />} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatsCard title="Total Revenue" value={formatCurrency(stats.revenue)} icon={<FiDollarSign />} type="revenue" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatsCard title="Pending Orders" value={stats.pending} icon={<FiClock />} type="pending" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatsCard title="Shipped Orders" value={stats.shipped} icon={<FiTruck />} type="shipped" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatsCard title="Delivered Orders" value={stats.delivered} icon={<FiCheckCircle />} type="delivered" />
        </motion.div>
      </motion.div>

      <motion.div 
        className="dashboard-section glass-panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="section-header">
          <h2>Recent Orders</h2>
          <button className="btn-outline" onClick={() => navigate('/orders')}>View All</button>
        </div>
        
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order._id}>
                  <td style={{ fontFamily: 'monospace' }}>#{order._id}</td>
                  <td>{order.customerName}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td style={{ fontWeight: '600' }}>{formatCurrency(order.totalAmount)}</td>
                  <td><span className={`badge ${order.status}`}>{order.status.replace('_', ' ')}</span></td>
                  <td>
                    <button className="action-btn" onClick={() => navigate(`/orders/${order._id}`)}>
                      <FiEye /> View
                    </button>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4">No recent orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
