const mongoose = require("mongoose");
const env = require("../config/env");

function notFoundHandler(req, res) {
  res
    .status(404)
    .json({ error: `No API route for ${req.method} ${req.originalUrl}.` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let status = err.status || err.statusCode || 500;
  let message = err.message || "Something went wrong.";
  if (err instanceof mongoose.Error.ValidationError) {
    status = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(" ");
  } else if (err instanceof mongoose.Error.CastError) {
    status = 400;
    message = `Invalid ${err.path}.`;
  } else if (err.code === 11000) {
    status = 409;
    message = "That record already exists.";
  } else if (err.type === "entity.too.large") {
    status = 413;
    message = "That upload is too large. Keep images under 5 MB.";
  } else if (err.type === "entity.parse.failed") {
    status = 400;
    message = "The request body is not valid JSON.";
  }
  if (status >= 500) {
    if (!env.isTest) console.error(err);
    if (env.isProduction) message = "Something went wrong on our side.";
  }
  res.status(status).json({ error: message, details: err.details });
}

module.exports = { notFoundHandler, errorHandler };
