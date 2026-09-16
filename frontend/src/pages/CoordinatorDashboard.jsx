import React, { useState } from 'react';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';

// Basic React Page: CoordinatorDashboard
// Allows Club Coordinators to create events, record student attendance,
// view registrations, and inspect AI-generated feedback summaries.
function CoordinatorDashboard({ 
  currentUser, 
  clubs, 
  events, 
  registrations, 
  feedbacks, 
  aiInsights,
  onCreateEvent, 
  onToggleAttendance 
}) {
  // Modal states
  const [createEventModalOpen, setCreateEventModalOpen] = useState(false);
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [selectedEventForAttendance, setSelectedEventForAttendance] = useState(null);
  const [feedbackSummaryModalOpen, setFeedbackSummaryModalOpen] = useState(false);

  // Form states for creating a new event
  const [eventTitle, setEventTitle] = useState('');
  const [eventCategory, setEventCategory] = useState('Technical');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventVenue, setEventVenue] = useState('');
  const [eventCapacity, setEventCapacity] = useState(100);
  const [eventDescription, setEventDescription] = useState('');
  const [eventTags, setEventTags] = useState('');

  // Find coordinator's assigned club
  const coordinatorClub = clubs.find(c => c.id === currentUser.clubId) || clubs[0];

  // Events hosted by this coordinator's club
  const clubEvents = events.filter(e => e.clubId === coordinatorClub.id);

  // Registrations for the selected event in attendance modal
  const activeEventRegistrations = selectedEventForAttendance
    ? registrations.filter(r => r.eventId === selectedEventForAttendance.id)
    : [];

  // Handle Event Creation Form Submission
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventDate || !eventVenue.trim()) return;

    onCreateEvent({
      id: 'e' + (events.length + 1),
      title: eventTitle.trim(),
      clubId: coordinatorClub.id,
      clubName: coordinatorClub.name,
      category: eventCategory,
      date: eventDate,
      time: eventTime || '10:00 AM - 01:00 PM',
      venue: eventVenue.trim(),
      capacity: Number(eventCapacity),
      registeredCount: 0,
      description: eventDescription.trim(),
      tags: eventTags.split(',').map(t => t.trim()).filter(Boolean),
      status: 'upcoming',
      coordinator: currentUser.name
    });

    // Reset fields
    setEventTitle('');
    setEventDate('');
    setEventTime('');
    setEventVenue('');
    setEventCapacity(100);
    setEventDescription('');
    setEventTags('');
    setCreateEventModalOpen(false);
  };

  // Open attendance modal
  const openAttendanceModal = (event) => {
    setSelectedEventForAttendance(event);
    setAttendanceModalOpen(true);
  };

  return (
    <div className="page-container">
      {/* Coordinator Top Banner */}
      <div className="welcome-banner coordinator-banner">
        <div className="banner-content">
          <span className="banner-role-badge">Club Coordinator Portal</span>
          <h1 className="banner-heading">Management Hub: {coordinatorClub.name}</h1>
          <p className="banner-subtext">
            Lead: <strong>{currentUser.name}</strong> | Department: {currentUser.department}
          </p>
        </div>
        <div className="banner-action-right">
          <button 
            className="btn-primary"
            onClick={() => setCreateEventModalOpen(true)}
          >
            ➕ Create New Event
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stats-grid">
        <StatCard 
          icon="👥" 
          label="Active Club Members" 
          value={coordinatorClub.membersCount} 
          note="Registered in society"
          color="blue" 
        />
        <StatCard 
          icon="📅" 
          label="Events Hosted" 
          value={clubEvents.length} 
          note="This academic semester"
          color="purple" 
        />
        <StatCard 
          icon="🎫" 
          label="Total Registrations" 
          value={clubEvents.reduce((acc, ev) => acc + ev.registeredCount, 0)} 
          note="Across all club events"
          color="green" 
        />
        <StatCard 
          icon="⭐" 
          label="AI Feedback Score" 
          value="4.8 / 5.0" 
          note="96% positive reviews"
          color="orange" 
        />
      </div>

      {/* Managed Events List */}
      <section className="section-card">
        <div className="section-header">
          <div>
            <h2 className="section-title">Club Events & Attendance Management</h2>
            <p className="section-subtitle">
              Monitor registrations, mark student attendance, and access AI feedback summaries
            </p>
          </div>
          <button 
            className="btn-secondary btn-sm"
            onClick={() => setCreateEventModalOpen(true)}
          >
            + New Event
          </button>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Category & Date</th>
                <th>Venue</th>
                <th>Registrations</th>
                <th>Status</th>
                <th>Management Actions</th>
              </tr>
            </thead>
            <tbody>
              {clubEvents.map((event) => {
                const regCount = event.registeredCount;
                const capacity = event.capacity;
                const fillPct = Math.round((regCount / capacity) * 100);

                return (
                  <tr key={event.id}>
                    <td>
                      <strong>{event.title}</strong>
                    </td>
                    <td>
                      <span className="mini-tag">{event.category}</span>
                      <div className="text-muted" style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                        {event.date}
                      </div>
                    </td>
                    <td>{event.venue}</td>
                    <td>
                      <div style={{ minWidth: '110px' }}>
                        <strong>{regCount}</strong> / {capacity}
                        <div className="progress-bar-bg" style={{ height: '6px', marginTop: '4px' }}>
                          <div 
                            className="progress-bar-fill" 
                            style={{ width: `${fillPct}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${event.status === 'upcoming' ? 'status-pending' : 'status-attended'}`}>
                        {event.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-cell">
                        <button 
                          className="btn-attendance-action"
                          onClick={() => openAttendanceModal(event)}
                        >
                          📋 Mark Attendance
                        </button>

                        <button 
                          className="btn-ai-action"
                          onClick={() => setFeedbackSummaryModalOpen(true)}
                        >
                          ✨ AI Feedback
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* AI Feedback Summarizer (Step 5 & 6 of Synopsis) */}
      <section className="section-card ai-summary-card">
        <div className="section-header">
          <div className="section-title-wrap">
            <span className="ai-sparkle-icon">🤖</span>
            <div>
              <h2 className="section-title">AI Feedback Summarizer & Insights</h2>
              <p className="section-subtitle">
                Automatic NLP extraction of student reviews, common positive points, and improvement areas
              </p>
            </div>
          </div>
          <span className="ai-badge">NLP Synthesis</span>
        </div>

        <div className="ai-summary-grid">
          <div className="ai-stat-box">
            <span className="ai-stat-title">Overall Student Sentiment</span>
            <h3 className="ai-stat-number">{aiInsights.feedbackSummary.averageRating} ★</h3>
            <span className="sentiment-pill positive-pill">{aiInsights.feedbackSummary.positiveRatio}</span>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
              Synthesized from {aiInsights.feedbackSummary.totalReviews} verified student submissions
            </p>
          </div>

          <div className="ai-points-box">
            <h4 className="point-heading green-heading">✅ Top Positive Highlights:</h4>
            <ul className="point-list">
              {aiInsights.feedbackSummary.keyStrengths.map((pt, i) => (
                <li key={i}>{pt}</li>
              ))}
            </ul>

            <h4 className="point-heading orange-heading" style={{ marginTop: '1rem' }}>
              💡 Areas for Improvement:
            </h4>
            <ul className="point-list">
              {aiInsights.feedbackSummary.improvementAreas.map((pt, i) => (
                <li key={i}>{pt}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="ai-recommendation-note">
          <strong>🧠 AI Predictive Recommendation:</strong> {aiInsights.feedbackSummary.aiRecommendation}
        </div>
      </section>

      {/* Modal: Create Event Form */}
      <Modal
        isOpen={createEventModalOpen}
        onClose={() => setCreateEventModalOpen(false)}
        title="Create New Campus Event"
      >
        <form onSubmit={handleCreateSubmit} className="simple-form">
          <div className="form-group">
            <label>Event Title:</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="e.g. NextGen Web3 & AI Hackathon"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Category:</label>
              <select 
                className="form-select"
                value={eventCategory}
                onChange={(e) => setEventCategory(e.target.value)}
              >
                <option value="Technical">Technical</option>
                <option value="Cultural">Cultural</option>
                <option value="Sports">Sports</option>
                <option value="Literary">Literary</option>
                <option value="Social">Social</option>
              </select>
            </div>

            <div className="form-group flex-1">
              <label>Max Registration Limit (Seats):</label>
              <input 
                type="number" 
                className="form-input"
                min="10" 
                max="1000"
                value={eventCapacity}
                onChange={(e) => setEventCapacity(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Event Date:</label>
              <input 
                type="date" 
                className="form-input"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group flex-1">
              <label>Time Schedule:</label>
              <input 
                type="text" 
                className="form-input"
                placeholder="e.g. 10:00 AM - 01:00 PM"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Venue / Hall Location:</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="e.g. Seminar Hall 1 / APJ Abdul Kalam Lab"
              value={eventVenue}
              onChange={(e) => setEventVenue(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Description & Agenda:</label>
            <textarea 
              rows="3" 
              className="form-textarea"
              placeholder="Provide a detailed agenda, eligibility criteria, and key takeaways for participants..."
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Tags for AI Recommendations (comma separated):</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="e.g. AI/ML, Python, Coding, Hackathon"
              value={eventTags}
              onChange={(e) => setEventTags(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => setCreateEventModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Publish Event
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Mark Attendance */}
      <Modal
        isOpen={attendanceModalOpen}
        onClose={() => setAttendanceModalOpen(false)}
        title={selectedEventForAttendance ? `Attendance: ${selectedEventForAttendance.title}` : 'Record Attendance'}
      >
        <div>
          <p className="form-helper">
            Click <strong>Present / Absent</strong> to toggle student attendance. 
            Students marked Present will automatically unlock their official Certificate of Participation.
          </p>

          {activeEventRegistrations.length === 0 ? (
            <p className="empty-text">No students registered yet for this event.</p>
          ) : (
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>USN</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Attendance Toggle</th>
                  </tr>
                </thead>
                <tbody>
                  {activeEventRegistrations.map((reg) => (
                    <tr key={reg.id}>
                      <td><strong>{reg.studentName}</strong></td>
                      <td><code>{reg.studentUsn}</code></td>
                      <td>{reg.department}</td>
                      <td>
                        <span className={`status-badge ${reg.attended ? 'status-attended' : 'status-pending'}`}>
                          {reg.attended ? 'Present ✓' : 'Absent'}
                        </span>
                      </td>
                      <td>
                        <button
                          className={`btn-toggle-att ${reg.attended ? 'attended' : ''}`}
                          onClick={() => onToggleAttendance(reg.id)}
                        >
                          {reg.attended ? 'Mark Absent' : 'Mark Present'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
            <button 
              className="btn-primary" 
              onClick={() => setAttendanceModalOpen(false)}
            >
              Done / Save Attendance
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal: Full AI Feedback Drilldown */}
      <Modal
        isOpen={feedbackSummaryModalOpen}
        onClose={() => setFeedbackSummaryModalOpen(false)}
        title="AI Feedback Insights & Student Comments"
      >
        <div>
          <div className="ai-modal-summary-box">
            <h4>Event: Full-Stack MERN Architecture Masterclass</h4>
            <p><strong>Average Rating:</strong> 4.8 / 5.0 ⭐ (96% Positive)</p>
            <p><strong>Key Takeaway:</strong> High student enthusiasm for practical coding sessions. Ensure lab support is scaled for upcoming events.</p>
          </div>

          <h4 style={{ margin: '1.2rem 0 0.5rem' }}>Individual Student Reviews:</h4>
          <div className="student-reviews-list">
            {feedbacks.map((fb) => (
              <div key={fb.id} className="review-card">
                <div className="review-card-header">
                  <strong>{fb.studentName}</strong>
                  <span className="review-stars">{'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}</span>
                </div>
                <p className="review-comment">"{fb.comment}"</p>
                <span className={`mini-tag ${fb.sentiment === 'positive' ? 'tag-technical' : 'tag-literary'}`}>
                  {fb.sentiment}
                </span>
              </div>
            ))}
          </div>

          <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
            <button className="btn-secondary" onClick={() => setFeedbackSummaryModalOpen(false)}>
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default CoordinatorDashboard;
