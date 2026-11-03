const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    activityKey: { type: String, required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    title: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true, trim: true, maxlength: 1000 },
    sentiment: {
      type: String,
      enum: ["positive", "neutral", "constructive"],
      default: "neutral",
    },
  },
  { timestamps: true },
);

FeedbackSchema.index({ user: 1, activityKey: 1 }, { unique: true });

module.exports = mongoose.model("Feedback", FeedbackSchema);
