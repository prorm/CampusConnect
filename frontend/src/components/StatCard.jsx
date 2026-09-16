import React from 'react';

// Basic React Component: StatCard
// Simple reusable card to display numerical metrics, icons, and trends.
function StatCard({ icon, label, value, note, color = 'blue' }) {
  return (
    <div className={`stat-card stat-${color}`}>
      <div className="stat-icon-wrapper">
        <span className="stat-icon">{icon}</span>
      </div>
      <div className="stat-content">
        <span className="stat-label">{label}</span>
        <h3 className="stat-value">{value}</h3>
        {note && <span className="stat-note">{note}</span>}
      </div>
    </div>
  );
}

export default StatCard;
