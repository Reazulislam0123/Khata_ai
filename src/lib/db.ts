// src/lib/db.ts
// ⚠️  DEPRECATED — This file is replaced by src/lib/mongodb.ts (Mongoose + MongoDB Atlas)
// Stub exports kept so old routes still compile during migration.

export { default as connectDB } from "./mongodb";
export { default } from "./mongodb";

/** @deprecated Use connectDB() from mongodb.ts instead */
export async function isDatabaseConnected(): Promise<{
  connected: boolean;
  type: string;
  dbUrlMasked?: string;
}> {
  try {
    const { default: connectDB } = await import("./mongodb");
    await connectDB();
    const uri = process.env.MONGODB_URI || "";
    return {
      connected: true,
      type: "MongoDB Atlas (Mongoose)",
      dbUrlMasked: uri.replace(/:([^:@]+)@/, ":****@"),
    };
  } catch {
    return { connected: false, type: "MongoDB Atlas (Mongoose)" };
  }
}
