import React, { useState } from 'react';
import StatCard from '../components/StatCard';

// Basic React Page: AdminManagement
// Implements Admin Management from Synopsis Section 5.2 & Step 2:
// User Directory, Club Approvals, and Platform Governance.
function AdminManagement({ 
  currentUser, 
  allUsers, 
  clubs, 
  onApproveClub, 
  onRejectClub,
  onBroadcastAnnouncement 
}) {
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [announcementText, setAnnouncementText] = useState('');

  // Pending clubs that require admin approval
  const pendingClubs = clubs.filter(c => c.status === 'pending_approval');
  const activeClubs = clubs.filter(c => c.status === 'active');

  // Filter users
  const filteredUsers = allUsers.filter((u) => {
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.usn.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.department.toLowerCase().includes(userSearch.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    onBroadcastAnnouncement(announcementText.trim());
    setAnnouncementText('');
  };

  return (
    <div className="page-container">
      {/* Admin Header */}
      <div className="welcome-banner admin-banner">
        <div className="banner-content">
          <span className="banner-role-badge">Dean of Student Affairs Portal</span>
          <h1 className="banner-heading">CampusConnect Administrative Console</h1>
          <p className="banner-subtext">
            Overseeing <strong>{allUsers.length}</strong> accounts, <strong>{clubs.length}</strong> clubs, and college-wide governance.
          </p>
        </div>
      </div>

      {/* Admin Stats */}
      <div className="stats-grid">
        <StatCard 
          icon="👥" 
          label="Registered Users" 
          value={allUsers.length} 
          note="Students & Faculty"
          color="blue" 
        />
        <StatCard 
          icon="🏛️" 
          label="Active Societies" 
          value={activeClubs.length} 
          note="Verified campus clubs"
          color="green" 
        />
        <StatCard 
          icon="⏳" 
          label="Pending Approvals" 
          value={pendingClubs.length} 
          note="New club applications"
          color={pendingClubs.length > 0 ? 'orange' : 'blue'} 
        />
        <StatCard 
          icon="🛡️" 
          label="RBAC Security Status" 
          value="Enforced" 
          note="Role-Based Access Control"
          color="purple" 
        />
      </div>

      {/* Pending Club Approvals Section */}
      <section className="section-card">
        <div className="section-header">
          <div>
            <h2 className="section-title">Pending Club Creation Charters</h2>
            <p className="section-subtitle">
              Review new club proposals submitted by students and faculty coordinators
            </p>
          </div>
          <span className="mini-tag tag-literary">
            {pendingClubs.length} Awaiting Review
          </span>
        </div>

        {pendingClubs.length === 0 ? (
          <div className="empty-state">
            <p>✅ All club proposals have been reviewed. No pending approvals.</p>
          </div>
        ) : (
          <div className="pending-clubs-grid">
            {pendingClubs.map((club) => (
              <div key={club.id} className="pending-club-card">
                <div className="pending-card-top">
                  <span className="category-tag tag-technical">{club.category}</span>
                  <span className="pending-tag">Pending Admin Review</span>
                </div>
                <h3>{club.name}</h3>
                <p className="pending-lead">Proposed by: <strong>{club.leadName}</strong></p>
                <p className="pending-desc">{club.description}</p>
                <div className="club-tags-list">
                  {club.tags && club.tags.map((t, i) => (
                    <span key={i} className="mini-tag">#{t}</span>
                  ))}
                </div>

                <div className="pending-actions">
                  <button 
                    className="btn-reject"
                    onClick={() => onRejectClub(club.id)}
                  >
                    ✕ Reject
                  </button>
                  <button 
                    className="btn-approve"
                    onClick={() => onApproveClub(club.id)}
                  >
                    ✓ Approve & Activate Club
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* User Management Directory */}
      <section className="section-card">
        <div className="section-header">
          <div>
            <h2 className="section-title">College User Directory & Roles</h2>
            <p className="section-subtitle">
              Manage accounts, verify USNs, and monitor department-wise distribution
            </p>
          </div>
        </div>

        {/* Directory Filters */}
        <div className="filter-controls-bar">
          <div className="category-pills">
            {['All', 'student', 'coordinator', 'admin'].map((role) => (
              <button
                key={role}
                className={`filter-pill ${roleFilter === role ? 'active' : ''}`}
                onClick={() => setRoleFilter(role)}
              >
                {role.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input 
              type="text"
              className="search-input"
              placeholder="Search user by name, USN, dept..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>USN / Faculty ID</th>
                <th>Department</th>
                <th>Interests / Club</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-table-cell">
                      <span className="avatar-small">{user.avatar}</span>
                      <div>
                        <strong>{user.name}</strong>
                        <div className="text-muted" style={{ fontSize: '0.8rem' }}>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`role-badge role-${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td><code>{user.usn}</code></td>
                  <td>{user.department}</td>
                  <td>
                    {user.clubName ? (
                      <span className="mini-tag tag-technical">{user.clubName}</span>
                    ) : user.interests ? (
                      <div className="table-interests">
                        {user.interests.slice(0, 2).map((int, i) => (
                          <span key={i} className="mini-tag">#{int}</span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted">General</span>
                    )}
                  </td>
                  <td>
                    <span className="status-badge status-attended">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Broadcast Campus Announcement Form */}
      <section className="section-card">
        <div className="section-header">
          <div>
            <h2 className="section-title">📢 Broadcast Campus Announcement</h2>
            <p className="section-subtitle">
              Send an instant notification alert to all students and coordinators on their dashboards
            </p>
          </div>
        </div>

        <form onSubmit={handleSendBroadcast} className="simple-form">
          <div className="form-group">
            <textarea 
              rows="2"
              className="form-textarea"
              placeholder="e.g. Annual TechFest registrations will open on October 1st. Club coordinators must finalize their event proposals by Friday."
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              required
            />
          </div>
          <div className="modal-actions" style={{ justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-primary">
              Send Announcement to All Users
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default AdminManagement;
