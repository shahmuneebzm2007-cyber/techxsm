import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiPackage, FiBox, FiSettings, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const adminEmail = 'admin@techxsm.com'; // In real app, get from context

  const navItems = [
    { path: '/', icon: <FiHome />, label: 'Dashboard' },
    { path: '/orders', icon: <FiPackage />, label: 'Orders', badge: 12 },
    { path: '/products', icon: <FiBox />, label: 'Products' },
    { path: '/settings', icon: <FiSettings />, label: 'Settings' }
  ];

  return (
    <>
      <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FiX /> : <FiMenu />}
      </button>

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="brand-logo gradient-text">TechXSM</h2>
          <span className="brand-subtitle">Admin Portal</span>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="admin-info">
            <div className="admin-avatar">A</div>
            <div className="admin-details">
              <span className="admin-name">Admin User</span>
              <span className="admin-email">{adminEmail}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}>
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
