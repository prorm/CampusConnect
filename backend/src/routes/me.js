const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { buildState } = require("../services/state");
const Activity = require("../models/Activity");
const Feedback = require("../models/Feedback");
const { sentimentFor } = require("../services/ai");
const {
  text,
  integer,
  badRequest,
  notFound,
  conflict,
} = require("../utils/http");

const router = express.Router();
router.use(requireAuth);

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const minutes = (value, field) => {
  if (!TIME.test(value || "")) throw badRequest(`${field} must be HH:MM.`);
  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
};

router.get("/state", async (req, res) => {
  res.json(await buildState(req.user));
});

router.post("/timetable", async (req, res) => {
  const start = minutes(req.body.start, "Start");
  const end = minutes(req.body.end, "End");
  if (end <= start) throw badRequest("A class must end after it starts.");
  const days = Array.isArray(req.body.days)
    ? [...new Set(req.body.days.map(Number))].filter((d) =>
        [0, 1, 2, 3, 4, 5, 6].includes(d),
      )
    : [];
  if (!days.length) throw badRequest("Choose at least one day.");
  if (req.user.timetable.length >= 40)
    throw badRequest("Your timetable already has 40 classes.");
  req.user.timetable.push({
    title: text(req.body.title, { field: "Class name", max: 80 }),
    venue: text(req.body.venue, { field: "Venue", max: 80, required: false }),
    start,
    end,
    days,
  });
  await req.user.save();
  res.status(201).json({
    message: "Class added. Fit checks now include it.",
    state: await buildState(req.user),
  });
});

router.delete("/timetable/:id", async (req, res) => {
  const entry = req.user.timetable.id(req.params.id);
  if (!entry) throw notFound("That class isn't in your timetable.");
  entry.deleteOne();
  await req.user.save();
  res.json({ message: "Class removed.", state: await buildState(req.user) });
});

router.post("/activities/:key/feedback", async (req, res) => {
  const activity = await Activity.findOne({
    user: req.user._id,
    key: req.params.key,
  });
  if (!activity) throw notFound("That activity isn't in your passport.");
  if (activity.feedback) throw conflict("You've already shared a reflection.");
  const rating = integer(req.body.rating, { field: "Rating", min: 1, max: 5 });
  await Feedback.create({
    user: req.user._id,
    activityKey: activity.key,
    event: activity.event,
    title: activity.title,
    rating,
    comment: text(req.body.comment, { field: "Reflection", max: 1000 }),
    sentiment: sentimentFor(rating),
  });
  activity.feedback = true;
  await activity.save();
  res.status(201).json({
    message: "Reflection saved. Thanks for making the next experience better.",
    state: await buildState(req.user),
  });
});

module.exports = router;
