import React, { useState } from 'react';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';
import CertificateModal from '../components/CertificateModal';

// Basic React Page: StudentDashboard
// Displays student's registered events, joined clubs, AI-driven recommendations,
// feedback submission form, and verifiable certificate viewing.
function StudentDashboard({ 
  currentUser, 
  clubs, 
  events, 
  registrations, 
  feedbacks, 
  onRegisterEvent, 
  onSubmitFeedback,
  setActiveTab 
}) {
  // Modal state for Feedback
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedRegForFeedback, setSelectedRegForFeedback] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  // Modal state for Certificate
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [selectedRegForCert, setSelectedRegForCert] = useState(null);

  // Filter registrations for the current student
  const studentRegistrations = registrations.filter(r => r.studentId === currentUser.id);

  // Filter joined clubs
  const studentClubIds = ['c1', 'c2']; // default joined clubs for demo
  const studentClubs = clubs.filter(c => studentClubIds.includes(c.id));

  // AI Recommendation Engine (Basic React logic matching interests from Synopsis Step 6)
  // Recommends events and clubs whose tags match the student's interest list!
  const userInterests = currentUser.interests || [];
  
  const recommendedEvents = events.filter(event => {
    // If already registered, don't recommend in top list
    const isRegistered = studentRegistrations.some(r => r.eventId === event.id);
    if (isRegistered) return false;
    // Check if any event tag matches student interests
    return event.tags && event.tags.some(tag => userInterests.includes(tag));
  });

  const recommendedClubs = clubs.filter(club => {
    return club.tags && club.tags.some(tag => userInterests.includes(tag));
  });

  // Calculate quick stats
  const totalRegistered = studentRegistrations.length;
  const totalAttended = studentRegistrations.filter(r => r.attended).length;
  const certificatesCount = studentRegistrations.filter(r => r.certificateIssued).length;

  // Open feedback modal handler
  const openFeedback = (reg) => {
    setSelectedRegForFeedback(reg);
    setRating(5);
    setComment('');
    setFeedbackModalOpen(true);
  };

  // Submit feedback handler
  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    onSubmitFeedback({
      eventId: selectedRegForFeedback.eventId,
      eventTitle: selectedRegForFeedback.eventTitle,
      studentName: currentUser.name,
      rating: Number(rating),
      comment: comment.trim(),
      registrationId: selectedRegForFeedback.id
    });

    setFeedbackModalOpen(false);
  };

  // View certificate handler
  const openCertificate = (reg) => {
    setSelectedRegForCert(reg);
    setCertModalOpen(true);
  };

  return (
    <div className="page-container">
      {/* Student Welcome Banner */}
      <div className="welcome-banner">
        <div className="banner-content">
          <span className="banner-role-badge">Student Portal</span>
          <h1 className="banner-heading">Welcome back, {currentUser.name}! 👋</h1>
          <p className="banner-subtext">
            USN: <strong>{currentUser.usn}</strong> | {currentUser.department} ({currentUser.year})
          </p>
          <div className="interest-pills-row">
            <span className="interest-label">Your Interests:</span>
            {userInterests.map((interest, idx) => (
              <span key={idx} className="interest-pill">
                ⭐ {interest}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="stats-grid">
        <StatCard 
          icon="🎫" 
          label="Registered Events" 
          value={totalRegistered} 
          note="Across campus clubs"
          color="blue" 
        />
        <StatCard 
          icon="✅" 
          label="Events Attended" 
          value={totalAttended} 
          note="Verified attendance"
          color="green" 
        />
        <StatCard 
          icon="🏆" 
          label="Certificates Ready" 
          value={certificatesCount} 
          note="Downloadable credentials"
          color="purple" 
        />
        <StatCard 
          icon="⚡" 
          label="Engagement Level" 
          value="High" 
          note="Top 10% in department"
          color="orange" 
        />
      </div>

      {/* AI Recommendations Section (Project Synopsis Step 6) */}
      <section className="section-card ai-recommendations-box">
        <div className="section-header">
          <div className="section-title-wrap">
            <span className="ai-sparkle-icon">✨</span>
            <div>
              <h2 className="section-title">AI Personalized Recommendations</h2>
              <p className="section-subtitle">
                Smart suggestions tailored to your interests in <em>{userInterests.join(', ')}</em>
              </p>
            </div>
          </div>
          <span className="ai-badge">AI Powered</span>
        </div>

        <div className="recommendations-grid">
          {recommendedEvents.length > 0 ? (
            recommendedEvents.slice(0, 2).map((event) => (
              <div key={event.id} className="rec-card">
                <div className="rec-badge">🎯 98% Match with Interests</div>
                <h3 className="rec-title">{event.title}</h3>
                <p className="rec-club">Hosted by: <strong>{event.clubName}</strong></p>
                <div className="rec-meta">
                  <span>📅 {event.date}</span>
                  <span>📍 {event.venue}</span>
                </div>
                <div className="rec-tags">
                  {event.tags.map((t, i) => (
                    <span key={i} className="mini-tag">#{t}</span>
                  ))}
                </div>
                <button 
                  className="btn-primary btn-sm"
                  onClick={() => onRegisterEvent(event)}
                >
                  Quick Register
                </button>
              </div>
            ))
          ) : (
            <p className="empty-text">You are registered for all matching upcoming events!</p>
          )}

          {recommendedClubs.slice(0, 1).map((club) => (
            <div key={club.id} className="rec-card rec-club-card">
              <div className="rec-badge">🏛️ Recommended Club</div>
              <h3 className="rec-title">{club.name}</h3>
              <p className="rec-club">{club.description.slice(0, 90)}...</p>
              <div className="rec-tags">
                {club.tags.map((t, i) => (
                  <span key={i} className="mini-tag">#{t}</span>
                ))}
              </div>
              <button 
                className="btn-secondary btn-sm"
                onClick={() => setActiveTab('clubs')}
              >
                Explore Club
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* My Registrations & Attendance Status */}
      <section className="section-card">
        <div className="section-header">
          <div>
            <h2 className="section-title">My Event Registrations & Status</h2>
            <p className="section-subtitle">Track your participation, attendance status, and certificates</p>
          </div>
          <button className="btn-secondary btn-sm" onClick={() => setActiveTab('events')}>
            + Browse More Events
          </button>
        </div>

        {studentRegistrations.length === 0 ? (
          <div className="empty-state">
            <p>You haven't registered for any events yet.</p>
            <button className="btn-primary" onClick={() => setActiveTab('events')}>
              Explore Events
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Event Title</th>
                  <th>Hosting Club</th>
                  <th>Date</th>
                  <th>Attendance</th>
                  <th>Actions & Certificates</th>
                </tr>
              </thead>
              <tbody>
                {studentRegistrations.map((reg) => (
                  <tr key={reg.id}>
                    <td>
                      <strong>{reg.eventTitle}</strong>
                    </td>
                    <td>{reg.clubName}</td>
                    <td>{reg.eventDate}</td>
                    <td>
                      {reg.attended ? (
                        <span className="status-badge status-attended">Attended ✓</span>
                      ) : (
                        <span className="status-badge status-pending">Registered (Upcoming)</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons-cell">
                        {/* Certificate Button */}
                        {reg.certificateIssued ? (
                          <button 
                            className="btn-cert-action"
                            onClick={() => openCertificate(reg)}
                          >
                            🎓 View Certificate
                          </button>
                        ) : (
                          <span className="text-muted">Cert upon attendance</span>
                        )}

                        {/* Feedback Button */}
                        {reg.attended && (
                          reg.feedbackSubmitted ? (
                            <span className="feedback-done-tag">Feedback Sent ⭐</span>
                          ) : (
                            <button 
                              className="btn-feedback-action"
                              onClick={() => openFeedback(reg)}
                            >
                              ✍️ Give Feedback
                            </button>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* My Joined Clubs */}
      <section className="section-card">
        <div className="section-header">
          <div>
            <h2 className="section-title">My Joined Clubs</h2>
            <p className="section-subtitle">Extracurricular communities you are active in</p>
          </div>
          <button className="btn-secondary btn-sm" onClick={() => setActiveTab('clubs')}>
            View All Clubs
          </button>
        </div>

        <div className="clubs-mini-grid">
          {studentClubs.map((club) => (
            <div key={club.id} className="club-mini-card">
              <div className="club-mini-icon">{club.icon}</div>
              <div className="club-mini-info">
                <h4>{club.name}</h4>
                <p>{club.category} • Lead: {club.leadName}</p>
                <span className="member-pill">👥 {club.membersCount} Members</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal: Submit Feedback */}
      <Modal 
        isOpen={feedbackModalOpen} 
        onClose={() => setFeedbackModalOpen(false)}
        title="Event Feedback & Review"
      >
        {selectedRegForFeedback && (
          <form onSubmit={handleFeedbackSubmit} className="simple-form">
            <p className="form-helper">
              Your feedback helps club coordinators improve future events and feeds into our 
              <strong> AI Feedback Summarizer</strong>.
            </p>
            <div className="form-group">
              <label>Event Name:</label>
              <input 
                type="text" 
                value={selectedRegForFeedback.eventTitle} 
                disabled 
                className="form-input disabled"
              />
            </div>

            <div className="form-group">
              <label>Your Rating (1 to 5 Stars):</label>
              <div className="star-rating-select">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    className={`star-btn ${star <= rating ? 'active-star' : ''}`}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </button>
                ))}
                <span className="star-text">{rating} out of 5 Stars</span>
              </div>
            </div>

            <div className="form-group">
              <label>Comments & Suggestions:</label>
              <textarea 
                rows="4" 
                className="form-textarea"
                placeholder="What did you like the most? Any areas for improvement or topics for next time?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </div>

            <div className="modal-actions">
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => setFeedbackModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Submit Feedback
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Modal: View & Print Certificate */}
      <CertificateModal 
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        registration={selectedRegForCert}
      />
    </div>
  );
}

export default StudentDashboard;
