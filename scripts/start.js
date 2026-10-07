// Production mode: the API serves the built React app from one origin.
// Run `npm run build` first. Usage: npm start (from the repository root)
const fs = require("node:fs");
const path = require("node:path");

const dist = path.join(__dirname, "..", "frontend", "dist", "index.html");
if (!fs.existsSync(dist)) {
  console.error("frontend/dist is missing. Run `npm run build` first.");
  process.exit(1);
}
process.env.NODE_ENV = "production";
require("../backend/src/server.js");
