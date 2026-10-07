// Builds the role-aware snapshot the React client renders from.
const env = require("../config/env");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const Activity = require("../models/Activity");
const Community = require("../models/Community");
const Announcement = require("../models/Announcement");
const Feedback = require("../models/Feedback");
const { aiStatus } = require("./ai");

const staffRoles = ["coordinator", "admin"];
const isStaff = (user) => staffRoles.includes(user.role);

const timetableFor = (user) =>
  user.timetable.map((c) => ({
    id: String(c._id),
    title: c.title,
    start: c.start,
    end: c.end,
    venue: c.venue,
    days: c.days,
  }));

async function rostersFor(events) {
  const registrations = await Registration.find({
    event: { $in: events.map((e) => e._id) },
  })
    .populate("user", "name department year role")
    .sort({ status: 1, position: 1, createdAt: 1 });
  const slugById = new Map(events.map((e) => [String(e._id), e.slug]));
  const rosters = Object.fromEntries(events.map((e) => [e.slug, []]));
  for (const r of registrations) {
    if (!r.user) continue;
    rosters[slugById.get(String(r.event))].push({
      id: String(r.user._id),
      name: r.user.name,
      detail: `${r.user.department} · Year ${r.user.year}`,
      status: r.status,
      position: r.position,
      attended: r.attended,
    });
  }
  return rosters;
}

async function buildState(user) {
  const staff = isStaff(user);
  const [events, registrations, activities, communities, announcement] =
    await Promise.all([
      Event.find().sort({ date: 1, start: 1 }),
      Registration.find({ user: user._id }).populate("event", "slug"),
      Activity.find({ user: user._id }).sort({ date: -1 }),
      Community.find(
        user.role === "admin"
          ? { status: { $in: ["active", "pending"] } }
          : {
              $or: [
                { status: "active" },
                { status: "pending", proposedBy: user._id },
              ],
            },
      ).sort({ createdAt: 1 }),
      Announcement.findOne().sort({ createdAt: -1 }),
    ]);
  const feedbacks = await Feedback.find(staff ? {} : { user: user._id })
    .populate("user", "name")
    .sort({ createdAt: -1 })
    .limit(100);
  const joined = new Set(user.joined.map(String));
  return {
    user: user.toProfile(),
    timetable: timetableFor(user),
    events: events.map((e) => e.toClient()),
    registrations: registrations
      .filter((r) => r.event)
      .map((r) => ({
        eventId: r.event.slug,
        status: r.status,
        position: r.position,
        attended: r.attended,
      })),
    activities: activities.map((a) => a.toClient()),
    communities: communities
      .filter((c) => c.status === "active")
      .map((c) => c.toClient()),
    joined: communities
      .filter((c) => joined.has(String(c._id)))
      .map((c) => c.slug),
    proposals: communities
      .filter((c) => c.status === "pending")
      .map((c) => ({ id: c.slug, name: c.name, description: c.description })),
    announcement: announcement?.text || "",
    feedbacks: feedbacks.map((f) => ({
      id: f.activityKey,
      title: f.title,
      rating: f.rating,
      comment: f.comment,
      sentiment: f.sentiment,
      name: f.user?.name || "A student",
    })),
    rosters: staff ? await rostersFor(events) : {},
    clock: { date: env.demoDate, now: env.demoNow },
    ai: aiStatus(),
  };
}

module.exports = { buildState, isStaff, timetableFor };
