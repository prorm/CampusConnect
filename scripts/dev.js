// Runs the Express API and the Vite dev server together, prefixing output.
// Usage: npm run dev (from the repository root)
const { spawn } = require("node:child_process");
const path = require("node:path");

const root = path.join(__dirname, "..");
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const services = [
  { name: "api", dir: "backend", colour: "\x1b[36m" },
  { name: "web", dir: "frontend", colour: "\x1b[35m" },
];

const children = services.map(({ name, dir, colour }) => {
  const child = spawn(npm, ["run", "dev"], {
    cwd: path.join(root, dir),
    shell: process.platform === "win32",
    env: { ...process.env, FORCE_COLOR: "1" },
  });
  const tag = `${colour}[${name}]\x1b[0m `;
  const relay = (stream, out) => {
    let buffer = "";
    stream.on("data", (chunk) => {
      buffer += chunk;
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop();
      for (const line of lines) out.write(`${tag}${line}\n`);
    });
  };
  relay(child.stdout, process.stdout);
  relay(child.stderr, process.stderr);
  child.on("exit", (code) => {
    console.log(`${tag}exited with code ${code}`);
    shutdown(code ?? 0);
  });
  return child;
});

let stopping = false;
function shutdown(code) {
  if (stopping) return;
  stopping = true;
  for (const child of children) if (!child.killed) child.kill();
  process.exitCode = code;
}
process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
