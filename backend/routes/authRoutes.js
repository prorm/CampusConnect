const express = require('express');
const router = express.Router();

// Mock Auth Routes for MERN
// POST /api/auth/register
router.post('/register', (req, res) => {
  const { name, email, role, department, usn, interests } = req.body;
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: { id: 'usr_' + Date.now(), name, email, role, department, usn, interests }
  });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    token: 'mock-jwt-token-campusconnect',
    user: { email, role: 'student', name: 'Student Demo' }
  });
});

module.exports = router;
