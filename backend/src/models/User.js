const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ClassSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 80 },
    start: { type: Number, required: true, min: 0, max: 1439 },
    end: { type: Number, required: true, min: 1, max: 1440 },
    venue: { type: String, trim: true, maxlength: 80, default: "" },
    // 0 = Sunday … 6 = Saturday, matching Date#getDay().
    days: { type: [Number], required: true },
  },
  { _id: true },
);

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address."],
    },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["student", "coordinator", "admin"],
      default: "student",
    },
    usn: { type: String, trim: true, uppercase: true, maxlength: 20 },
    department: { type: String, trim: true, default: "Computer Science" },
    year: { type: Number, min: 1, max: 4, default: 1 },
    title: { type: String, trim: true, maxlength: 80 },
    interests: [{ type: String, trim: true, maxlength: 40 }],
    timetable: [ClassSchema],
    joined: [{ type: mongoose.Schema.Types.ObjectId, ref: "Community" }],
  },
  { timestamps: true },
);

UserSchema.methods.setPassword = async function setPassword(password) {
  this.passwordHash = await bcrypt.hash(password, 10);
};

UserSchema.methods.checkPassword = function checkPassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

UserSchema.methods.toProfile = function toProfile() {
  // First and last name, skipping honorifics such as "Dr." and "Prof."
  const parts = this.name
    .split(/\s+/)
    .filter((part) => part && !/^(dr|prof|mr|mrs|ms)\.?$/i.test(part));
  const initials = [parts[0], parts.length > 1 ? parts.at(-1) : ""]
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .join("");
  return {
    id: String(this._id),
    name: this.name,
    firstName: parts[0] || this.name,
    initials,
    email: this.email,
    role: this.role,
    usn: this.usn || "",
    department: this.department,
    year: this.year,
    title:
      this.title ||
      (this.role === "student"
        ? `${this.department} · Year ${this.year}`
        : this.role === "coordinator"
          ? "Event coordinator"
          : "Campus administrator"),
    interests: this.interests,
  };
};

module.exports = mongoose.model("User", UserSchema);
