const path = require("node:path");
require("dotenv").config({
  path: path.join(__dirname, "..", "..", ".env"),
  quiet: true,
});

const isTest = process.env.NODE_ENV === "test";

function parseClock(value) {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value || "");
  return match ? Number(match[1]) * 60 + Number(match[2]) : 740;
}

const env = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: isTest
    ? process.env.MONGO_URI_TEST ||
      "mongodb://127.0.0.1:27017/campusconnect_test"
    : process.env.MONGO_URI || "mongodb://127.0.0.1:27017/campusconnect",
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientUrl: (process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean),
  // Optional. When empty, the assistant, poster reader, and feedback summaries
  // use the built-in rule-based engine instead of Groq.
  groqApiKey: (process.env.GROQ_API_KEY || "").trim().startsWith("<")
    ? ""
    : (process.env.GROQ_API_KEY || "").trim(),
  groqModel: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
  groqVisionModel:
    process.env.GROQ_VISION_MODEL || "meta-llama/llama-4-scout-17b-16e-instruct",
  // The campus clock is fixed so presentations are repeatable.
  demoDate: /^\d{4}-\d{2}-\d{2}$/.test(process.env.DEMO_DATE || "")
    ? process.env.DEMO_DATE
    : "2026-10-07",
  demoNow: parseClock(process.env.DEMO_TIME || "12:20"),
  demoAccounts: process.env.DEMO_ACCOUNTS !== "false",
  autoSeed: process.env.AUTO_SEED !== "false",
  isTest,
  isProduction: process.env.NODE_ENV === "production",
};

if (isTest && !env.jwtSecret) env.jwtSecret = "test-secret";

module.exports = env;
