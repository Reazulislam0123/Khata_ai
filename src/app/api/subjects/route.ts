// src/app/api/subjects/route.ts
// MongoDB-backed Subject Management API
// GET /api/subjects - List subjects (optionally filtered by batchId)
// POST /api/subjects - Create a new subject inside a batch

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Subject from "@/models/Subject";
import Batch from "@/models/Batch";
import Institution from "@/models/Institution";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const batchId = searchParams.get("batchId");
    const institutionId = searchParams.get("institutionId");

    let query: any = {};
    if (batchId) query.batchId = batchId;
    if (institutionId) query.institutionId = institutionId;

    const subjects = await Subject.find(query).sort({ createdAt: -1 }).lean();

    if (subjects.length > 0) {
      return NextResponse.json({ success: true, subjects });
    }

    // Default subjects if none exist yet in MongoDB
    const fallbackSubjects = [
      { id: "sub_phy", name: "Physics 1st & 2nd Paper", code: "PHY-174" },
      { id: "sub_chem", name: "Chemistry 1st & 2nd Paper", code: "CHEM-176" },
      { id: "sub_math", name: "Higher Mathematics", code: "MATH-265" },
      { id: "sub_bio", name: "Biology (Zoology & Botany)", code: "BIO-178" },
      { id: "sub_eng", name: "English 1st & 2nd Paper", code: "ENG-107" },
      { id: "sub_bangla", name: "Bangla 1st & 2nd Paper", code: "BAN-101" },
    ];

    return NextResponse.json({ success: true, subjects: fallbackSubjects });
  } catch (err: any) {
    console.error("GET /api/subjects error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, code, batchId, institutionId } = body;

    if (!name?.trim() || !code?.trim()) {
      return NextResponse.json(
        { success: false, error: "Subject name and code are required." },
        { status: 400 }
      );
    }

    let targetInstId = institutionId;
    if (!targetInstId) {
      const firstInst = await Institution.findOne();
      targetInstId = firstInst?._id;
    }

    const newSubject = await Subject.create({
      institutionId: targetInstId,
      batchId: batchId || null,
      name: name.trim(),
      code: code.trim().toUpperCase(),
    });

    // If attached to a batch, push into batch.subjectIds
    if (batchId) {
      await Batch.findByIdAndUpdate(batchId, {
        $addToSet: { subjectIds: newSubject._id },
      });
    }

    return NextResponse.json({
      success: true,
      subject: newSubject,
      message: "Subject successfully created",
    });
  } catch (err: any) {
    console.error("POST /api/subjects error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create subject" },
      { status: 500 }
    );
  }
}

