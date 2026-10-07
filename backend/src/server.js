const env = require("./config/env");
const { connectDatabase, disconnectDatabase } = require("./config/db");
const { seedIfEmpty } = require("./seed/seed");
const { createApp } = require("./app");

async function start() {
  if (!env.jwtSecret || env.jwtSecret.startsWith("<")) {
    throw new Error(
      "JWT_SECRET is not set. Add a long random value to backend/.env.",
    );
  }
  await connectDatabase();
  console.log("[api] Connected to MongoDB");
  if (env.autoSeed && (await seedIfEmpty()))
    console.log("[api] Empty database: seeded the demo campus");

  const server = createApp().listen(env.port, () => {
    console.log(`[api] CampusConnect API on http://localhost:${env.port}`);
    console.log(
      `[api] AI: ${env.anthropicApiKey ? `Claude (${env.aiModel})` : "rule-based (no ANTHROPIC_API_KEY)"}`,
    );
  });

  const shutdown = () => {
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

start().catch((error) => {
  console.error(`[api] Failed to start: ${error.message}`);
  process.exit(1);
});
