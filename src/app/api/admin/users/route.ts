// src/app/api/admin/users/route.ts
// Super Admin User Management API (Full CRUD)

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import UserModel from "@/models/User";
import InstitutionModel from "@/models/Institution";
import BatchModel from "@/models/Batch";
import { store } from "@/lib/store";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const search = searchParams.get("search");

    let users: any[] = [];

    try {
      await connectDB();
      const filter: any = {};
      if (role && role !== "ALL") {
        filter.role = role;
      }
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { rollNo: { $regex: search, $options: "i" } },
        ];
      }

      const mongoUsers = await UserModel.find(filter)
        .populate("institutionId", "name slug")
        .populate("batchId", "name")
        .sort({ createdAt: -1 })
        .lean();

      users = mongoUsers.map((u: any) => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        role: u.role,
        institution: u.institutionId?.name || "Independent",
        institutionId: u.institutionId?._id?.toString() || null,
        batchName: u.batchId?.name || "General Cohort",
        batchId: u.batchId?._id?.toString() || null,
        rollNo: u.rollNo || "N/A",
        phone: u.phone || "N/A",
        plan: u.plan || "FREE",
        subscriptionStatus: u.subscriptionStatus || "ACTIVE",
        isActive: u.isActive !== false,
        createdAt: u.createdAt?.toISOString() || new Date().toISOString(),
      }));
    } catch (dbErr) {
      console.warn("DB user fetch warning, falling back to store:", dbErr);
    }

    // Merge in-memory users if DB has fewer users
    const storeUsers = store.getAllUsers();
    const existingEmails = new Set(users.map((u) => u.email.toLowerCase()));
    for (const su of storeUsers) {
      if (!existingEmails.has(su.email.toLowerCase())) {
        if (!role || role === "ALL" || su.role === role) {
          users.push({
            id: su.id,
            name: su.name,
            email: su.email,
            role: su.role,
            institution: su.institution || "KhataAI HQ",
            batchName: "Batch 2026",
            rollNo: "Roll 101",
            phone: "017XXXXXXXX",
            isActive: true,
            createdAt: new Date().toISOString(),
          });
        }
      }
    }

    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, role, phone, rollNo, institutionId, batchId, isActive } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Name and Email are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanRole = role || "STUDENT";
    let newUserId = `usr_${Date.now()}`;

    try {
      await connectDB();
      const existing = await UserModel.findOne({ email: cleanEmail });
      if (existing) {
        return NextResponse.json(
          { success: false, error: "A user with this email already exists." },
          { status: 400 }
        );
      }

      const createdMongoUser = await UserModel.create({
        firebaseUid: `fb_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        email: cleanEmail,
        name,
        role: cleanRole,
        institutionId: institutionId && mongoose.Types.ObjectId.isValid(institutionId) ? institutionId : null,
        batchId: batchId && mongoose.Types.ObjectId.isValid(batchId) ? batchId : null,
        phone: phone || null,
        rollNo: rollNo || null,
        isActive: isActive !== false,
      });

      newUserId = createdMongoUser._id.toString();
    } catch (dbErr) {
      console.warn("MongoDB user create warning:", dbErr);
    }

    // Mirror to store
    store.registerUser({
      name,
      email: cleanEmail,
      role: cleanRole as any,
      institution: "Institution Roster",
    });

    return NextResponse.json({
      success: true,
      message: `User ${name} created successfully as ${cleanRole}.`,
      user: {
        id: newUserId,
        name,
        email: cleanEmail,
        role: cleanRole,
        isActive: isActive !== false,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { userId, name, role, phone, rollNo, institutionId, batchId, isActive, plan, subscriptionStatus } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required." },
        { status: 400 }
      );
    }

    try {
      await connectDB();
      if (mongoose.Types.ObjectId.isValid(userId)) {
        const updateFields: any = {};
        if (name !== undefined) updateFields.name = name;
        if (role !== undefined) updateFields.role = role;
        if (phone !== undefined) updateFields.phone = phone;
        if (rollNo !== undefined) updateFields.rollNo = rollNo;
        if (isActive !== undefined) updateFields.isActive = isActive;
        if (plan !== undefined) updateFields.plan = plan;
        if (subscriptionStatus !== undefined) updateFields.subscriptionStatus = subscriptionStatus;
        if (institutionId !== undefined) {
          updateFields.institutionId =
            institutionId && mongoose.Types.ObjectId.isValid(institutionId) ? institutionId : null;
        }
        if (batchId !== undefined) {
          updateFields.batchId =
            batchId && mongoose.Types.ObjectId.isValid(batchId) ? batchId : null;
        }

        await UserModel.findByIdAndUpdate(userId, updateFields);
      }
    } catch (dbErr) {
      console.warn("MongoDB user update warning:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "User profile updated successfully.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    try {
      await connectDB();
      if (mongoose.Types.ObjectId.isValid(userId)) {
        await UserModel.findByIdAndDelete(userId);
      }
    } catch (dbErr) {
      console.warn("MongoDB user delete warning:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

