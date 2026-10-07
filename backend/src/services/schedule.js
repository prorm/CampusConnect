// Timetable feasibility rules shared by registration, recommendations, and
// the assistant. Times are minutes since midnight in campus time.
const env = require("../config/env");

function weekday(date) {
  return new Date(`${date}T12:00:00Z`).getUTCDay();
}

function clock(minutes) {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

/** Classes that meet on a calendar date, expanded with that date. */
function classesOn(timetable, date) {
  const day = weekday(date);
  return timetable
    .filter((c) => c.days.includes(day))
    .map((c) => ({
      id: String(c._id || c.id),
      title: c.title,
      start: c.start,
      end: c.end,
      venue: c.venue,
      date,
    }));
}

const overlaps = (event, start, end) =>
  event.start - event.walk < end && event.end + event.walk > start;

/**
 * @param event        client-shaped event
 * @param registrations [{ eventId, status }]
 * @param events        client-shaped events, used to resolve registrations
 * @param profile       { timetable, year }
 */
function feasibility(event, registrations, events, profile, clockNow = {}) {
  const today = clockNow.date || env.demoDate;
  const now = clockNow.now ?? env.demoNow;
  const conflicts = classesOn(profile.timetable, event.date).filter((c) =>
    overlaps(event, c.start, c.end),
  );
  const clashes = registrations
    .filter((r) => r.status === "registered" && r.eventId !== event.id)
    .map((r) => events.find((e) => e.id === r.eventId))
    .filter((e) => e && e.date === event.date && overlaps(event, e.start, e.end));
  const eligible = event.years.includes(profile.year);
  const expired =
    event.deadline < today ||
    event.date < today ||
    (event.date === today && event.start < now);
  return {
    ok: !conflicts.length && !clashes.length && eligible && !expired,
    conflicts,
    overlaps: clashes,
    eligible,
    expired,
    reason: expired
      ? "This opportunity has already started or closed."
      : !eligible
        ? "This event is not open to your year."
        : conflicts.length
          ? `Overlaps ${conflicts[0].title}, including walking time.`
          : clashes.length
            ? `Overlaps your ${clashes[0].title} registration.`
            : "Fits your timetable, including walking time.",
  };
}

/** The current break: from now until the next class or confirmed plan. */
function freeWindow(events, registrations, timetable, clockNow = {}) {
  const today = clockNow.date || env.demoDate;
  const now = clockNow.now ?? env.demoNow;
  const plans = [
    ...classesOn(timetable, today).map((c) => ({
      ...c,
      type: "class",
      busyStart: c.start,
      busyEnd: c.end,
    })),
    ...registrations
      .filter((r) => r.status === "registered")
      .map((r) => events.find((e) => e.id === r.eventId))
      .filter((e) => e && e.date === today)
      .map((e) => ({
        ...e,
        type: "event",
        busyStart: e.start - e.walk,
        busyEnd: e.end + e.walk,
      })),
  ]
    .filter((p) => p.busyEnd > now)
    .sort((a, b) => a.busyStart - b.busyStart);
  const active = plans.find((p) => p.busyStart <= now && p.busyEnd > now);
  const next = active || plans[0];
  const until = active ? now : next ? next.busyStart : 1080;
  return { minutes: Math.max(0, until - now), until, next, plans };
}

module.exports = { weekday, clock, classesOn, feasibility, freeWindow };
