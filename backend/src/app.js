const path = require("node:path");
const fs = require("node:fs");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");
const env = require("./config/env");
const { aiStatus } = require("./services/ai");
const { notFoundHandler, errorHandler } = require("./middleware/error");

function createApp() {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(
    cors({
      origin(origin, callback) {
        // Same-origin requests and tools like curl send no Origin header.
        if (!origin || env.clientUrl.includes(origin)) return callback(null, true);
        callback(null, false);
      },
    }),
  );
  // Poster images arrive base64-encoded, roughly 4/3 of their file size.
  app.use(express.json({ limit: "8mb" }));
  if (!env.isTest) app.use(morgan(env.isProduction ? "combined" : "dev"));

  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      database:
        mongoose.connection.readyState === 1 ? "connected" : "disconnected",
      ai: aiStatus(),
      clock: { date: env.demoDate, now: env.demoNow },
    });
  });

  app.use("/api/auth", require("./routes/auth"));
  app.use("/api/me", require("./routes/me"));
  app.use("/api/events", require("./routes/events"));
  app.use("/api/communities", require("./routes/communities"));
  app.use("/api/admin", require("./routes/admin"));
  app.use("/api/ai", require("./routes/ai"));
  app.use("/api", notFoundHandler);

  // In production, serve the built React app from the same origin.
  const dist = path.join(__dirname, "..", "..", "frontend", "dist");
  if (env.isProduction && fs.existsSync(dist)) {
    app.use(express.static(dist, { maxAge: "1h", index: false }));
    app.get(/^(?!\/api\/).*/, (req, res) =>
      res.sendFile(path.join(dist, "index.html")),
    );
  }

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
