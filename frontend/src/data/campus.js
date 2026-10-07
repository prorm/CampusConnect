// Scheduling helpers shared by every screen. They mirror the API's rules in
// backend/src/services/schedule.js so the UI can explain a fit before the
// server confirms it. Times are minutes since midnight in campus time.
export const DEMO_DATE = "2026-10-07";
export const DEMO_NOW = 740;
export const SKILLS = [
  "AI / ML",
  "Web development",
  "Hackathons",
  "Robotics",
  "Design",
  "Leadership",
  "Career",
  "Music",
  "Culture",
];
export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function weekday(date) {
  return new Date(`${date}T12:00:00Z`).getUTCDay();
}

/** Classes that meet on a calendar date, expanded with that date. */
export function classesOn(timetable = [], date) {
  const day = weekday(date);
  return timetable
    .filter((c) => c.days.includes(day))
    .map((c) => ({ ...c, date }));
}

const overlaps = (event, start, end) =>
  event.start - event.walk < end && event.end + event.walk > start;

export function feasibility(event, registrations, events, profile) {
  const conflicts = classesOn(profile.timetable, event.date).filter((c) =>
    overlaps(event, c.start, c.end),
  );
  const clashes = registrations
    .filter((r) => r.status === "registered" && r.eventId !== event.id)
    .map((r) => events.find((e) => e.id === r.eventId))
    .filter(
      (e) => e && e.date === event.date && overlaps(event, e.start, e.end),
    );
  const eligible = event.years.includes(profile.year);
  const expired =
    event.deadline < DEMO_DATE ||
    event.date < DEMO_DATE ||
    (event.date === DEMO_DATE && event.start < DEMO_NOW);
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

// The current break stops before a confirmed plan's walking buffer begins.
export function currentFreeWindow(
  events,
  registrations,
  timetable,
  now = DEMO_NOW,
) {
  const plans = [
    ...classesOn(timetable, DEMO_DATE).map((c) => ({
      ...c,
      type: "class",
      busyStart: c.start,
      busyEnd: c.end,
    })),
    ...registrations
      .filter((r) => r.status === "registered")
      .map((r) => events.find((e) => e.id === r.eventId))
      .filter((e) => e && e.date === DEMO_DATE)
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

/** Feasibility of an event for the signed-in user. */
export const fitFor = (state, event) =>
  feasibility(event, state.registrations, state.events, {
    timetable: state.timetable,
    year: state.user.year,
  });

export const freeFor = (state) =>
  currentFreeWindow(state.events, state.registrations, state.timetable);

export function recommendationReasons(event, state) {
  const fit = fitFor(state, event);
  return [
    event.tags.some((t) => state.user.interests.includes(t))
      ? "Matches your interests"
      : "Explore something new",
    fit.ok ? "Fits your timetable" : "Timetable conflict to review",
    `${event.walk} min walk from your next block`,
    event.friends
      ? `${event.friends} peers attending`
      : "Be one of the first to join",
  ];
}

export function clock(minutes) {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

export function toMinutes(value) {
  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
}

export function dateLabel(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export function downloadFile(name, content, type = "text/plain") {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function calendarFile(event) {
  const stamp = (m) =>
    `${event.date.replaceAll("-", "")}T${clock(m).replace(":", "")}00`;
  const escape = (s) =>
    s
      .replaceAll("\\", "\\\\")
      .replaceAll("\n", "\\n")
      .replaceAll(",", "\\,")
      .replaceAll(";", "\\;");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CampusConnect//Campus Planner//EN",
    "BEGIN:VEVENT",
    `UID:${event.id}@campusconnect.app`,
    "DTSTAMP:20261007T065000Z",
    `DTSTART;TZID=Asia/Kolkata:${stamp(event.start)}`,
    `DTEND;TZID=Asia/Kolkata:${stamp(event.end)}`,
    `SUMMARY:${escape(event.title)}`,
    `LOCATION:${escape(event.venue)}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}
