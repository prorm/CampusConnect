const jwt = require("jsonwebtoken");
const env = require("../config/env");
const User = require("../models/User");
const { unauthorized, forbidden } = require("../utils/http");

function signToken(user) {
  return jwt.sign({ sub: String(user._id), role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

async function requireAuth(req, res, next) {
  const header = req.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) throw unauthorized();
  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch {
    throw unauthorized("Your session has expired. Please sign in again.");
  }
  const user = await User.findById(payload.sub);
  if (!user) throw unauthorized("This account no longer exists.");
  req.user = user;
  next();
}

const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      throw forbidden(`Only ${roles.join(" or ")} accounts can do that.`);
    next();
  };

module.exports = { signToken, requireAuth, requireRole };
