import mongoose from "mongoose";

// ── Connection pool settings ──────────────────────────────────────────────────
// Tuned for MongoDB Atlas M0/M2 (free/shared tier) + Vercel serverless
const MONGO_OPTIONS = {
  maxPoolSize: 10,        // Max concurrent connections per serverless instance
  minPoolSize: 1,         // Keep at least 1 warm connection alive
  serverSelectionTimeoutMS: 5000,  // Fail fast if Atlas unreachable
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  bufferCommands: false,  // Fail immediately rather than buffering when disconnected
};

// ── Global singleton cache (survives hot-reload in dev) ───────────────────────
// Stored on `global` so Next.js hot-reload doesn't create new connections
let cached = global._mongoose;
if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

export default async function connectToDatabase() {
  // Already connected — return immediately (fastest path)
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL environment variable is not set");
  }

  // A connection attempt is already in progress — await it (prevents thundering herd)
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URL, MONGO_OPTIONS)
      .then((mongoose) => {
        console.log("✅ MongoDB connected");
        return mongoose;
      })
      .catch((err) => {
        // Reset on failure so the next call retries
        cached.promise = null;
        console.error("❌ MongoDB connection error:", err);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

