const express = require('express');
const router = express.Router();

// POST /api/ai/recommendations - Personalized recommendations based on student interests
router.post('/recommendations', (req, res) => {
  const { interests, previousParticipation } = req.body;
  res.json({
    success: true,
    recommendations: {
      clubs: ['Google Developer Student Club', 'AI & Robotics Syndicate'],
      events: ['HackMatrix 2026', 'Computer Vision Hands-on Bootcamp']
    }
  });
});

// POST /api/ai/summarize-feedback - AI Feedback summarization
router.post('/summarize-feedback', (req, res) => {
  const { eventId } = req.body;
  res.json({
    success: true,
    summary: {
      sentimentScore: '94% Positive',
      keyStrengths: [
        'Hands-on practical code walkthroughs were praised.',
        'Knowledgeable and engaging mentors.',
        'Well-organized schedule and refreshments.'
      ],
      improvementAreas: [
        'More time requested for debugging session in lab.',
        'High demand for post-workshop slide access.'
      ]
    }
  });
});

module.exports = router;
