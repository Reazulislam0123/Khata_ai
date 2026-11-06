// src/app/api/subscription/request/route.ts
// Handles Student and Teacher Subscription Requests & Super Admin Activation Workflow

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import SubscriptionRequest from "@/models/SubscriptionRequest";
import User from "@/models/User";
import Institution from "@/models/Institution";
import AuditLog from "@/models/AuditLog";

// In-memory fallback for requests if DB is fresh
let fallbackRequests: any[] = [
  {
    _id: "req_demo_01",
    userName: "Maksudur Rahman",
    userEmail: "teacher@udvash.com",
    userRole: "TEACHER",
    institutionName: "Udvash Academic Care",
    planId: "teacher_pro",
    planName: "Teacher Pro (শিক্ষক প্রো)",
    amount: 999,
    currency: "BDT",
    billingCycle: "monthly",
    paymentMethod: "bkash",
    paymentPhone: "01712345678",
    transactionId: "BK99283471",
    status: "PENDING",
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    _id: "req_demo_02",
    userName: "Tanvir Ahmed",
    userEmail: "student@dhakacollege.edu.bd",
    userRole: "STUDENT",
    institutionName: "Dhaka College",
    planId: "student_plus",
    planName: "Student Exam Pass (এইচএসসি প্লাস)",
    amount: 299,
    currency: "BDT",
    billingCycle: "monthly",
    paymentMethod: "nagad",
    paymentPhone: "01812345679",
    transactionId: "NG77441199",
    status: "PENDING",
    createdAt: new Date(Date.now() - 1000 * 60 * 65),
  },
];

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const email = searchParams.get("email");

    const query: any = {};
    if (status && status !== "ALL") query.status = status;
    if (email) query.userEmail = email.toLowerCase().trim();

    const requests = await SubscriptionRequest.find(query).sort({ createdAt: -1 }).lean();
    const pendingCount = await SubscriptionRequest.countDocuments({ status: "PENDING" });

    if (requests.length > 0) {
      return NextResponse.json({
        success: true,
        requests,
        pendingCount,
      });
    }

    // Return fallback requests if database collection is empty
    const filteredFallback = fallbackRequests.filter((r) => {
      if (status && status !== "ALL" && r.status !== status) return false;
      if (email && r.userEmail !== email.toLowerCase().trim()) return false;
      return true;
    });

    return NextResponse.json({
      success: true,
      requests: filteredFallback,
      pendingCount: fallbackRequests.filter((r) => r.status === "PENDING").length,
    });
  } catch (err: any) {
    console.error("GET /api/subscription/request error:", err);
    return NextResponse.json({
      success: true,
      requests: fallbackRequests,
      pendingCount: fallbackRequests.filter((r) => r.status === "PENDING").length,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      planId,
      planName,
      amount,
      currency = "BDT",
      billingCycle = "monthly",
      paymentMethod = "bkash",
      paymentPhone,
      transactionId,
      userName,
      userEmail,
      userRole = "TEACHER",
      institutionName,
    } = body;

    if (!userEmail || !planName) {
      return NextResponse.json(
        { success: false, error: "User email and plan details are required" },
        { status: 400 }
      );
    }

    const email = userEmail.toLowerCase().trim();

    // Check if user exists in MongoDB
    let user = await User.findOne({ email });
    if (!user) {
      // Auto-register user document if new
      user = await User.create({
        firebaseUid: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: userName || email.split("@")[0],
        email,
        role: userRole === "STUDENT" ? "STUDENT" : "ADMIN",
        phone: paymentPhone || null,
        plan: "FREE",
        subscriptionStatus: "PENDING_APPROVAL",
        planRequested: planName,
        isActive: true,
      });
    } else {
      user.subscriptionStatus = "PENDING_APPROVAL";
      user.planRequested = planName;
      if (paymentPhone && !user.phone) user.phone = paymentPhone;
      await user.save();
    }

    // Create SubscriptionRequest
    const newRequest = await SubscriptionRequest.create({
      userId: user._id,
      userName: userName || user.name,
      userEmail: email,
      userRole: (user.role === "STUDENT" ? "STUDENT" : "ADMIN") as any,
      institutionName: institutionName || null,
      planId: planId || "pro",
      planName,
      amount: Number(amount) || 0,
      currency,
      billingCycle,
      paymentMethod,
      paymentPhone: paymentPhone || null,
      transactionId: transactionId || `TX_${Date.now().toString().slice(-6)}`,
      status: "PENDING",
    });

    // Also mirror to memory fallback
    fallbackRequests.unshift({
      ...newRequest.toObject(),
      _id: newRequest._id.toString(),
    });

    // Audit log
    try {
      await AuditLog.create({
        actorId: user._id,
        actorRole: user.role || "USER",
        action: "SUBSCRIPTION_REQUESTED",
        targetCollection: "SubscriptionRequest",
        targetId: newRequest._id,
        details: {
          description: `Subscription requested by ${userName} (${email}) for plan "${planName}". Pending Super Admin activation.`,
          planName,
          amount,
          paymentMethod,
        },
      });
    } catch (e) {
      // Non-blocking
    }

    return NextResponse.json({
      success: true,
      request: newRequest,
      message: `Subscription request for "${planName}" submitted! Super Admin will review and activate your plan.`,
    });
  } catch (err: any) {
    console.error("POST /api/subscription/request error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to submit subscription request" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { requestId, action, adminNotes, approvedBy = "admin@khata.ai" } = body;

    if (!requestId || !action) {
      return NextResponse.json(
        { success: false, error: "requestId and action are required" },
        { status: 400 }
      );
    }

    let request = null;
    if (requestId.length === 24) {
      request = await SubscriptionRequest.findById(requestId);
    }

    // Fallback in-memory search
    if (!request) {
      const idx = fallbackRequests.findIndex((r) => r._id === requestId);
      if (idx !== -1) {
        request = fallbackRequests[idx];
      }
    }

    if (!request) {
      return NextResponse.json(
        { success: false, error: "Subscription request not found" },
        { status: 404 }
      );
    }

    if (action === "APPROVE") {
      const email = request.userEmail.toLowerCase().trim();
      const planName = request.planName;
      const planId = request.planId;

      // 1. Update Request
      if (request.save) {
        request.status = "APPROVED";
        request.approvedAt = new Date();
        request.approvedBy = approvedBy;
        if (adminNotes) request.adminNotes = adminNotes;
        await request.save();
      } else {
        request.status = "APPROVED";
        request.approvedAt = new Date();
        request.approvedBy = approvedBy;
      }

      // 2. Activate User Plan
      const user = await User.findOne({ email });
      if (user) {
        user.plan = planId.toUpperCase();
        user.subscriptionStatus = "ACTIVE";
        user.isActive = true;
        // If teacher or enterprise plan requested, ensure user has teacher/admin role
        if (
          ["TEACHER_PRO", "COACHING_ULTRA", "VARSITY_ENTERPRISE", "PRO", "ENTERPRISE"].some((p) =>
            planId.toUpperCase().includes(p)
          )
        ) {
          if (user.role === "STUDENT") {
            user.role = "ADMIN";
          }
        }
        await user.save();
      }

      // 3. If user belongs to an institution, upgrade institution subscription tier too
      if (user?.institutionId) {
        await Institution.findByIdAndUpdate(user.institutionId, {
          subscriptionPlan: planId.toUpperCase().includes("ENTERPRISE")
            ? "ENTERPRISE"
            : planId.toUpperCase().includes("PRO") || planId.toUpperCase().includes("TEACHER")
            ? "PRO"
            : "FREE",
          status: "ACTIVE",
        });
      }

      // 4. Audit Log
      try {
        await AuditLog.create({
          actorId: user?._id || new mongoose.Types.ObjectId(),
          actorRole: "SUPER_ADMIN",
          action: "SUBSCRIPTION_ACTIVATED",
          targetCollection: "User",
          targetId: user?._id || undefined,
          details: {
            description: `Super Admin activated ${planName} for ${request.userName} (${email}). Full access granted.`,
            approvedBy,
            planId,
          },
        });
      } catch (e) {
        // Non-blocking
      }

      return NextResponse.json({
        success: true,
        message: `Plan "${planName}" successfully activated for ${request.userName}! Full access has been granted.`,
      });
    }

    if (action === "REJECT") {
      if (request.save) {
        request.status = "REJECTED";
        request.adminNotes = adminNotes || "Payment could not be verified";
        await request.save();
      } else {
        request.status = "REJECTED";
      }

      // Update User status
      await User.findOneAndUpdate(
        { email: request.userEmail.toLowerCase().trim() },
        { subscriptionStatus: "REJECTED" }
      );

      return NextResponse.json({
        success: true,
        message: `Subscription request for ${request.userName} has been rejected.`,
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    console.error("PUT /api/subscription/request error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update subscription request" },
      { status: 500 }
    );
  }
}
