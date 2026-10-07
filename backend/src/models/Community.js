const mongoose = require("mongoose");
const { COLORS, ARTS } = require("./Event");

const CommunitySchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true, maxlength: 60 },
    category: { type: String, trim: true, default: "Community" },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    members: { type: Number, min: 0, default: 0 },
    tags: [{ type: String, trim: true, maxlength: 40 }],
    color: { type: String, enum: COLORS, default: "blue" },
    art: { type: String, enum: ARTS, default: "orbit" },
    status: {
      type: String,
      enum: ["active", "pending", "declined"],
      default: "active",
    },
    proposedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

CommunitySchema.methods.toClient = function toClient() {
  return {
    id: this.slug,
    name: this.name,
    category: this.category,
    description: this.description,
    members: this.members,
    tags: this.tags.length ? this.tags : [this.category],
    color: this.color,
    art: this.art,
    status: this.status,
  };
};

module.exports = mongoose.model("Community", CommunitySchema);
