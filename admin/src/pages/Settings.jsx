import React from 'react';
import './Settings.css';

const Settings = () => {
  return (
    <div className="settings-page">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
      </div>

      <div className="settings-grid">
        <div className="glass-panel settings-card">
          <h3 className="section-title">Admin Profile</h3>
          <div className="settings-content">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" value="admin@techxsm.com" disabled />
            </div>
          </div>
        </div>

        <div className="glass-panel settings-card">
          <h3 className="section-title">Change Password</h3>
          <form className="settings-content" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input type="password" className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input type="password" className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input type="password" className="form-input" />
            </div>
            <button className="btn-primary" type="button">Update Password</button>
          </form>
        </div>

        <div className="glass-panel settings-card span-2">
          <h3 className="section-title">Store Settings</h3>
          <div className="settings-content placeholder-content">
            <p>Additional store settings (e.g., taxation, shipping rates, banners) can be configured here in future updates.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
