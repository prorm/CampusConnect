import test from "node:test";
import assert from "node:assert/strict";
import {
  seedEvents,
  feasibility,
  calendarFile,
  clock,
  currentFreeWindow,
} from "./campus.js";

test("free time shrinks around confirmed registrations and walking buffers", () => {
  assert.equal(currentFreeWindow(seedEvents, []).minutes, 100);
  const booked = currentFreeWindow(seedEvents, [
    { eventId: "agent", status: "registered" },
  ]);
  assert.equal(booked.minutes, 21);
  assert.equal(booked.until, 761);
  assert.equal(booked.next.title, "Build your first AI agent");
  assert.equal(
    currentFreeWindow(seedEvents, [{ eventId: "agent", status: "waitlisted" }])
      .minutes,
    100,
  );
  assert.equal(
    currentFreeWindow(
      seedEvents,
      [{ eventId: "agent", status: "registered" }],
      770,
    ).minutes,
    0,
  );
});

test("AI workshop fits, while robotics conflicts with DBMS", () => {
  assert.equal(feasibility(seedEvents[0]).ok, true);
  assert.equal(feasibility(seedEvents[1]).ok, false);
  assert.equal(feasibility(seedEvents[1]).conflicts[0].title, "DBMS");
});
test("walking time is checked before and after the event", () => {
  const event = { ...seedEvents[0], start: 745, end: 820, walk: 8 };
  assert.equal(feasibility(event).ok, false);
  assert.equal(feasibility({ ...event, start: 748 }).ok, true);
  assert.equal(feasibility({ ...event, start: 765, end: 835 }).ok, false);
  assert.equal(feasibility({ ...event, start: 765, end: 832 }).ok, true);
});
test("existing registrations block overlaps, waitlists do not", () => {
  const registrations = [{ eventId: "agent", status: "registered" }];
  assert.equal(feasibility(seedEvents[2], registrations).ok, false);
  assert.equal(
    feasibility(seedEvents[2], [{ eventId: "agent", status: "waitlisted" }]).ok,
    true,
  );
  assert.equal(feasibility(seedEvents[0], registrations).ok, true);
});
test("eligibility and expired deadlines block registration", () => {
  assert.equal(
    feasibility({ ...seedEvents[0], years: [1, 2] }).eligible,
    false,
  );
  assert.equal(
    feasibility({ ...seedEvents[0], deadline: "2026-10-06" }).expired,
    true,
  );
  assert.equal(feasibility({ ...seedEvents[0], start: 730 }).expired, true);
});
test("calendar exports keep India timezone and escape event text", () => {
  const output = calendarFile({
    ...seedEvents[0],
    title: "AI, agents; workshop",
  });
  assert.match(output, /DTSTART;TZID=Asia\/Kolkata:20261007T124500/);
  assert.match(output, /SUMMARY:AI\\, agents\\; workshop/);
  assert.ok(output.endsWith("END:VCALENDAR\r\n"));
  assert.equal(clock(765), "12:45");
});
