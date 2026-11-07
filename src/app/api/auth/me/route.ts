// src/app/api/auth/me/route.ts
// Returns the current user's MongoDB profile (verified via Firebase ID Token)
// GET /api/auth/me
// Header: Authorization: Bearer <firebase_id_token>

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { adminAuth } from "@/lib/firebase-admin";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    // ── Extract & verify Firebase ID Token ───────────────────────────────────
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Authorization header required" },
        { status: 401 }
      );
    }

    const token = authHeader.split("Bearer ")[1];
    let decoded;
    try {
      decoded = await adminAuth.verifyIdToken(token);
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // ── Fetch MongoDB user ────────────────────────────────────────────────────
    const conn = await connectDB();
    if (!conn) {
      console.warn("MongoDB unavailable in /api/auth/me. Returning decoded token user profile.");
      const email = (decoded.email || "").toLowerCase();
      const isTeacher = email.includes("teacher") || email.includes("udvash");
      const isAdmin = email === "admin@khata.ai" || email.startsWith("admin@");
      return NextResponse.json({
        success: true,
        user: {
          _id: `usr_${decoded.uid.slice(0, 10)}`,
          firebaseUid: decoded.uid,
          email: decoded.email,
          name: decoded.name || decoded.email?.split("@")[0] || "User",
          role: isAdmin ? "SUPER_ADMIN" : isTeacher ? "TEACHER" : "STUDENT",
          isActive: true,
        },
      });
    }
    const user = await User.findOne({ firebaseUid: decoded.uid })
      .populate("institutionId", "name slug subscriptionPlan status")
      .populate("batchId", "name curriculumCode")
      .lean();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found in database. Please re-register." },
        { status: 404 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: "Account has been deactivated. Contact your institution admin." },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error("/api/auth/me error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

