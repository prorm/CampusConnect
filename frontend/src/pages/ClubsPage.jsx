import React, { useState } from 'react';
import Modal from '../components/Modal';

// Basic React Page: ClubsPage
// Displays all college clubs, supports category filtering, search,
// joining/leaving clubs, and proposing a new club.
function ClubsPage({ 
  currentUser, 
  clubs, 
  onJoinClub, 
  onProposeClub,
  joinedClubIds = [] 
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeClubDetails, setActiveClubDetails] = useState(null);
  
  // Modal state for proposing a new club
  const [proposeModalOpen, setProposeModalOpen] = useState(false);
  const [newClubName, setNewClubName] = useState('');
  const [newClubCategory, setNewClubCategory] = useState('Technical');
  const [newClubDesc, setNewClubDesc] = useState('');
  const [newClubTags, setNewClubTags] = useState('');

  const categories = ['All', 'Technical', 'Cultural', 'Sports', 'Literary', 'Social'];

  // Filter clubs based on category and search query
  const filteredClubs = clubs.filter((club) => {
    const matchesCategory = selectedCategory === 'All' || club.category === selectedCategory;
    const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (club.tags && club.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const handleProposeSubmit = (e) => {
    e.preventDefault();
    if (!newClubName.trim() || !newClubDesc.trim()) return;

    onProposeClub({
      id: 'c' + (clubs.length + 1),
      name: newClubName.trim(),
      category: newClubCategory,
      leadName: currentUser.name,
      membersCount: 1,
      description: newClubDesc.trim(),
      tags: newClubTags.split(',').map(t => t.trim()).filter(Boolean),
      status: 'pending_approval',
      icon: '✨',
      founded: '2026'
    });

    // Reset form
    setNewClubName('');
    setNewClubDesc('');
    setNewClubTags('');
    setProposeModalOpen(false);
  };

  return (
    <div className="page-container">
      {/* Header & Actions */}
      <div className="page-header-row">
        <div>
          <h1 className="page-main-title">College Clubs & Societies</h1>
          <p className="page-main-subtitle">
            Explore active communities, participate in activities, or launch your own club
          </p>
        </div>
        <button className="btn-primary" onClick={() => setProposeModalOpen(true)}>
          ➕ Propose New Club
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-controls-bar">
        <div className="category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input 
            type="text"
            className="search-input"
            placeholder="Search clubs by name or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Clubs Grid */}
      <div className="clubs-grid">
        {filteredClubs.map((club) => {
          const isJoined = joinedClubIds.includes(club.id);

          return (
            <div key={club.id} className="club-card">
              <div className="club-card-top">
                <div className="club-avatar-large">{club.icon}</div>
                <div className="club-header-info">
                  <span className={`category-tag tag-${club.category.toLowerCase()}`}>
                    {club.category}
                  </span>
                  <h3 className="club-name">{club.name}</h3>
                  <p className="club-lead">Lead: {club.leadName}</p>
                </div>
              </div>

              <p className="club-description">{club.description}</p>

              <div className="club-tags-list">
                {club.tags && club.tags.map((tag, idx) => (
                  <span key={idx} className="club-tag-pill">#{tag}</span>
                ))}
              </div>

              <div className="club-card-footer">
                <span className="club-members-count">
                  👥 <strong>{club.membersCount}</strong> Members
                </span>

                <div className="club-card-actions">
                  <button 
                    className="btn-text-only"
                    onClick={() => setActiveClubDetails(club)}
                  >
                    Details
                  </button>

                  <button
                    className={`btn-join ${isJoined ? 'joined' : ''}`}
                    onClick={() => onJoinClub(club.id)}
                  >
                    {isJoined ? 'Joined ✓' : 'Join Club'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Club Details */}
      <Modal
        isOpen={Boolean(activeClubDetails)}
        onClose={() => setActiveClubDetails(null)}
        title={activeClubDetails?.name || 'Club Information'}
      >
        {activeClubDetails && (
          <div className="club-details-modal">
            <div className="detail-row">
              <strong>Category:</strong> 
              <span>{activeClubDetails.category}</span>
            </div>
            <div className="detail-row">
              <strong>Coordinator / Faculty In-charge:</strong> 
              <span>{activeClubDetails.leadName}</span>
            </div>
            <div className="detail-row">
              <strong>Active Members:</strong> 
              <span>{activeClubDetails.membersCount} registered members</span>
            </div>
            <div className="detail-row">
              <strong>Established:</strong> 
              <span>Year {activeClubDetails.founded}</span>
            </div>
            <div className="detail-block">
              <strong>About the Club:</strong>
              <p>{activeClubDetails.description}</p>
            </div>
            <div className="detail-block">
              <strong>Interest Domains:</strong>
              <div className="club-tags-list" style={{ marginTop: '0.5rem' }}>
                {activeClubDetails.tags.map((t, i) => (
                  <span key={i} className="club-tag-pill">#{t}</span>
                ))}
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setActiveClubDetails(null)}>
                Close
              </button>
              <button 
                className={`btn-primary ${joinedClubIds.includes(activeClubDetails.id) ? 'disabled' : ''}`}
                onClick={() => {
                  onJoinClub(activeClubDetails.id);
                  setActiveClubDetails(null);
                }}
              >
                {joinedClubIds.includes(activeClubDetails.id) ? 'Already a Member' : 'Join this Club'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal: Propose New Club */}
      <Modal
        isOpen={proposeModalOpen}
        onClose={() => setProposeModalOpen(false)}
        title="Propose a New Campus Club"
      >
        <form onSubmit={handleProposeSubmit} className="simple-form">
          <p className="form-helper">
            Submit your club charter. Upon submission, it will be sent to the 
            <strong> Administrator (Dean of Student Affairs)</strong> for approval.
          </p>

          <div className="form-group">
            <label>Club Name:</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="e.g., CyberSecurity Guild"
              value={newClubName}
              onChange={(e) => setNewClubName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Category:</label>
            <select 
              className="form-select"
              value={newClubCategory}
              onChange={(e) => setNewClubCategory(e.target.value)}
            >
              <option value="Technical">Technical</option>
              <option value="Cultural">Cultural</option>
              <option value="Sports">Sports</option>
              <option value="Literary">Literary</option>
              <option value="Social">Social</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description & Mission:</label>
            <textarea 
              rows="3" 
              className="form-textarea"
              placeholder="Describe the club's objectives, regular activities, and value to students..."
              value={newClubDesc}
              onChange={(e) => setNewClubDesc(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Interest Tags (comma-separated):</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="e.g. Ethical Hacking, CTF, Networking"
              value={newClubTags}
              onChange={(e) => setNewClubTags(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => setProposeModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Submit Club Proposal
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ClubsPage;
