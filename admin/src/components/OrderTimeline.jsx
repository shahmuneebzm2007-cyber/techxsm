import React from 'react';
import { FiCheck, FiCircle } from 'react-icons/fi';
import './OrderTimeline.css';

const OrderTimeline = ({ timeline = [], currentStatus }) => {
  const allStatuses = ['pending', 'confirmed', 'shipped', 'in_transit', 'delivered'];
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  const getStatusIndex = (status) => allStatuses.indexOf(status);
  const currentIndex = getStatusIndex(currentStatus);

  return (
    <div className="timeline-container">
      {allStatuses.map((status, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;
        
        // Find if we have timeline data for this status
        const timelineItem = timeline.find(item => item.status === status) || {};
        
        return (
          <div key={status} className={`timeline-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
            <div className="timeline-icon-container">
              <div className="timeline-icon">
                {isCompleted ? <FiCheck /> : <FiCircle />}
              </div>
              {index < allStatuses.length - 1 && <div className="timeline-line"></div>}
            </div>
            <div className="timeline-content">
              <div className="timeline-status-name">{status.replace('_', ' ')}</div>
              {timelineItem.message && <div className="timeline-message">{timelineItem.message}</div>}
              {timelineItem.date && <div className="timeline-date">{formatDate(timelineItem.date)}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderTimeline;
