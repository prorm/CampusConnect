const express = require("express");
const rateLimit = require("express-rate-limit");
const env = require("../config/env");
const Feedback = require("../models/Feedback");
const Event = require("../models/Event");
const { requireAuth, requireRole } = require("../middleware/auth");
const { buildState, timetableFor } = require("../services/state");
const ai = require("../services/ai");
const { text, badRequest, notFound } = require("../utils/http");

const router = express.Router();
router.use(requireAuth);
router.use(
  rateLimit({
    windowMs: 60 * 1000,
    limit: env.isTest ? 1000 : 20,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { error: "That's a lot of questions at once. Give it a minute." },
  }),
);

router.get("/status", (req, res) => res.json(ai.aiStatus()));

router.post("/assistant", async (req, res) => {
  const message = text(req.body.message, { field: "Message", max: 300 });
  const history = (Array.isArray(req.body.history) ? req.body.history : [])
    .filter(
      (m) =>
        ["user", "assistant"].includes(m?.role) &&
        typeof m.text === "string" &&
        m.text.trim(),
    )
    .slice(-8)
    .map((m) => ({ role: m.role, content: m.text.slice(0, 1200) }));
  // The conversation must open with a user turn.
  while (history.length && history[0].role !== "user") history.shift();
  const state = await buildState(req.user);
  const result = await ai.assistantReply(message, history, {
    state,
    profile: { timetable: timetableFor(req.user), year: req.user.year },
  });
  res.json(result);
});

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

router.post("/poster", async (req, res) => {
  const notes = text(req.body.text, {
    field: "Poster text",
    max: 4000,
    required: false,
  });
  let image = null;
  if (req.body.image) {
    const { data, mediaType } = req.body.image;
    if (!IMAGE_TYPES.includes(mediaType))
      throw badRequest("Use a PNG, JPG, or WebP poster.");
    if (typeof data !== "string" || !/^[A-Za-z0-9+/=]+$/.test(data))
      throw badRequest("The poster image isn't valid base64.");
    if (data.length > 7 * 1024 * 1024)
      throw badRequest("Keep poster images under 5 MB.");
    image = { data, mediaType };
  }
  if (!image && !notes)
    throw badRequest("Add a poster image or paste the poster text.");
  res.json(await ai.readPoster({ text: notes, image }));
});

router.get(
  "/feedback-summary",
  requireRole("coordinator", "admin"),
  async (req, res) => {
    const filter = {};
    if (req.query.event) {
      const event = await Event.findOne({ slug: String(req.query.event) });
      if (!event) throw notFound("That event no longer exists.");
      filter.event = event._id;
    }
    const feedbacks = await Feedback.find(filter)
      .sort({ createdAt: -1 })
      .limit(60);
    res.json(await ai.summarizeFeedback(feedbacks));
  },
);

module.exports = router;
