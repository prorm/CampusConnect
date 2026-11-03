const express = require("express");
const Announcement = require("../models/Announcement");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const Activity = require("../models/Activity");
const Feedback = require("../models/Feedback");
const Community = require("../models/Community");
const User = require("../models/User");
const env = require("../config/env");
const { requireAuth, requireRole, signToken } = require("../middleware/auth");
const { buildState } = require("../services/state");
const { seedDatabase } = require("../seed/seed");
const { users: demoUsers } = require("../seed/data");
const { text, notFound, forbidden } = require("../utils/http");

const router = express.Router();
router.use(requireAuth);

// Restores the seeded presentation campus. Only available in demo mode.
router.post("/reset", async (req, res) => {
  if (!env.demoAccounts) throw notFound("Demo reset is disabled.");
  if (!demoUsers.some((u) => u.email === req.user.email))
    throw forbidden("Sign in with a demo account to reset the demo campus.");
  await seedDatabase();
  const user = await User.findOne({ email: req.user.email });
  res.json({
    message: "A fresh campus day. The demo is ready to explore.",
    token: signToken(user),
    state: await buildState(user),
  });
});

router.put("/announcement", requireRole("admin"), async (req, res) => {
  await Announcement.create({
    text: text(req.body.text, { field: "Announcement", max: 300 }),
    author: req.user._id,
  });
  res.json({
    message: "Your note is now on every student's campus today.",
    state: await buildState(req.user),
  });
});

router.get(
  "/analytics",
  requireRole("coordinator", "admin"),
  async (req, res) => {
    const [
      students,
      events,
      tracked,
      attended,
      activities,
      feedback,
      communities,
    ] = await Promise.all([
      User.countDocuments({ role: "student" }),
      Event.find(),
      Registration.countDocuments({ status: "registered" }),
      Registration.countDocuments({ status: "registered", attended: true }),
      Activity.aggregate([{ $group: { _id: "$skill", count: { $sum: 1 } } }]),
      Feedback.aggregate([
        {
          $group: {
            _id: "$sentiment",
            count: { $sum: 1 },
            rating: { $sum: "$rating" },
          },
        },
      ]),
      Community.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            members: { $sum: "$members" },
          },
        },
      ]),
    ]);

    const seats = events.reduce((sum, e) => sum + e.capacity, 0);
    const filled = events.reduce((sum, e) => sum + e.registered, 0);
    const categories = new Map();
    for (const e of events) {
      const c = categories.get(e.category) || {
        category: e.category,
        events: 0,
        registered: 0,
        capacity: 0,
      };
      c.events += 1;
      c.registered += e.registered;
      c.capacity += e.capacity;
      categories.set(e.category, c);
    }
    const feedbackCount = feedback.reduce((sum, f) => sum + f.count, 0);
    const community = Object.fromEntries(communities.map((c) => [c._id, c]));

    res.json({
      totals: {
        students,
        events: events.length,
        seatsFilled: filled,
        seats,
        fillRate: seats ? filled / seats : 0,
        waitlisted: events.reduce((sum, e) => sum + e.waitlist, 0),
        trackedRegistrations: tracked,
        checkIns: attended,
        attendanceRate: tracked ? attended / tracked : 0,
        verifiedActivities: activities.reduce((sum, a) => sum + a.count, 0),
        communities: community.active?.count || 0,
        communityMembers: community.active?.members || 0,
        pendingProposals: community.pending?.count || 0,
      },
      categories: [...categories.values()].sort(
        (a, b) => b.registered - a.registered,
      ),
      topEvents: events
        .map((e) => ({
          id: e.slug,
          title: e.title,
          registered: e.registered,
          capacity: e.capacity,
          waitlist: e.waitlist,
          fill: e.registered / e.capacity,
        }))
        .sort((a, b) => b.fill - a.fill || b.waitlist - a.waitlist)
        .slice(0, 5),
      skills: activities
        .map((a) => ({ skill: a._id, count: a.count }))
        .sort((a, b) => b.count - a.count),
      feedback: {
        count: feedbackCount,
        average: feedbackCount
          ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedbackCount
          : 0,
        sentiment: Object.fromEntries(feedback.map((f) => [f._id, f.count])),
      },
    });
  },
);

module.exports = router;
