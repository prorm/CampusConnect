const mongoose = require("mongoose");
const env = require("./env");

async function connectDatabase(uri = env.mongoUri) {
  if (!uri || uri.includes("<")) {
    throw new Error(
      "MONGO_URI is not set. Copy backend/.env.example to backend/.env and paste your MongoDB connection string.",
    );
  }
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  return mongoose.connection;
}

async function disconnectDatabase() {
  await mongoose.disconnect();
}

module.exports = { connectDatabase, disconnectDatabase };
