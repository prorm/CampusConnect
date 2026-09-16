const express = require('express');
const router = express.Router();

// GET /api/analytics/overview
router.get('/overview', (req, res) => {
  res.json({
    success: true,
    data: {
      totalClubs: 12,
      activeMembers: 840,
      totalEvents: 34,
      totalRegistrations: 1420,
      attendanceRate: '88.4%'
    }
  });
});

module.exports = router;
