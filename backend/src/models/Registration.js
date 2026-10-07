const mongoose = require("mongoose");

const RegistrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    status: {
      type: String,
      enum: ["registered", "waitlisted"],
      required: true,
    },
    // Queue position while waitlisted; null once a seat is confirmed.
    position: { type: Number, min: 1, default: null },
    attended: { type: Boolean, default: false },
  },
  { timestamps: true },
);

RegistrationSchema.index({ user: 1, event: 1 }, { unique: true });
RegistrationSchema.index({ event: 1, status: 1, position: 1 });

module.exports = mongoose.model("Registration", RegistrationSchema);
