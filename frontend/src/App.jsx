import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import AuthModal from './pages/AuthModal';

// Pages
import StudentDashboard from './pages/StudentDashboard';
import CoordinatorDashboard from './pages/CoordinatorDashboard';
import ClubsPage from './pages/ClubsPage';
import EventsPage from './pages/EventsPage';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import AdminManagement from './pages/AdminManagement';

// Mock Data
import { 
  initialUsers, 
  initialClubs, 
  initialEvents, 
  initialRegistrations, 
  initialFeedbacks, 
  initialAiInsights 
} from './data/mockData';

import './App.css';

// Main Application Component
// Basic React application orchestrating state, role views, and modules.
function App() {
  // Application State
  const [allUsers, setAllUsers] = useState(initialUsers);
  const [currentUser, setCurrentUser] = useState(initialUsers[0]); // Default: Student (Pranav R Mane)
  const [clubs, setClubs] = useState(initialClubs);
  const [events, setEvents] = useState(initialEvents);
  const [registrations, setRegistrations] = useState(initialRegistrations);
  const [feedbacks, setFeedbacks] = useState(initialFeedbacks);
  const [aiInsights, setAiInsights] = useState(initialAiInsights);
  
  // Navigation & UI State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [joinedClubIds, setJoinedClubIds] = useState(['c1', 'c2']);
  const [toastMessage, setToastMessage] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [collegeAnnouncement, setCollegeAnnouncement] = useState(
    '📢 Welcome to the Fall 2026 Semester! Club recruitments and HackMatrix registrations are currently open.'
  );

  // Helper: Trigger floating toast notification
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4500);
  };

  // 1. Role / User Switcher Handler
  const handleSelectUser = (user) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
    triggerToast(`Switched active persona to ${user.name} (${user.role.toUpperCase()})`);
  };

  // 2. Register New User (Step 1 of Synopsis)
  const handleRegisterNewUser = (newUser) => {
    setAllUsers([...allUsers, newUser]);
    setCurrentUser(newUser);
    setActiveTab('dashboard');
    triggerToast(`Welcome ${newUser.name}! Account registered successfully as ${newUser.role}.`);
  };

  // 3. Event Registration Handler (Step 4 of Synopsis)
  const handleRegisterEvent = (event) => {
    // Check if already registered
    const alreadyRegistered = registrations.some(
      r => r.eventId === event.id && r.studentId === currentUser.id
    );

    if (alreadyRegistered) {
      triggerToast('You are already registered for this event!');
      return;
    }

    if (event.registeredCount >= event.capacity) {
      triggerToast('Sorry, this event is already at full capacity!');
      return;
    }

    // Create new registration record
    const newReg = {
      id: 'reg-' + (registrations.length + 1),
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentUsn: currentUser.usn,
      department: currentUser.department,
      eventId: event.id,
      eventTitle: event.title,
      clubName: event.clubName,
      eventDate: event.date,
      attended: false,
      certificateIssued: false,
      feedbackSubmitted: false
    };

    setRegistrations([...registrations, newReg]);

    // Increment registered count for the event
    setEvents(events.map(ev => 
      ev.id === event.id 
        ? { ...ev, registeredCount: ev.registeredCount + 1 }
        : ev
    ));

    triggerToast(`Successfully registered for "${event.title}"!`);
  };

  // 4. Join / Leave Club Handler (Step 2 of Synopsis)
  const handleJoinClub = (clubId) => {
    const isJoined = joinedClubIds.includes(clubId);
    if (isJoined) {
      // Leave club
      setJoinedClubIds(joinedClubIds.filter(id => id !== clubId));
      setClubs(clubs.map(c => c.id === clubId ? { ...c, membersCount: c.membersCount - 1 } : c));
      triggerToast('You have left the club.');
    } else {
      // Join club
      setJoinedClubIds([...joinedClubIds, clubId]);
      setClubs(clubs.map(c => c.id === clubId ? { ...c, membersCount: c.membersCount + 1 } : c));
      const club = clubs.find(c => c.id === clubId);
      triggerToast(`Welcome to ${club ? club.name : 'the club'}!`);
    }
  };

  // 5. Create Event Handler (Step 3 of Synopsis - Coordinators)
  const handleCreateEvent = (newEvent) => {
    setEvents([newEvent, ...events]);
    triggerToast(`Event "${newEvent.title}" created and published!`);
  };

  // 6. Toggle Attendance Handler (Step 4 & 5 of Synopsis - Coordinators)
  const handleToggleAttendance = (registrationId) => {
    setRegistrations(registrations.map(reg => {
      if (reg.id === registrationId) {
        const newAttended = !reg.attended;
        return {
          ...reg,
          attended: newAttended,
          // If marked attended, automatically unlock verifiable certificate
          certificateIssued: newAttended
        };
      }
      return reg;
    }));

    triggerToast('Attendance status updated. Certificates generated for attendees.');
  };

  // 7. Submit Feedback Handler (Step 5 of Synopsis)
  const handleSubmitFeedback = ({ eventId, eventTitle, studentName, rating, comment, registrationId }) => {
    const newFeedback = {
      id: 'fb-' + (feedbacks.length + 1),
      eventId,
      eventTitle,
      studentName,
      rating,
      comment,
      sentiment: rating >= 4 ? 'positive' : rating === 3 ? 'neutral' : 'constructive'
    };

    setFeedbacks([newFeedback, ...feedbacks]);

    // Mark feedback as submitted on registration record
    setRegistrations(registrations.map(r => 
      r.id === registrationId ? { ...r, feedbackSubmitted: true } : r
    ));

    triggerToast('Thank you! Your feedback was recorded and fed into the AI Summarizer.');
  };

  // 8. Propose New Club Handler (Student or Coordinator)
  const handleProposeClub = (newClub) => {
    setClubs([...clubs, newClub]);
    triggerToast(`Club proposal "${newClub.name}" submitted! Awaiting Admin review.`);
  };

  // 9. Admin Approvals
  const handleApproveClub = (clubId) => {
    setClubs(clubs.map(c => c.id === clubId ? { ...c, status: 'active' } : c));
    triggerToast('Club charter approved and activated campus-wide!');
  };

  const handleRejectClub = (clubId) => {
    setClubs(clubs.filter(c => c.id !== clubId));
    triggerToast('Club proposal rejected.');
  };

  // 10. Admin Broadcast Announcement
  const handleBroadcastAnnouncement = (text) => {
    setCollegeAnnouncement(`📢 ${text}`);
    triggerToast('Announcement broadcasted to all campus dashboards!');
  };

  return (
    <div className="app-root">
      {/* Top Navigation Bar */}
      <Navbar 
        currentUser={currentUser} 
        allUsers={allUsers}
        onSelectUser={handleSelectUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* College Wide Announcement Banner */}
      {collegeAnnouncement && (
        <div className="announcement-strip">
          <div className="announcement-inner">
            <span>{collegeAnnouncement}</span>
            <button 
              className="announcement-close" 
              onClick={() => setCollegeAnnouncement(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Role Switcher Floating Bar (Quick Demo Helper) */}
      <div className="quick-persona-bar">
        <span className="persona-bar-label">Current Role: <strong>{currentUser.role.toUpperCase()}</strong></span>
        <div className="persona-btn-group">
          <button 
            className={`persona-chip ${currentUser.role === 'student' ? 'active' : ''}`}
            onClick={() => handleSelectUser(allUsers.find(u => u.role === 'student'))}
          >
            👨‍💻 Student View (Pranav)
          </button>
          <button 
            className={`persona-chip ${currentUser.role === 'coordinator' ? 'active' : ''}`}
            onClick={() => handleSelectUser(allUsers.find(u => u.role === 'coordinator'))}
          >
            👨‍🏫 Coordinator View (Dr. Rajesh)
          </button>
          <button 
            className={`persona-chip ${currentUser.role === 'admin' ? 'active' : ''}`}
            onClick={() => handleSelectUser(allUsers.find(u => u.role === 'admin'))}
          >
            🏛️ Admin View (Dean Sen)
          </button>
          <button 
            className="persona-chip chip-register"
            onClick={() => setAuthModalOpen(true)}
          >
            ➕ Register / Login
          </button>
        </div>
      </div>

      {/* Main Page Routing via Active Tab */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          currentUser.role === 'student' ? (
            <StudentDashboard 
              currentUser={currentUser}
              clubs={clubs}
              events={events}
              registrations={registrations}
              feedbacks={feedbacks}
              onRegisterEvent={handleRegisterEvent}
              onSubmitFeedback={handleSubmitFeedback}
              setActiveTab={setActiveTab}
            />
          ) : currentUser.role === 'coordinator' ? (
            <CoordinatorDashboard 
              currentUser={currentUser}
              clubs={clubs}
              events={events}
              registrations={registrations}
              feedbacks={feedbacks}
              aiInsights={aiInsights}
              onCreateEvent={handleCreateEvent}
              onToggleAttendance={handleToggleAttendance}
            />
          ) : (
            <AdminManagement 
              currentUser={currentUser}
              allUsers={allUsers}
              clubs={clubs}
              onApproveClub={handleApproveClub}
              onRejectClub={handleRejectClub}
              onBroadcastAnnouncement={handleBroadcastAnnouncement}
            />
          )
        )}

        {activeTab === 'clubs' && (
          <ClubsPage 
            currentUser={currentUser}
            clubs={clubs}
            onJoinClub={handleJoinClub}
            onProposeClub={handleProposeClub}
            joinedClubIds={joinedClubIds}
          />
        )}

        {activeTab === 'events' && (
          <EventsPage 
            currentUser={currentUser}
            events={events}
            registrations={registrations}
            onRegisterEvent={handleRegisterEvent}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard 
            aiInsights={aiInsights}
          />
        )}

        {activeTab === 'admin' && (
          <AdminManagement 
            currentUser={currentUser}
            allUsers={allUsers}
            clubs={clubs}
            onApproveClub={handleApproveClub}
            onRejectClub={handleRejectClub}
            onBroadcastAnnouncement={handleBroadcastAnnouncement}
          />
        )}
      </main>

      {/* Floating Action Notifications */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Login / Register Modal */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        allUsers={allUsers}
        onSelectDemoUser={handleSelectUser}
        onRegisterNewUser={handleRegisterNewUser}
      />

      {/* Footer with Project Details from Synopsis */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-col">
            <h3 className="footer-title">CampusConnect</h3>
            <p className="footer-text">
              An AI-Powered College Club and Event Management System with Student Engagement Analytics.
            </p>
            <p className="footer-copy">© 2026 CampusConnect. Iterative Full-Stack MERN Architecture.</p>
          </div>

          <div className="footer-col">
            <h4 className="footer-subtitle">Project Team (Synopsis)</h4>
            <ul className="footer-team-list">
              <li><strong>Sinchana Jeppu</strong> (1MS24CI124)</li>
              <li><strong>Pranav R Mane</strong> (1MS24CI091)</li>
              <li><strong>Prajwal N</strong> (1MS24CI090)</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-subtitle">System Modules</h4>
            <p className="footer-text" style={{ fontSize: '0.85rem', lineHeight: '1.7' }}>
              • Role-Based Access (Student / Coordinator / Admin)<br/>
              • AI Club & Event Recommendations<br/>
              • Attendance Tracking & Certificate Issuance<br/>
              • NLP Feedback Summarizer & Engagement Analytics
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
