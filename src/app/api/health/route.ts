// src/app/api/health/route.ts
// Health check endpoint — tests MongoDB + Firebase connections
// GET /api/health

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET() {
  const result: {
    status: string;
    timestamp: string;
    mongodb: { connected: boolean; state: string; error?: string };
    firebase: { adminInitialized: boolean };
  } = {
    status: "ok",
    timestamp: new Date().toISOString(),
    mongodb: { connected: false, state: "disconnected" },
    firebase: { adminInitialized: false },
  };

  // ── Test MongoDB ──────────────────────────────────────────────────────────
  try {
    await connectDB();
    const state = mongoose.connection.readyState;
    // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
    const stateMap: Record<number, string> = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };
    result.mongodb = {
      connected: state === 1,
      state: stateMap[state] || "unknown",
    };
  } catch (err) {
    result.mongodb = {
      connected: false,
      state: "error",
      error: err instanceof Error ? err.message : "Unknown error",
    };
    result.status = "degraded";
  }

  // ── Test Firebase Admin ───────────────────────────────────────────────────
  try {
    const { getApps } = await import("firebase-admin/app");
    result.firebase = {
      adminInitialized: getApps().length > 0,
    };
  } catch {
    result.firebase = { adminInitialized: false };
  }

  const httpStatus = result.status === "ok" ? 200 : 503;
  return NextResponse.json(result, { status: httpStatus });
}
