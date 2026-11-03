const crypto = require("node:crypto");
const express = require("express");
const Community = require("../models/Community");
const User = require("../models/User");
const { requireAuth, requireRole } = require("../middleware/auth");
const { buildState } = require("../services/state");
const { text, notFound, conflict, badRequest } = require("../utils/http");

const router = express.Router();
router.use(requireAuth);

async function activeCommunity(slug) {
  const community = await Community.findOne({ slug, status: "active" });
  if (!community) throw notFound("That community isn't open yet.");
  return community;
}

router.get("/", async (req, res) => {
  const communities = await Community.find({ status: "active" }).sort({
    createdAt: 1,
  });
  res.json({ communities: communities.map((c) => c.toClient()) });
});

router.post("/:slug/membership", async (req, res) => {
  const community = await activeCommunity(req.params.slug);
  const result = await User.updateOne(
    { _id: req.user._id, joined: { $ne: community._id } },
    { $push: { joined: community._id } },
  );
  if (!result.modifiedCount) throw conflict("You're already a member.");
  await Community.updateOne({ _id: community._id }, { $inc: { members: 1 } });
  req.user.joined.push(community._id);
  res.status(201).json({
    message: "Welcome to your people.",
    state: await buildState(req.user),
  });
});

router.delete("/:slug/membership", async (req, res) => {
  const community = await activeCommunity(req.params.slug);
  const result = await User.updateOne(
    { _id: req.user._id, joined: community._id },
    { $pull: { joined: community._id } },
  );
  if (!result.modifiedCount) throw conflict("You aren't a member.");
  await Community.updateOne(
    { _id: community._id, members: { $gt: 0 } },
    { $inc: { members: -1 } },
  );
  req.user.joined = req.user.joined.filter(
    (id) => String(id) !== String(community._id),
  );
  res.json({
    message: "You've left this community.",
    state: await buildState(req.user),
  });
});

router.post("/", async (req, res) => {
  const name = text(req.body.name, { field: "Name", max: 60 });
  if (
    await Community.exists({
      name: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i"),
      status: { $ne: "declined" },
    })
  )
    throw conflict("A community with that name already exists.");
  await Community.create({
    slug: `community-${crypto.randomBytes(4).toString("hex")}`,
    name,
    description: text(req.body.description, { field: "Description", max: 500 }),
    status: "pending",
    proposedBy: req.user._id,
  });
  res.status(201).json({
    message: "Your proposal is ready for review by campus administration.",
    state: await buildState(req.user),
  });
});

router.patch("/:slug/decision", requireRole("admin"), async (req, res) => {
  if (typeof req.body.approved !== "boolean")
    throw badRequest("approved must be true or false.");
  const community = await Community.findOne({
    slug: req.params.slug,
    status: "pending",
  });
  if (!community) throw notFound("That proposal was already decided.");
  community.status = req.body.approved ? "active" : "declined";
  await community.save();
  res.json({
    message: req.body.approved
      ? "A new community is now open to campus."
      : "Community proposal declined.",
    state: await buildState(req.user),
  });
});

module.exports = router;
