const mongoose = require("mongoose");

// A verified participation record in a student's skill passport.
const ActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // The event slug for check-ins, or a stable id for imported history.
    key: { type: String, required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    title: { type: String, required: true },
    club: { type: String, required: true },
    date: { type: String, required: true },
    skill: { type: String, required: true },
    feedback: { type: Boolean, default: false },
  },
  { timestamps: true },
);

ActivitySchema.index({ user: 1, key: 1 }, { unique: true });

ActivitySchema.methods.toClient = function toClient() {
  return {
    id: this.key,
    title: this.title,
    club: this.club,
    date: this.date,
    skill: this.skill,
    attended: true,
    feedback: this.feedback,
  };
};

module.exports = mongoose.model("Activity", ActivitySchema);
