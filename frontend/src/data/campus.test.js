import test from "node:test";
import assert from "node:assert/strict";
import {
  feasibility,
  calendarFile,
  clock,
  currentFreeWindow,
  classesOn,
  weekday,
} from "./campus.js";

// Wednesday classes from the seeded demo timetable (backend/src/seed/data.js).
const timetable = [
  { id: "t1", title: "Computer networks", start: 540, end: 600, days: [3] },
  { id: "t2", title: "Software engineering", start: 660, end: 740, days: [3] },
  { id: "t3", title: "DBMS", start: 840, end: 900, days: [3] },
  { id: "t4", title: "DBMS lab", start: 900, end: 1020, days: [3] },
  { id: "t5", title: "Operating systems", start: 540, end: 600, days: [1] },
];
const profile = { timetable, year: 3 };
const base = {
  date: "2026-10-07",
  deadline: "2026-10-07",
  years: [1, 2, 3, 4],
  tags: ["AI / ML"],
};
const agent = { ...base, id: "agent", title: "Build your first AI agent", start: 765, end: 820, walk: 4 };
const robot = { ...base, id: "robot", title: "Robotics", start: 825, end: 915, walk: 8, years: [2, 3, 4] };
const resume = { ...base, id: "resume", title: "Resume clinic", start: 750, end: 780, walk: 6 };
const events = [agent, robot, resume];
const fit = (event, registrations = []) =>
  feasibility(event, registrations, events, profile);

test("timetables repeat by weekday", () => {
  assert.equal(weekday("2026-10-07"), 3);
  assert.deepEqual(
    classesOn(timetable, "2026-10-14").map((c) => c.title),
    ["Computer networks", "Software engineering", "DBMS", "DBMS lab"],
  );
  assert.equal(classesOn(timetable, "2026-10-10").length, 0);
});

test("free time shrinks around confirmed registrations and walking buffers", () => {
  assert.equal(currentFreeWindow(events, [], timetable).minutes, 100);
  const booked = currentFreeWindow(
    events,
    [{ eventId: "agent", status: "registered" }],
    timetable,
  );
  assert.equal(booked.minutes, 21);
  assert.equal(booked.until, 761);
  assert.equal(booked.next.title, "Build your first AI agent");
  assert.equal(
    currentFreeWindow(events, [{ eventId: "agent", status: "waitlisted" }], timetable)
      .minutes,
    100,
  );
  assert.equal(
    currentFreeWindow(events, [{ eventId: "agent", status: "registered" }], timetable, 770)
      .minutes,
    0,
  );
});

test("AI workshop fits, while robotics conflicts with DBMS", () => {
  assert.equal(fit(agent).ok, true);
  assert.equal(fit(robot).ok, false);
  assert.equal(fit(robot).conflicts[0].title, "DBMS");
});

test("walking time is checked before and after the event", () => {
  const event = { ...agent, start: 745, end: 820, walk: 8 };
  assert.equal(fit(event).ok, false);
  assert.equal(fit({ ...event, start: 748 }).ok, true);
  assert.equal(fit({ ...event, start: 765, end: 835 }).ok, false);
  assert.equal(fit({ ...event, start: 765, end: 832 }).ok, true);
});

test("existing registrations block overlaps, waitlists do not", () => {
  const registrations = [{ eventId: "agent", status: "registered" }];
  assert.equal(fit(resume, registrations).ok, false);
  assert.equal(fit(resume, [{ eventId: "agent", status: "waitlisted" }]).ok, true);
  assert.equal(fit(agent, registrations).ok, true);
});

test("eligibility and expired deadlines block registration", () => {
  assert.equal(fit({ ...agent, years: [1, 2] }).eligible, false);
  assert.equal(fit({ ...agent, deadline: "2026-10-06" }).expired, true);
  assert.equal(fit({ ...agent, start: 730 }).expired, true);
});

test("calendar exports keep India timezone and escape event text", () => {
  const output = calendarFile({
    ...agent,
    venue: "Innovation Lab",
    title: "AI, agents; workshop",
  });
  assert.match(output, /DTSTART;TZID=Asia\/Kolkata:20261007T124500/);
  assert.match(output, /SUMMARY:AI\\, agents\\; workshop/);
  assert.ok(output.endsWith("END:VCALENDAR\r\n"));
  assert.equal(clock(765), "12:45");
});
