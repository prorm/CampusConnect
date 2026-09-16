import React, { useState } from 'react';
import Modal from '../components/Modal';

// Basic React Component: AuthModal
// Implements Step 1 of Synopsis: User Registration and Login with Role Selection.
function AuthModal({ isOpen, onClose, onRegisterNewUser, onSelectDemoUser, allUsers }) {
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  
  // Registration form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');
  const [usn, setUsn] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engg');
  const [year, setYear] = useState('3rd Year');
  const [selectedInterests, setSelectedInterests] = useState(['Coding', 'AI/ML']);

  const availableInterests = [
    'AI/ML', 'Coding', 'Web Development', 'Robotics', 
    'Music', 'Dance', 'Debate', 'Sports', 'Competitive Coding'
  ];

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !usn.trim()) return;

    const newUser = {
      id: 'usr_' + Date.now(),
      name: name.trim(),
      email: email.trim(),
      role: role,
      usn: usn.trim(),
      department: department,
      year: year,
      interests: selectedInterests,
      avatar: role === 'student' ? '🎓' : role === 'coordinator' ? '👨‍🏫' : '🏛️'
    };

    onRegisterNewUser(newUser);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={authMode === 'login' ? 'User Authentication' : 'Create New Account'}>
      <div className="auth-container">
        {/* Toggle between Login & Register */}
        <div className="auth-tab-switch">
          <button 
            type="button"
            className={`switch-tab ${authMode === 'login' ? 'active' : ''}`}
            onClick={() => setAuthMode('login')}
          >
            Quick Demo Login
          </button>
          <button 
            type="button"
            className={`switch-tab ${authMode === 'register' ? 'active' : ''}`}
            onClick={() => setAuthMode('register')}
          >
            New Registration
          </button>
        </div>

        {authMode === 'login' ? (
          <div className="demo-login-box">
            <p className="form-helper">
              Select a persona from the synopsis to explore the application:
            </p>
            <div className="demo-users-list">
              {allUsers.map((user) => (
                <div 
                  key={user.id} 
                  className="demo-user-card"
                  onClick={() => {
                    onSelectDemoUser(user);
                    onClose();
                  }}
                >
                  <span className="demo-user-avatar">{user.avatar}</span>
                  <div className="demo-user-info">
                    <strong>{user.name}</strong>
                    <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                      {user.department} • <code>{user.usn}</code>
                    </div>
                  </div>
                  <span className={`role-badge role-${user.role}`}>
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="simple-form">
            <div className="form-row">
              <div className="form-group flex-1">
                <label>Full Name:</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group flex-1">
                <label>Email Address:</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="student@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label>Account Role:</label>
                <select 
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="student">Student</option>
                  <option value="coordinator">Club Coordinator</option>
                  <option value="admin">College Administrator</option>
                </select>
              </div>

              <div className="form-group flex-1">
                <label>USN / Faculty ID:</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. 1MS24CI099"
                  value={usn}
                  onChange={(e) => setUsn(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label>Department:</label>
                <select 
                  className="form-select"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value="Computer Science & Engg">Computer Science & Engg</option>
                  <option value="Information Science & Engg">Information Science & Engg</option>
                  <option value="AI & Data Science">AI & Data Science</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                </select>
              </div>

              <div className="form-group flex-1">
                <label>Academic Year:</label>
                <select 
                  className="form-select"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Select Your Areas of Interest (Feeds AI Recommendations):</label>
              <div className="interest-selection-grid">
                {availableInterests.map((interest) => {
                  const isChecked = selectedInterests.includes(interest);
                  return (
                    <button
                      type="button"
                      key={interest}
                      className={`interest-select-pill ${isChecked ? 'selected' : ''}`}
                      onClick={() => toggleInterest(interest)}
                    >
                      {isChecked ? '✓ ' : '+ '}{interest}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Complete Registration
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}

export default AuthModal;
