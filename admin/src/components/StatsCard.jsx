import React from 'react';
import './StatsCard.css';

const StatsCard = ({ title, value, icon, type = 'default' }) => {
  return (
    <div className={`stats-card glass-panel type-${type}`}>
      <div className="stats-icon-wrapper">
        {icon}
      </div>
      <div className="stats-content">
        <h3 className="stats-title">{title}</h3>
        <p className="stats-value">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
