// src/lib/mongodb.ts
// MongoDB connection singleton using Mongoose
// Reuses the connection across Next.js hot-reloads in development

import mongoose from "mongoose";

// Extend the NodeJS global to cache the connection promise
declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose | null> | null;
  };
}

let cached = global._mongooseCache;

if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

export async function connectDB(): Promise<typeof mongoose | null> {
  if (cached.conn) {
    return cached.conn;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn("⚠️ MONGODB_URI is not defined. Running in mock/store fallback mode.");
    return null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: "khata_ai",
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging on Vercel
    };

    cached.promise = mongoose
      .connect(uri, opts)
      .then((mongooseInstance) => {
        console.log("✅ MongoDB connected successfully");
        return mongooseInstance;
      })
      .catch((err) => {
        console.warn("⚠️ MongoDB connection error:", err.message);
        return null;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    console.error("❌ MongoDB connection error:", err);
    return null;
  }

  return cached.conn;
}

export default connectDB;


