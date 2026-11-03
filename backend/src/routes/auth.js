const express = require("express");
const rateLimit = require("express-rate-limit");
const env = require("../config/env");
const User = require("../models/User");
const { signToken, requireAuth } = require("../middleware/auth");
const { buildState } = require("../services/state");
const { users: demoUsers, weeklyTimetable } = require("../seed/data");
const {
  text,
  integer,
  badRequest,
  unauthorized,
  conflict,
  notFound,
} = require("../utils/http");

const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: env.isTest ? 1000 : 50,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many sign-in attempts. Try again in a few minutes." },
});

const session = async (user) => ({
  token: signToken(user),
  state: await buildState(user),
});

function interestsFrom(value) {
  if (!Array.isArray(value)) return [];
  return [
    ...new Set(
      value
        .filter((i) => typeof i === "string")
        .map((i) => i.trim())
        .filter(Boolean),
    ),
  ]
    .slice(0, 8)
    .map((i) => i.slice(0, 40));
}

// Accounts created here are always students. Staff accounts are seeded or
// promoted by an administrator.
router.post("/register", limiter, async (req, res) => {
  const name = text(req.body.name, { field: "Name", max: 80 });
  const email = text(req.body.email, { field: "Email", max: 120 }).toLowerCase();
  const password = typeof req.body.password === "string" ? req.body.password : "";
  if (password.length < 8)
    throw badRequest("Use a password of at least 8 characters.");
  if (await User.exists({ email }))
    throw conflict("An account with that email already exists. Sign in instead.");
  const user = new User({
    name,
    email,
    role: "student",
    usn: text(req.body.usn, { field: "USN", max: 20, required: false }),
    department:
      text(req.body.department, { field: "Department", max: 60, required: false }) ||
      "Computer Science",
    year: integer(req.body.year ?? 1, { field: "Year", min: 1, max: 4 }),
    interests: interestsFrom(req.body.interests),
    // A starter timetable keeps fit checks meaningful until the student
    // replaces it with their own classes.
    timetable: weeklyTimetable,
  });
  await user.setPassword(password);
  await user.save();
  res.status(201).json(await session(user));
});

router.post("/login", limiter, async (req, res) => {
  const email = text(req.body.email, { field: "Email", max: 120 }).toLowerCase();
  const password = typeof req.body.password === "string" ? req.body.password : "";
  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user || !(await user.checkPassword(password)))
    throw unauthorized("That email and password don't match.");
  res.json(await session(user));
});

// One-click sign-in for the seeded presentation accounts. Disable with
// DEMO_ACCOUNTS=false for any real deployment.
router.get("/demo-accounts", (req, res) => {
  res.json({
    enabled: env.demoAccounts,
    accounts: env.demoAccounts
      ? demoUsers.map((u) => ({
          email: u.email,
          name: u.name,
          role: u.role,
          title: u.title || `${u.department} · Year ${u.year}`,
        }))
      : [],
  });
});

router.post("/demo", limiter, async (req, res) => {
  if (!env.demoAccounts) throw notFound("Demo accounts are disabled.");
  const email = String(req.body.email || "").toLowerCase();
  if (!demoUsers.some((u) => u.email === email))
    throw badRequest("That isn't a demo account.");
  const user = await User.findOne({ email });
  if (!user)
    throw notFound("Demo accounts aren't seeded yet. Run npm run seed.");
  res.json(await session(user));
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user.toProfile() });
});

router.patch("/me", requireAuth, async (req, res) => {
  const user = req.user;
  if ("name" in req.body) user.name = text(req.body.name, { field: "Name", max: 80 });
  if ("department" in req.body)
    user.department = text(req.body.department, { field: "Department", max: 60 });
  if ("usn" in req.body)
    user.usn = text(req.body.usn, { field: "USN", max: 20, required: false });
  if ("year" in req.body)
    user.year = integer(req.body.year, { field: "Year", min: 1, max: 4 });
  if ("interests" in req.body) user.interests = interestsFrom(req.body.interests);
  await user.save();
  res.json({ message: "Profile updated.", state: await buildState(user) });
});

module.exports = router;
