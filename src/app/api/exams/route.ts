// src/app/api/exams/route.ts
// MongoDB-backed Exam Management API
// GET /api/exams - List all exams (from MongoDB Atlas)
// POST /api/exams - Create an exam with questions and rubric schemas

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Exam from "@/models/Exam";
import Question from "@/models/Question";
import Institution from "@/models/Institution";
import Batch from "@/models/Batch";
import Subject from "@/models/Subject";
import User from "@/models/User";
import { store } from "@/lib/store";
import { adminAuth } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const batchId = searchParams.get("batchId");
    const institutionSlug = searchParams.get("institutionSlug");

    let mongoExams: any[] = [];
    try {
      await connectDB();
      let query: any = {};
      if (batchId) query.batchId = batchId;

      if (institutionSlug) {
        const inst = await Institution.findOne({ slug: institutionSlug });
        if (inst) query.institutionId = inst._id;
      }

      const found = await Exam.find(query)
        .populate("batchId", "name curriculumCode")
        .populate("institutionId", "name slug")
        .sort({ createdAt: -1 })
        .lean();

      mongoExams = (found || []).map((e: any) => ({
        ...e,
        id: e._id?.toString() || e.id,
        title: e.title || "Examination",
        curriculumCode: e.curriculumCode || "HSC",
      }));
    } catch (dbErr) {
      console.warn("MongoDB exams fetch fallback to store:", dbErr);
    }

    const seedExams = store.getExams();
    const existingIds = new Set(mongoExams.map((e: any) => e.id));
    const combined = [...mongoExams];
    for (const s of seedExams) {
      if (!existingIds.has(s.id)) {
        combined.push(s);
      }
    }

    return NextResponse.json({ success: true, exams: combined });
  } catch (err: any) {
    console.error("GET /api/exams error:", err);
    return NextResponse.json({ success: true, exams: store.getExams() });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    // 1. Resolve Creator Identity (via Firebase Auth header or store fallback)
    let creatorId = "teacher_default";
    let creatorName = "Course Instructor";

    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const token = authHeader.split("Bearer ")[1];
        const decoded = await adminAuth.verifyIdToken(token);
        const user = await User.findOne({ firebaseUid: decoded.uid });
        if (user) {
          creatorId = user._id.toString();
          creatorName = user.name;
        }
      } catch {}
    } else {
      const storeUser = store.getCurrentUser();
      if (storeUser) {
        creatorId = storeUser.id;
        creatorName = storeUser.name;
      }
    }

    // 2. Resolve Target Institution
    let institution = null;
    if (body.institutionSlug) {
      institution = await Institution.findOne({ slug: body.institutionSlug });
    }
    if (!institution) {
      institution = await Institution.findOne();
    }

    // 3. Save Questions into MongoDB
    const questionIdsForExam: Array<{
      questionId: any;
      allocatedMarks: number;
      orderIndex: number;
    }> = [];

    if (Array.isArray(body.questions) && body.questions.length > 0) {
      for (let i = 0; i < body.questions.length; i++) {
        const q = body.questions[i];
        const createdQ = await Question.create({
          institutionId: institution?._id,
          createdBy: creatorId.length === 24 ? creatorId : institution?.adminUserId || undefined,
          type: q.type || "CQ",
          questionText: q.questionText || "Question",
          stimulusText: q.stimulusText || null,
          marks: q.marks || 10,
          difficulty: "MEDIUM",
          tags: [body.curriculumCode || "HSC"],
          mcqOptions: q.mcqOptions || undefined,
          cqParts: q.cqParts || undefined,
          modelAnswer: q.modelAnswer || undefined,
          rubrics: q.rubrics || undefined,
        });

        questionIdsForExam.push({
          questionId: createdQ._id,
          allocatedMarks: q.marks || 10,
          orderIndex: i + 1,
        });
      }
    }

    // 4. Save Exam into MongoDB Atlas
    const newExam = await Exam.create({
      institutionId: institution?._id,
      batchId: body.batchId?.length === 24 ? body.batchId : null,
      createdBy: creatorId.length === 24 ? creatorId : institution?.adminUserId,
      title: body.title,
      curriculumCode: body.curriculumCode || "HSC",
      instructions: body.instructions || "",
      durationMinutes: Number(body.durationMinutes) || 60,
      totalMarks: Number(body.totalMarks) || 100,
      passMarkPercentage: Number(body.passMarkPercentage) || 33,
      negativeMarkingRate: Number(body.negativeMarkingRate) || 0,
      accessCode: body.accessCode || `EXAM_${Math.floor(100 + Math.random() * 900)}`,
      status: "PUBLISHED",
      isOnline: true,
      questions: questionIdsForExam,
    });

    // 5. Mirror to store for instant backward-compatible UI preview
    const mirrorExam = store.createExam({
      ...body,
      creatorId,
      creatorName,
    });

    return NextResponse.json({
      success: true,
      exam: mirrorExam,
      mongoExamId: newExam._id,
      message: "Exam & rubrics saved to MongoDB Atlas",
    });
  } catch (err: any) {
    console.error("POST /api/exams error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create exam" },
      { status: 500 }
    );
  }
}
