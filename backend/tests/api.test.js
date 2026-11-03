process.env.NODE_ENV = "test";
process.env.GROQ_API_KEY = "";

const { test, before, after, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const mongoose = require("mongoose");
const { connectDatabase, disconnectDatabase } = require("../src/config/db");
const { seedDatabase } = require("../src/seed/seed");
const { createApp } = require("../src/app");

const app = createApp();
const api = () => request(app);

async function signIn(email) {
  const res = await api().post("/api/auth/demo").send({ email });
  assert.equal(res.status, 200, res.body.error);
  return { token: res.body.token, state: res.body.state };
}
const auth = (token) => ({ Authorization: `Bearer ${token}` });
const PRANAV = "pranav@campusconnect.edu";
const RAJESH = "rajesh@campusconnect.edu";
const ANANYA = "ananya@campusconnect.edu";

before(async () => {
  await connectDatabase();
  assert.match(mongoose.connection.name, /_test$/);
});
beforeEach(seedDatabase);
after(async () => {
  await mongoose.connection.dropDatabase();
  await disconnectDatabase();
});

test("health reports the database and rule-based AI", async () => {
  const res = await api().get("/api/health");
  assert.equal(res.body.database, "connected");
  assert.equal(res.body.ai.enabled, false);
});

test("protected routes require a valid token", async () => {
  assert.equal((await api().get("/api/me/state")).status, 401);
  const bad = await api().get("/api/me/state").set(auth("nope"));
  assert.equal(bad.status, 401);
});

test("students sign up, sign in, and never pick their own role", async () => {
  const created = await api().post("/api/auth/register").send({
    name: "Asha Rao",
    email: "Asha@Example.com",
    password: "longenough",
    year: 2,
    role: "admin",
    interests: ["Design", "Design", "Music"],
  });
  assert.equal(created.status, 201, created.body.error);
  assert.equal(created.body.state.user.role, "student");
  assert.deepEqual(created.body.state.user.interests, ["Design", "Music"]);
  assert.ok(created.body.state.timetable.length > 0);

  const login = await api()
    .post("/api/auth/login")
    .send({ email: "asha@example.com", password: "longenough" });
  assert.equal(login.status, 200);
  const wrong = await api()
    .post("/api/auth/login")
    .send({ email: "asha@example.com", password: "incorrect" });
  assert.equal(wrong.status, 401);
  const duplicate = await api().post("/api/auth/register").send({
    name: "Asha",
    email: "asha@example.com",
    password: "longenough",
  });
  assert.equal(duplicate.status, 409);
});

test("state is role-aware", async () => {
  const student = await signIn(PRANAV);
  assert.equal(student.state.user.firstName, "Pranav");
  assert.deepEqual(student.state.rosters, {});
  assert.deepEqual(student.state.joined.sort(), ["code", "mind"]);
  assert.equal(student.state.activities.length, 3);
  assert.equal(student.state.proposals.length, 0);

  const coordinator = await signIn(RAJESH);
  assert.deepEqual(
    coordinator.state.rosters.agent.map((p) => p.name).sort(),
    ["Prajwal N", "Sinchana Jeppu"],
  );
  const admin = await signIn(ANANYA);
  assert.equal(admin.state.proposals[0].name, "Shutter Society");
});

test("registration enforces the timetable, then saves a seat", async () => {
  const { token } = await signIn(PRANAV);
  const clash = await api().post("/api/events/robot/registration").set(auth(token));
  assert.equal(clash.status, 409);
  assert.match(clash.body.error, /DBMS/);

  const ok = await api().post("/api/events/agent/registration").set(auth(token));
  assert.equal(ok.status, 201, ok.body.error);
  const agent = ok.body.state.events.find((e) => e.id === "agent");
  assert.equal(agent.registered, 90);
  assert.deepEqual(ok.body.state.registrations, [
    { eventId: "agent", status: "registered", position: null, attended: false },
  ]);

  // The resume clinic overlaps the confirmed workshop's walking buffer.
  const overlap = await api().post("/api/events/resume/registration").set(auth(token));
  assert.equal(overlap.status, 409);
  assert.match(overlap.body.error, /Build your first AI agent/);

  const again = await api().post("/api/events/agent/registration").set(auth(token));
  assert.equal(again.status, 409);

  const cancelled = await api().delete("/api/events/agent/registration").set(auth(token));
  assert.equal(cancelled.status, 200);
  assert.equal(cancelled.body.state.events.find((e) => e.id === "agent").registered, 89);
});

test("waitlist promotion keeps queue order across releases", async () => {
  const student = await signIn(PRANAV);
  const joined = await api().post("/api/events/hack/registration").set(auth(student.token));
  assert.equal(joined.status, 201);
  assert.match(joined.body.message, /position #7/);

  const coordinator = await signIn(RAJESH);
  let res;
  for (let i = 0; i < 6; i++) {
    res = await api().post("/api/events/hack/release").set(auth(coordinator.token));
    assert.equal(res.status, 200, res.body.error);
  }
  const queued = res.body.state.rosters.hack.find((p) => p.name === "Pranav R Mane");
  assert.equal(queued.position, 1);
  res = await api().post("/api/events/hack/release").set(auth(coordinator.token));
  assert.match(res.body.message, /Pranav R Mane is now registered/);

  const after = await api().get("/api/me/state").set(auth(student.token));
  assert.deepEqual(after.body.registrations[0], {
    eventId: "hack",
    status: "registered",
    position: null,
    attended: false,
  });
  const hack = after.body.events.find((e) => e.id === "hack");
  assert.equal(hack.waitlist, 0);
  assert.equal(hack.registered, 120);
});

test("cancelling a waitlist spot moves later people forward", async () => {
  const pranav = await signIn(PRANAV);
  const prajwal = await signIn("prajwal@campusconnect.edu");
  await api().post("/api/events/hack/registration").set(auth(pranav.token));
  await api().post("/api/events/hack/registration").set(auth(prajwal.token));
  await api().delete("/api/events/hack/registration").set(auth(pranav.token));
  const state = await api().get("/api/me/state").set(auth(prajwal.token));
  assert.equal(state.body.registrations.find((r) => r.eventId === "hack").position, 7);
  assert.equal(state.body.events.find((e) => e.id === "hack").waitlist, 7);
});

test("attendance writes the passport; feedback is accepted once", async () => {
  const student = await signIn(PRANAV);
  await api().post("/api/events/agent/registration").set(auth(student.token));
  const coordinator = await signIn(RAJESH);
  const userId = student.state.user.id;

  const denied = await api()
    .put(`/api/events/agent/attendance/${userId}`)
    .set(auth(student.token))
    .send({ present: true });
  assert.equal(denied.status, 403);

  const marked = await api()
    .put(`/api/events/agent/attendance/${userId}`)
    .set(auth(coordinator.token))
    .send({ present: true });
  assert.equal(marked.status, 200, marked.body.error);

  let state = (await api().get("/api/me/state").set(auth(student.token))).body;
  const activity = state.activities.find((a) => a.id === "agent");
  assert.equal(activity.skill, "AI / ML");
  assert.equal(state.registrations[0].attended, true);
  assert.equal(
    (await api().delete("/api/events/agent/registration").set(auth(student.token))).status,
    409,
  );

  const feedback = await api()
    .post("/api/me/activities/agent/feedback")
    .set(auth(student.token))
    .send({ rating: 5, comment: "Built a working agent in an hour." });
  assert.equal(feedback.status, 201, feedback.body.error);
  const twice = await api()
    .post("/api/me/activities/agent/feedback")
    .set(auth(student.token))
    .send({ rating: 4, comment: "Again" });
  assert.equal(twice.status, 409);

  const summary = await api()
    .get("/api/ai/feedback-summary?event=agent")
    .set(auth(coordinator.token));
  assert.equal(summary.body.source, "rules");
  assert.match(summary.body.summary, /1 reflection averaging 5.0\/5/);
});

test("timetable edits change fit checks", async () => {
  const { token, state } = await signIn(PRANAV);
  for (const title of ["DBMS", "DBMS lab"]) {
    const entry = state.timetable.find((c) => c.title === title && c.days.includes(3));
    await api().delete(`/api/me/timetable/${entry.id}`).set(auth(token));
  }
  const ok = await api().post("/api/events/robot/registration").set(auth(token));
  assert.equal(ok.status, 201, ok.body.error);

  const added = await api()
    .post("/api/me/timetable")
    .set(auth(token))
    .send({ title: "Seminar", start: "18:00", end: "19:00", days: [3] });
  assert.equal(added.status, 201);
  const music = await api().post("/api/events/music/registration").set(auth(token));
  assert.equal(music.status, 409);
  assert.match(music.body.error, /Seminar/);
});

test("communities: join, leave, propose, and admin approval", async () => {
  const student = await signIn(PRANAV);
  const join = await api().post("/api/communities/dhvani/membership").set(auth(student.token));
  assert.equal(join.status, 201);
  assert.ok(join.body.state.joined.includes("dhvani"));
  assert.equal(join.body.state.communities.find((c) => c.id === "dhvani").members, 176);
  const leave = await api().delete("/api/communities/dhvani/membership").set(auth(student.token));
  assert.equal(leave.body.state.communities.find((c) => c.id === "dhvani").members, 175);

  const proposed = await api()
    .post("/api/communities")
    .set(auth(student.token))
    .send({ name: "Chess Club", description: "Quick games between classes." });
  assert.equal(proposed.status, 201);
  const slug = proposed.body.state.proposals[0].id;

  const forbidden = await api()
    .patch(`/api/communities/${slug}/decision`)
    .set(auth(student.token))
    .send({ approved: true });
  assert.equal(forbidden.status, 403);

  const admin = await signIn(ANANYA);
  const approved = await api()
    .patch(`/api/communities/${slug}/decision`)
    .set(auth(admin.token))
    .send({ approved: true });
  assert.ok(approved.body.state.communities.some((c) => c.name === "Chess Club"));
});

test("staff and students can publish events with validation", async () => {
  const coordinator = await signIn(RAJESH);
  const base = {
    title: "Intro to Rust",
    club: "CodeCraft",
    category: "Technology",
    description: "Ownership without tears.",
    venue: "Lab 3",
    date: "2026-10-12",
    deadline: "2026-10-11",
    start: 840,
    end: 900,
    capacity: 40,
  };
  const created = await api().post("/api/events").set(auth(coordinator.token)).send(base);
  assert.equal(created.status, 201, created.body.error);
  const event = created.body.state.events.find((e) => e.title === "Intro to Rust");
  assert.equal(event.source, "organizer");

  const invalid = await api()
    .post("/api/events")
    .set(auth(coordinator.token))
    .send({ ...base, end: 800 });
  assert.equal(invalid.status, 400);

  const student = await signIn(PRANAV);
  const poster = await api()
    .post("/api/events")
    .set(auth(student.token))
    .send({ ...base, title: "Poster event" });
  assert.equal(
    poster.body.state.events.find((e) => e.title === "Poster event").source,
    "poster",
  );
  assert.equal(
    (await api().delete(`/api/events/${event.id}`).set(auth(student.token))).status,
    403,
  );
});

test("poster text parsing and the rule-based assistant", async () => {
  const { token } = await signIn(PRANAV);
  const parsed = await api()
    .post("/api/ai/poster")
    .set(auth(token))
    .send({
      text: "Event: GenAI Hackathon\nClub: CodeCraft\nDate: 2026-10-12\nStart: 14:00\nEnd: 17:00\nVenue: Seminar Hall 2\nYears: 1, 2, 3\nTags: AI / ML, Hackathons",
    });
  assert.equal(parsed.status, 200, parsed.body.error);
  assert.equal(parsed.body.draft.start, 840);
  assert.deepEqual(parsed.body.draft.years, [1, 2, 3]);

  const missing = await api()
    .post("/api/ai/poster")
    .set(auth(token))
    .send({ text: "Event: Something" });
  assert.equal(missing.status, 422);

  const image = await api()
    .post("/api/ai/poster")
    .set(auth(token))
    .send({ image: { data: "aGVsbG8=", mediaType: "image/png" } });
  assert.equal(image.status, 422);
  assert.match(image.body.error, /GROQ_API_KEY/);

  const reply = await api()
    .post("/api/ai/assistant")
    .set(auth(token))
    .send({ message: "What can I do during my break?" });
  assert.equal(reply.body.source, "rules");
  assert.equal(reply.body.eventId, "agent");
});

test("demo reset restores the seeded campus and re-issues the session", async () => {
  const { token } = await signIn(PRANAV);
  await api().post("/api/events/agent/registration").set(auth(token));
  const reset = await api().post("/api/admin/reset").set(auth(token));
  assert.equal(reset.status, 200, reset.body.error);
  assert.deepEqual(reset.body.state.registrations, []);
  const fresh = await api().get("/api/me/state").set(auth(reset.body.token));
  assert.equal(fresh.status, 200);
});

test("analytics and announcements are restricted to staff", async () => {
  const student = await signIn(PRANAV);
  assert.equal((await api().get("/api/admin/analytics").set(auth(student.token))).status, 403);
  const admin = await signIn(ANANYA);
  const analytics = await api().get("/api/admin/analytics").set(auth(admin.token));
  assert.equal(analytics.body.totals.events, 6);
  assert.equal(analytics.body.totals.students, 3);
  assert.equal(analytics.body.feedback.count, 5);

  const note = await api()
    .put("/api/admin/announcement")
    .set(auth(admin.token))
    .send({ text: "Library open late this week." });
  assert.equal(note.body.state.announcement, "Library open late this week.");
  assert.equal(
    (await api().put("/api/admin/announcement").set(auth(student.token)).send({ text: "x" })).status,
    403,
  );
});
