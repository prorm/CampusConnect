const crypto = require("node:crypto");
const express = require("express");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const { requireAuth, requireRole } = require("../middleware/auth");
const { buildState, isStaff } = require("../services/state");
const service = require("../services/registrations");
const { text, integer, badRequest, notFound } = require("../utils/http");

const router = express.Router();
router.use(requireAuth);

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const PALETTE = [
  ["mint", "orbit"],
  ["violet", "cube"],
  ["peach", "steps"],
  ["blue", "wave"],
  ["pink", "wave"],
];

function slugFor(title) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return `${base || "event"}-${crypto.randomBytes(3).toString("hex")}`;
}

function eventFields(body) {
  const date = String(body.date || "");
  const deadline = String(body.deadline || date);
  if (!DATE.test(date)) throw badRequest("Date must be YYYY-MM-DD.");
  if (!DATE.test(deadline)) throw badRequest("Deadline must be YYYY-MM-DD.");
  const years = Array.isArray(body.years)
    ? [...new Set(body.years.map(Number))].filter((y) => [1, 2, 3, 4].includes(y))
    : [1, 2, 3, 4];
  const tags = Array.isArray(body.tags)
    ? body.tags
        .filter((t) => typeof t === "string" && t.trim())
        .map((t) => t.trim().slice(0, 40))
        .slice(0, 5)
    : [];
  const category = text(body.category, { field: "Category", max: 40 });
  const [color, art] = PALETTE[Math.floor(Math.random() * PALETTE.length)];
  return {
    title: text(body.title, { field: "Title", max: 100 }),
    club: text(body.club, { field: "Community", max: 60 }),
    category,
    description: text(body.description, { field: "Description", max: 1000 }),
    venue: text(body.venue, { field: "Venue", max: 100 }),
    date,
    deadline,
    start: integer(body.start, { field: "Start", min: 0, max: 1439 }),
    end: integer(body.end, { field: "End", min: 1, max: 1440 }),
    capacity: integer(body.capacity, { field: "Seats", min: 1, max: 5000 }),
    walk: integer(body.walk ?? 5, { field: "Walking time", min: 0, max: 60 }),
    years: years.length ? years : [1, 2, 3, 4],
    tags: tags.length ? tags : [category],
    color,
    art,
  };
}

router.get("/", async (req, res) => {
  const events = await Event.find().sort({ date: 1, start: 1 });
  res.json({ events: events.map((e) => e.toClient()) });
});

router.get("/:slug", async (req, res) => {
  const event = await Event.findOne({ slug: req.params.slug });
  if (!event) throw notFound("That event no longer exists.");
  res.json({ event: event.toClient() });
});

// Staff publish events directly. Students can publish events they read from
// a poster; those are marked as poster listings.
router.post("/", async (req, res) => {
  const fields = eventFields(req.body);
  const staff = isStaff(req.user);
  await Event.create({
    ...fields,
    slug: slugFor(fields.title),
    // New listings start neutral; scores reflect fit, not promotion.
    score: 80,
    source: staff && req.body.source !== "poster" ? "organizer" : "poster",
    createdBy: req.user._id,
  });
  res.status(201).json({
    message: "A new opportunity is now discoverable.",
    state: await buildState(req.user),
  });
});

router.delete("/:slug", requireRole("coordinator", "admin"), async (req, res) => {
  const event = await Event.findOneAndDelete({ slug: req.params.slug });
  if (!event) throw notFound("That event no longer exists.");
  await Registration.deleteMany({ event: event._id });
  res.json({
    message: `${event.title} was removed.`,
    state: await buildState(req.user),
  });
});

router.post("/:slug/registration", async (req, res) => {
  const message = await service.register(req.user, req.params.slug);
  res.status(201).json({ message, state: await buildState(req.user) });
});

router.delete("/:slug/registration", async (req, res) => {
  const message = await service.cancel(req.user, req.params.slug);
  res.json({ message, state: await buildState(req.user) });
});

router.post(
  "/:slug/release",
  requireRole("coordinator", "admin"),
  async (req, res) => {
    const message = await service.releaseSeat(req.params.slug);
    res.json({ message, state: await buildState(req.user) });
  },
);

router.put(
  "/:slug/attendance/:userId",
  requireRole("coordinator", "admin"),
  async (req, res) => {
    const message = await service.setAttendance(
      req.params.slug,
      req.params.userId,
      req.body.present,
    );
    res.json({ message, state: await buildState(req.user) });
  },
);

module.exports = router;
