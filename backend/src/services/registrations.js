// Seat, waitlist, and attendance transitions. Counters on Event include
// attendees registered outside the app, so waitlist positions without a
// Registration document belong to those offline attendees.
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const Activity = require("../models/Activity");
const { feasibility } = require("./schedule");
const { timetableFor } = require("./state");
const {
  badRequest,
  conflict,
  notFound,
  HttpError,
} = require("../utils/http");

async function findEvent(slug) {
  const event = await Event.findOne({ slug });
  if (!event) throw notFound("That event no longer exists.");
  return event;
}

/** Moves the queue up one place, confirming whoever was first in line. */
async function advanceQueue(event) {
  const updated = await Event.findOneAndUpdate(
    { _id: event._id, waitlist: { $gt: 0 } },
    { $inc: { waitlist: -1 } },
    { returnDocument: "after" },
  );
  if (!updated) return null;
  const promoted = await Registration.findOneAndUpdate(
    { event: event._id, status: "waitlisted", position: 1 },
    { status: "registered", position: null },
    { returnDocument: "after" },
  );
  await Registration.updateMany(
    { event: event._id, status: "waitlisted", position: { $gt: 1 } },
    { $inc: { position: -1 } },
  );
  return { promoted };
}

async function register(user, slug) {
  const event = await findEvent(slug);
  if (await Registration.exists({ user: user._id, event: event._id }))
    throw conflict("This opportunity is already in your plans.");
  const [events, mine] = await Promise.all([
    Event.find(),
    Registration.find({ user: user._id, status: "registered" }).populate(
      "event",
      "slug",
    ),
  ]);
  const fit = feasibility(
    event.toClient(),
    mine.filter((r) => r.event).map((r) => ({
      eventId: r.event.slug,
      status: r.status,
    })),
    events.map((e) => e.toClient()),
    { timetable: timetableFor(user), year: user.year },
  );
  if (!fit.ok) throw new HttpError(409, fit.reason, { fit });

  const seated = await Event.findOneAndUpdate(
    { _id: event._id, $expr: { $lt: ["$registered", "$capacity"] } },
    { $inc: { registered: 1 } },
    { returnDocument: "after" },
  );
  let registration;
  if (seated) {
    registration = { status: "registered", position: null };
  } else {
    const queued = await Event.findByIdAndUpdate(
      event._id,
      { $inc: { waitlist: 1 } },
      { returnDocument: "after" },
    );
    registration = { status: "waitlisted", position: queued.waitlist };
  }
  try {
    await Registration.create({
      user: user._id,
      event: event._id,
      ...registration,
    });
  } catch (error) {
    // Undo the counter if a concurrent request already registered this user.
    await Event.updateOne(
      { _id: event._id },
      { $inc: seated ? { registered: -1 } : { waitlist: -1 } },
    );
    throw error;
  }
  return registration.status === "registered"
    ? "Your seat is saved. Your schedule just got more interesting."
    : `You're on the waitlist at position #${registration.position}.`;
}

async function cancel(user, slug) {
  const event = await findEvent(slug);
  const registration = await Registration.findOne({
    user: user._id,
    event: event._id,
  });
  if (!registration) throw notFound("You aren't registered for this event.");
  if (registration.attended)
    throw conflict("Attendance is already verified for this event.");
  await registration.deleteOne();
  if (registration.status === "waitlisted") {
    await Event.updateOne(
      { _id: event._id, waitlist: { $gt: 0 } },
      { $inc: { waitlist: -1 } },
    );
    await Registration.updateMany(
      {
        event: event._id,
        status: "waitlisted",
        position: { $gt: registration.position },
      },
      { $inc: { position: -1 } },
    );
    return "Your waitlist spot has been cancelled.";
  }
  // A released seat passes to the front of the queue when there is one.
  if (!(await advanceQueue(event)))
    await Event.updateOne(
      { _id: event._id, registered: { $gt: 0 } },
      { $inc: { registered: -1 } },
    );
  return "Your registration has been cancelled.";
}

/** Simulates a cancellation by an attendee registered outside the app. */
async function releaseSeat(slug) {
  const event = await findEvent(slug);
  if (event.waitlist > 0) {
    const { promoted } = await advanceQueue(event);
    if (promoted) {
      await promoted.populate("user", "name");
      return `A seat opened. ${promoted.user.name} is now registered!`;
    }
    return "One seat released; the next person in the queue was promoted.";
  }
  const inApp = await Registration.countDocuments({
    event: event._id,
    status: "registered",
  });
  if (event.registered <= inApp)
    throw conflict(
      "Every remaining seat belongs to an app user. They can cancel from their own schedule.",
    );
  await Event.updateOne({ _id: event._id }, { $inc: { registered: -1 } });
  return "One seat released.";
}

async function setAttendance(slug, userId, present) {
  if (typeof present !== "boolean")
    throw badRequest("present must be true or false.");
  const event = await findEvent(slug);
  const registration = await Registration.findOne({
    event: event._id,
    user: userId,
    status: "registered",
  });
  if (!registration)
    throw notFound("That student doesn't hold a confirmed seat.");
  registration.attended = present;
  await registration.save();
  if (present) {
    await Activity.updateOne(
      { user: userId, key: event.slug },
      {
        $setOnInsert: {
          event: event._id,
          title: event.title,
          club: event.club,
          date: event.date,
          skill: event.tags[0] || event.category,
          feedback: false,
        },
      },
      { upsert: true },
    );
    return "Attendance recorded. Every experience counts.";
  }
  await Activity.deleteOne({ user: userId, key: event.slug });
  return "Check-in undone; the participation record was updated.";
}

module.exports = { register, cancel, releaseSeat, setAttendance };
