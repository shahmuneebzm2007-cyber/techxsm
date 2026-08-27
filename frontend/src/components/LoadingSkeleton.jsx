import React from 'react';
import './LoadingSkeleton.css';

const LoadingSkeleton = ({ type = 'card' }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="skeleton-card">
            <div className="skeleton-image animate-shimmer"></div>
            <div className="skeleton-info">
              <div className="skeleton-text title animate-shimmer"></div>
              <div className="skeleton-text rating animate-shimmer"></div>
              <div className="skeleton-text price animate-shimmer"></div>
            </div>
          </div>
        );
      case 'text':
        return (
          <div className="skeleton-text-wrapper">
            <div className="skeleton-text full animate-shimmer"></div>
            <div className="skeleton-text three-quarter animate-shimmer"></div>
            <div className="skeleton-text half animate-shimmer"></div>
          </div>
        );
      case 'image':
        return <div className="skeleton-image-only animate-shimmer"></div>;
      case 'detail':
        return (
          <div className="skeleton-detail">
            <div className="skeleton-detail-image animate-shimmer"></div>
            <div className="skeleton-detail-info">
              <div className="skeleton-text badge animate-shimmer"></div>
              <div className="skeleton-text huge animate-shimmer"></div>
              <div className="skeleton-text rating animate-shimmer"></div>
              <div className="skeleton-text huge price animate-shimmer"></div>
              <div className="skeleton-text-wrapper mt-4">
                <div className="skeleton-text full animate-shimmer"></div>
                <div className="skeleton-text full animate-shimmer"></div>
                <div className="skeleton-text half animate-shimmer"></div>
              </div>
              <div className="skeleton-button animate-shimmer mt-4"></div>
            </div>
          </div>
        );
      default:
        return <div className="skeleton-text animate-shimmer"></div>;
    }
  };

  return <div className="loading-skeleton-container">{renderSkeleton()}</div>;
};

export default LoadingSkeleton;
