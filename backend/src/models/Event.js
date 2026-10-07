const mongoose = require("mongoose");

const COLORS = ["mint", "violet", "peach", "blue", "pink"];
const ARTS = ["orbit", "cube", "steps", "wave"];

const EventSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    club: { type: String, required: true, trim: true, maxlength: 60 },
    category: { type: String, required: true, trim: true, maxlength: 40 },
    description: { type: String, required: true, trim: true, maxlength: 1000 },
    // Calendar date in campus time (YYYY-MM-DD) and minutes since midnight.
    date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    start: { type: Number, required: true, min: 0, max: 1439 },
    end: { type: Number, required: true, min: 1, max: 1440 },
    deadline: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    venue: { type: String, required: true, trim: true, maxlength: 100 },
    walk: { type: Number, min: 0, max: 60, default: 5 },
    capacity: { type: Number, required: true, min: 1, max: 5000 },
    // Seat and queue counters include attendees registered outside the app.
    registered: { type: Number, min: 0, default: 0 },
    waitlist: { type: Number, min: 0, default: 0 },
    years: { type: [Number], default: [1, 2, 3, 4] },
    tags: [{ type: String, trim: true, maxlength: 40 }],
    score: { type: Number, min: 0, max: 100, default: 80 },
    friends: { type: Number, min: 0, default: 0 },
    color: { type: String, enum: COLORS, default: "mint" },
    art: { type: String, enum: ARTS, default: "orbit" },
    source: {
      type: String,
      enum: ["seed", "organizer", "poster"],
      default: "organizer",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

EventSchema.pre("validate", function checkTimes() {
  if (this.end <= this.start)
    this.invalidate("end", "The end time must be after the start time.");
  if (this.deadline > this.date)
    this.invalidate(
      "deadline",
      "The registration deadline must be on or before the event date.",
    );
  if (!this.years.length || this.years.some((y) => ![1, 2, 3, 4].includes(y)))
    this.invalidate("years", "Choose at least one year from 1 to 4.");
});

EventSchema.methods.toClient = function toClient() {
  return {
    id: this.slug,
    title: this.title,
    club: this.club,
    category: this.category,
    description: this.description,
    date: this.date,
    start: this.start,
    end: this.end,
    deadline: this.deadline,
    venue: this.venue,
    walk: this.walk,
    capacity: this.capacity,
    registered: this.registered,
    waitlist: this.waitlist,
    years: this.years,
    tags: this.tags,
    score: this.score,
    friends: this.friends,
    color: this.color,
    art: this.art,
    source: this.source,
  };
};

module.exports = mongoose.model("Event", EventSchema);
module.exports.COLORS = COLORS;
module.exports.ARTS = ARTS;
