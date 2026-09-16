const express = require('express');
const router = express.Router();

// GET /api/clubs - List all clubs
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Fetch clubs endpoint ready' });
});

// POST /api/clubs - Create a new club (Coordinator/Admin)
router.post('/', (req, res) => {
  res.status(201).json({ success: true, message: 'Club created endpoint ready', club: req.body });
});

// POST /api/clubs/:id/join - Join a club
router.post('/:id/join', (req, res) => {
  res.json({ success: true, message: `Joined club ${req.params.id}` });
});

module.exports = router;
