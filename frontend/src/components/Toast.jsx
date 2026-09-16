import React from 'react';

// Basic React Component: Toast
// Displays floating temporary confirmation alerts for user actions (e.g. Registered, Saved)
function Toast({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="toast-banner">
      <div className="toast-content">
        <span className="toast-icon">✅</span>
        <span className="toast-text">{message}</span>
      </div>
      <button className="toast-close" onClick={onClose}>✕</button>
    </div>
  );
}

export default Toast;
