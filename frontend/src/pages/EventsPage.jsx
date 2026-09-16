import React, { useState } from 'react';
import Modal from '../components/Modal';

// Basic React Page: EventsPage
// Displays all college events, supports category filtering, status filtering,
// registration capacity checking, and event registration.
function EventsPage({ 
  currentUser, 
  events, 
  registrations, 
  onRegisterEvent 
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Registration confirmation modal
  const [eventToRegister, setEventToRegister] = useState(null);

  const categories = ['All', 'Technical', 'Cultural', 'Sports', 'Literary'];
  const statuses = ['All', 'upcoming', 'completed'];

  // Check if current user is already registered for an event
  const isUserRegistered = (eventId) => {
    return registrations.some(
      r => r.eventId === eventId && r.studentId === currentUser.id
    );
  };

  // Filter events
  const filteredEvents = events.filter((ev) => {
    const matchesCat = selectedCategory === 'All' || ev.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || ev.status === selectedStatus;
    const matchesSearch = ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.clubName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ev.tags && ev.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesCat && matchesStatus && matchesSearch;
  });

  const handleConfirmRegister = () => {
    if (eventToRegister) {
      onRegisterEvent(eventToRegister);
      setEventToRegister(null);
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-main-title">Campus Events & Workshops</h1>
          <p className="page-main-subtitle">
            Discover hackathons, guest lectures, cultural fests, and hands-on bootcamps
          </p>
        </div>
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

        <div className="filter-right-group">
          {/* Status selector */}
          <select 
            className="form-select filter-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All">All Timelines</option>
            <option value="upcoming">Upcoming Events</option>
            <option value="completed">Past / Completed</option>
          </select>

          {/* Search box */}
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input 
              type="text"
              className="search-input"
              placeholder="Search event, venue, club..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="events-grid">
        {filteredEvents.map((ev) => {
          const registered = isUserRegistered(ev.id);
          const isFull = ev.registeredCount >= ev.capacity;
          const seatsLeft = Math.max(0, ev.capacity - ev.registeredCount);
          const fillPercentage = Math.round((ev.registeredCount / ev.capacity) * 100);

          return (
            <div key={ev.id} className="event-card">
              <div className="event-card-top">
                <span className={`category-tag tag-${ev.category.toLowerCase()}`}>
                  {ev.category}
                </span>
                <span className={`event-status-pill status-${ev.status}`}>
                  {ev.status === 'upcoming' ? '🟢 Upcoming' : '⚪ Completed'}
                </span>
              </div>

              <h3 className="event-title">{ev.title}</h3>
              <p className="event-club-name">By <strong>{ev.clubName}</strong></p>

              <div className="event-info-list">
                <div className="event-info-item">
                  <span className="info-icon">📅</span>
                  <span>{ev.date} • {ev.time}</span>
                </div>
                <div className="event-info-item">
                  <span className="info-icon">📍</span>
                  <span>{ev.venue}</span>
                </div>
                <div className="event-info-item">
                  <span className="info-icon">👨‍🏫</span>
                  <span>Coordinator: {ev.coordinator}</span>
                </div>
              </div>

              <p className="event-description">{ev.description}</p>

              {/* Capacity Progress Bar */}
              <div className="capacity-container">
                <div className="capacity-label-row">
                  <span>Seats: {ev.registeredCount} / {ev.capacity}</span>
                  <span className="capacity-percent">{fillPercentage}% Filled</span>
                </div>
                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill" 
                    style={{ 
                      width: `${fillPercentage}%`,
                      backgroundColor: fillPercentage > 85 ? '#ef4444' : '#3b82f6'
                    }}
                  ></div>
                </div>
                {ev.status === 'upcoming' && (
                  <small className="seats-alert">
                    {seatsLeft > 0 ? `⚡ Only ${seatsLeft} spots remaining` : '⚠️ Housefull!'}
                  </small>
                )}
              </div>

              {/* Tags */}
              <div className="club-tags-list">
                {ev.tags && ev.tags.map((t, idx) => (
                  <span key={idx} className="club-tag-pill">#{t}</span>
                ))}
              </div>

              {/* Card Footer Actions */}
              <div className="event-card-footer">
                {ev.status === 'completed' ? (
                  <button className="btn-secondary btn-block disabled" disabled>
                    Event Completed
                  </button>
                ) : registered ? (
                  <button className="btn-success-registered btn-block disabled" disabled>
                    ✓ Registered
                  </button>
                ) : isFull ? (
                  <button className="btn-secondary btn-block disabled" disabled>
                    Registration Closed (Full)
                  </button>
                ) : (
                  <button 
                    className="btn-primary btn-block"
                    onClick={() => setEventToRegister(ev)}
                  >
                    Register Now
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Confirm Registration */}
      <Modal
        isOpen={Boolean(eventToRegister)}
        onClose={() => setEventToRegister(null)}
        title="Confirm Event Registration"
      >
        {eventToRegister && (
          <div className="registration-modal-content">
            <p className="reg-prompt">
              You are registering for <strong>{eventToRegister.title}</strong>
            </p>

            <div className="reg-summary-card">
              <div className="summary-line">
                <span>Organized by:</span>
                <strong>{eventToRegister.clubName}</strong>
              </div>
              <div className="summary-line">
                <span>Date & Time:</span>
                <strong>{eventToRegister.date} at {eventToRegister.time}</strong>
              </div>
              <div className="summary-line">
                <span>Venue:</span>
                <strong>{eventToRegister.venue}</strong>
              </div>
              <div className="summary-line">
                <span>Student Name:</span>
                <strong>{currentUser.name}</strong>
              </div>
              <div className="summary-line">
                <span>USN / ID:</span>
                <strong>{currentUser.usn}</strong>
              </div>
              <div className="summary-line">
                <span>Department:</span>
                <strong>{currentUser.department}</strong>
              </div>
            </div>

            <p className="reg-notice">
              ℹ️ A confirmation receipt and calendar reminder will be linked to your student dashboard.
              Certificates are awarded upon coordinator verification of your attendance.
            </p>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setEventToRegister(null)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleConfirmRegister}>
                Confirm Registration
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default EventsPage;
