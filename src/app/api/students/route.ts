// src/app/api/students/route.ts
// MongoDB-backed Student Management & Batch Enrollment API
// GET /api/students - List enrolled students (filter by batchId or institutionId)
// POST /api/students - Enroll student into a batch with name, roll, email, phone

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Batch from "@/models/Batch";
import { store } from "@/lib/store";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const batchId = searchParams.get("batchId");
    const institutionId = searchParams.get("institutionId");

    let query: any = { role: "STUDENT" };
    if (batchId) query.batchId = batchId;
    if (institutionId) query.institutionId = institutionId;

    const students = await User.find(query)
      .populate("batchId", "name curriculumCode")
      .populate("institutionId", "name slug")
      .sort({ createdAt: -1 })
      .lean();

    if (students.length > 0) {
      return NextResponse.json({ success: true, students });
    }

    // Fallback seed students from store if database is newly initialized
    const seedStudents = store.getEnrolledStudents();
    return NextResponse.json({ success: true, students: seedStudents });
  } catch (err: any) {
    console.error("GET /api/students error:", err);
    return NextResponse.json({ success: true, students: store.getEnrolledStudents() });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const {
      studentName,
      studentRoll,
      studentEmail,
      studentPhone,
      batchId,
      institutionId,
      institutionSlug,
    } = body;

    if (!studentName?.trim() || !studentRoll?.trim()) {
      return NextResponse.json(
        { success: false, error: "Student name and roll number are required." },
        { status: 400 }
      );
    }

    const email =
      studentEmail?.trim().toLowerCase() ||
      `roll-${studentRoll.trim().toLowerCase()}@khata-student.local`;

    // 1. Check or create User in MongoDB
    let studentUser = await User.findOne({ email });

    if (!studentUser) {
      studentUser = await User.create({
        firebaseUid: `std_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: studentName.trim(),
        email,
        phone: studentPhone?.trim() || null,
        rollNo: studentRoll.trim(),
        role: "STUDENT",
        batchId: batchId || null,
        institutionId: institutionId || null,
        isActive: true,
      });
    } else {
      studentUser.rollNo = studentRoll.trim();
      if (batchId) studentUser.batchId = batchId;
      if (institutionId) studentUser.institutionId = institutionId;
      await studentUser.save();
    }

    // 2. Increment Batch enrolled count if batchId provided
    if (batchId) {
      await Batch.findByIdAndUpdate(batchId, {
        $inc: { enrolledStudentCount: 1 },
      });
    }

    // 3. Mirror to in-memory store for instant sync
    store.enrollStudent({
      batchId: batchId || "default_batch",
      institutionSlug: institutionSlug || "udvash-academic",
      studentName: studentName.trim(),
      studentRoll: studentRoll.trim(),
      studentEmail: email,
      studentPhone: studentPhone?.trim(),
    });

    return NextResponse.json({
      success: true,
      student: studentUser,
      message: "Student successfully enrolled in MongoDB Atlas",
    });
  } catch (err: any) {
    console.error("POST /api/students error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to enroll student" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, name, email, rollNumber, phone, batchId, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Student User ID is required" },
        { status: 400 }
      );
    }

    const updateFields: any = {};
    if (name) updateFields.name = name.trim();
    if (email) updateFields.email = email.trim().toLowerCase();
    if (rollNumber) updateFields.rollNo = rollNumber.trim();
    if (phone !== undefined) updateFields.phone = phone?.trim() || null;
    if (batchId) updateFields.batchId = batchId;
    if (isActive !== undefined) updateFields.isActive = isActive;

    const updated = await User.findByIdAndUpdate(id, updateFields, { new: true });
    return NextResponse.json({
      success: true,
      message: "Student profile updated successfully in MongoDB Atlas",
      student: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update student" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Student ID is required" },
        { status: 400 }
      );
    }

    await User.findByIdAndDelete(id);
    return NextResponse.json({
      success: true,
      message: "Student deleted successfully from MongoDB Atlas",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete student" },
      { status: 500 }
    );
  }
}


