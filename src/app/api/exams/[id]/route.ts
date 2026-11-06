import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import connectDB from "@/lib/mongodb";
import ExamModel from "@/models/Exam";
import mongoose from "mongoose";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let exam = store.getExamById(id);

  if (!exam) {
    try {
      await connectDB();
      if (mongoose.Types.ObjectId.isValid(id)) {
        const mExam = await ExamModel.findById(id).lean();
        if (mExam) {
          exam = {
            id: (mExam as any)._id.toString(),
            title: (mExam as any).title,
            subject: (mExam as any).subject?.toString() || "General",
            curriculumCode: (mExam as any).curriculumCode || "HSC",
            creatorId: (mExam as any).institutionId?.toString() || "system",
            creatorName: "Institution Faculty",
            durationMinutes: (mExam as any).durationMinutes || 60,
            totalMarks: (mExam as any).totalMarks || 100,
            negativeMarkingRate: (mExam as any).negativeMarkingRate || 0,
            passMarkPercentage: 40,
            isOnline: true,
            isPublished: (mExam as any).status === "PUBLISHED",
            accessCode: (mExam as any).accessCode,
            isPrivate: (mExam as any).isPrivate,
            createdAt: (mExam as any).createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: (mExam as any).updatedAt?.toISOString() || new Date().toISOString(),
            questions: [],
          };
        }
      }
    } catch {}
  }

  if (!exam) {
    return NextResponse.json({ success: false, error: "Exam not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, exam });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = store.updateExam(id, body);

    try {
      await connectDB();
      if (mongoose.Types.ObjectId.isValid(id)) {
        await ExamModel.findByIdAndUpdate(id, body);
      }
    } catch {}

    if (!updated) {
      return NextResponse.json({ success: false, error: "Exam not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, exam: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deleted = store.deleteExam(id);

  try {
    await connectDB();
    if (mongoose.Types.ObjectId.isValid(id)) {
      await ExamModel.findByIdAndDelete(id);
    }
  } catch {}

  return NextResponse.json({ success: deleted });
}
