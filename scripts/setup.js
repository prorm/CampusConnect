// Installs both apps and creates backend/.env (with a fresh JWT secret) if it is missing.
// Usage: npm run setup (from the repository root)
const { spawnSync } = require("node:child_process");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const npm = process.platform === "win32" ? "npm.cmd" : "npm";

for (const dir of ["backend", "frontend"]) {
  console.log(`\n> Installing ${dir} dependencies`);
  const result = spawnSync(npm, ["install"], {
    cwd: path.join(root, dir),
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const example = path.join(root, "backend", ".env.example");
const target = path.join(root, "backend", ".env");
if (fs.existsSync(target)) {
  console.log("\nbackend/.env already exists, leaving it untouched.");
} else {
  const secret = crypto.randomBytes(48).toString("hex");
  const content = fs
    .readFileSync(example, "utf8")
    .replace("<a-long-random-secret>", secret);
  fs.writeFileSync(target, content);
  console.log("\nCreated backend/.env with a generated JWT_SECRET.");
}
console.log(
  "\nNext: open backend/.env and set MONGO_URI (and GROQ_API_KEY for AI), then run: npm run dev",
);
