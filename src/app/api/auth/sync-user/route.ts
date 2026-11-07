// src/app/api/auth/sync-user/route.ts
// Called AFTER Firebase registration to create or sync a MongoDB user document,
// auto-provision Institution if registering as an educator/admin,
// and set Firebase Custom Claims (role, institutionId)
// POST /api/auth/sync-user

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { adminAuth } from "@/lib/firebase-admin";
import User, { UserRole } from "@/models/User";
import Institution from "@/models/Institution";

function generateSlug(text: string): string {
  const base = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || `inst-${Date.now()}`;
}

export async function POST(req: NextRequest) {
  try {
    const {
      firebaseUid,
      email,
      name,
      role = "STUDENT",
      institutionName,
      phone,
    } = await req.json();

    if (!firebaseUid || !email || !name) {
      return NextResponse.json(
        { success: false, error: "firebaseUid, email, and name are required" },
        { status: 400 }
      );
    }

    const conn = await connectDB();

    const normalizedEmail = email.toLowerCase().trim();
    let assignedRole: UserRole = "STUDENT";
    if (normalizedEmail === "admin@khata.ai" || role === "SUPER_ADMIN") {
      assignedRole = "SUPER_ADMIN";
    } else if (role === "TEACHER" || role === "ADMIN" || normalizedEmail.includes("teacher") || normalizedEmail.includes("udvash")) {
      assignedRole = "TEACHER";
    } else {
      assignedRole = "STUDENT";
    }

    if (!conn) {
      console.warn("MongoDB unavailable in sync-user. Returning fallback profile.");
      return NextResponse.json({
        success: true,
        user: {
          id: `usr_${firebaseUid.slice(0, 10)}`,
          firebaseUid,
          email: normalizedEmail,
          name: name.trim(),
          role: assignedRole,
          institutionId: null,
          institutionSlug: null,
          institutionName: institutionName || (assignedRole === "TEACHER" ? "Udvash Academic & Admission Care" : null),
          isActive: true,
          createdAt: new Date().toISOString(),
        },
      });
    }

    // 1. Check if user already exists in MongoDB
    let user = await User.findOne({
      $or: [{ firebaseUid }, { email: normalizedEmail }],
    });

    if (!user) {
      // Create new User in MongoDB
      user = new User({
        firebaseUid,
        email: normalizedEmail,
        name: name.trim(),
        role: assignedRole,
        phone: phone || null,
        isActive: true,
      });
      await user.save();
      console.log(`✅ New user created in MongoDB: ${normalizedEmail}`);
    } else {
      // Update role if teacher or super_admin
      if (normalizedEmail.includes("teacher") && user.role !== "TEACHER") {
        user.role = "TEACHER";
      }
      if (user.firebaseUid !== firebaseUid) {
        user.firebaseUid = firebaseUid;
      }
      await user.save();
    }

    // 2. If registering as an institution / educator and institutionName is provided
    let institution = null;
    if (assignedRole === "TEACHER" && institutionName && institutionName.trim()) {
      const trimmedInstName = institutionName.trim();
      let slug = generateSlug(trimmedInstName);

      // Ensure slug uniqueness
      const existingSlug = await Institution.findOne({ slug });
      if (existingSlug && existingSlug.adminUserId?.toString() !== user._id.toString()) {
        slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
      }

      institution = await Institution.findOne({ adminUserId: user._id });
      if (!institution) {
        institution = await Institution.create({
          name: trimmedInstName,
          slug,
          type: "COACHING",
          adminUserId: user._id,
          subscriptionPlan: "FREE",
          status: "ACTIVE",
          contactEmail: normalizedEmail,
          scriptsQuota: 50,
          scriptsUsed: 0,
        });
        console.log(`🏫 New institution created in MongoDB: ${trimmedInstName} (${slug})`);
      }

      user.institutionId = institution._id as any;
      await user.save();
    } else if (user.institutionId) {
      institution = await Institution.findById(user.institutionId);
    }

    // 3. Set Firebase Custom Claims for Role-Based Access Control
    try {
      await adminAuth.setCustomUserClaims(firebaseUid, {
        role: user.role,
        mongoUserId: user._id.toString(),
        institutionId: user.institutionId?.toString() || null,
      });
      console.log(`✅ Firebase custom claims set for: ${normalizedEmail} (Role: ${user.role})`);
    } catch (claimErr) {
      console.warn("⚠️  Could not set Firebase custom claims (service account key might be unset):", claimErr);
    }

    // 4. Return combined profile
    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        firebaseUid: user.firebaseUid,
        email: user.email,
        name: user.name,
        role: user.role,
        institutionId: user.institutionId?.toString() || null,
        institutionSlug: institution?.slug || null,
        institutionName: institution?.name || null,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    });
  } catch (err: any) {
    console.error("sync-user error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
