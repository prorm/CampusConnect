import React from 'react';

// Basic React Component: Navbar
// Displays the top navigation header, active tabs, current user profile, and role switcher.
function Navbar({ 
  currentUser, 
  allUsers, 
  onSelectUser, 
  activeTab, 
  setActiveTab 
}) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand Logo & Title */}
        <div className="brand" onClick={() => setActiveTab('dashboard')}>
          <div className="brand-icon">🎓</div>
          <div>
            <h1 className="brand-title">CampusConnect</h1>
            <p className="brand-subtitle">Club & Event Management System</p>
          </div>
        </div>

        {/* Navigation Tabs based on Current Role */}
        <nav className="nav-tabs">
          <button 
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 {currentUser.role === 'student' ? 'My Dashboard' : currentUser.role === 'coordinator' ? 'Coordinator Hub' : 'Admin Overview'}
          </button>

          <button 
            className={`tab-btn ${activeTab === 'clubs' ? 'active' : ''}`}
            onClick={() => setActiveTab('clubs')}
          >
            🏛️ Clubs
          </button>

          <button 
            className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            📅 Events
          </button>

          <button 
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📈 Analytics & AI
          </button>

          {currentUser.role === 'admin' && (
            <button 
              className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
            >
              ⚙️ Admin Portal
            </button>
          )}
        </nav>

        {/* User Badge & Interactive Role Switcher for Demonstration */}
        <div className="user-section">
          <div className="role-switcher-box">
            <span className="role-label">Switch Persona:</span>
            <select 
              className="role-select"
              value={currentUser.id}
              onChange={(e) => {
                const selected = allUsers.find(u => u.id === e.target.value);
                if (selected) onSelectUser(selected);
              }}
            >
              {allUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <div className="user-badge">
            <div className="user-avatar">{currentUser.avatar}</div>
            <div className="user-details">
              <span className="user-name">{currentUser.name}</span>
              <span className="user-role-tag">{currentUser.role} • {currentUser.usn}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
