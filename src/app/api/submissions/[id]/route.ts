// src/app/api/submissions/[id]/route.ts
// Submission Detail & Teacher Manual Override / Approval API
// Persists teacher edits and approval flags into MongoDB Atlas
// GET /api/submissions/:id
// PUT /api/submissions/:id

import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import connectDB from "@/lib/mongodb";
import Submission from "@/models/Submission";
import Evaluation from "@/models/Evaluation";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let submission = store.getSubmissionById(id);

  if (!submission) {
    try {
      await connectDB();
      if (id.length === 24) {
        const mongoSub = await Submission.findById(id).lean();
        const mongoEval = await Evaluation.findOne({ submissionId: id }).lean();
        if (mongoSub) {
          submission = {
            id: (mongoSub as any)._id.toString(),
            examId: (mongoSub as any).examId?.toString() || "",
            examTitle: "Examination",
            subject: "Course",
            curriculumCode: "HSC",
            studentId: (mongoSub as any).studentId?.toString() || "",
            studentName: "Student",
            submittedAt: (mongoSub as any).submittedAt?.toISOString() || new Date().toISOString(),
            status: (mongoSub as any).status || "EVALUATED",
            answerSheetImages: [],
            answers: {},
            evaluation: mongoEval ? (mongoEval as any) : undefined,
          };
        }
      }
    } catch {}
  }

  if (!submission) {
    return NextResponse.json({ success: false, error: "Submission not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, submission });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    // 1. Support teacher manual adjustment of marks
    if (body.questionId && body.newMarks !== undefined) {
      const updated = store.updateTeacherMarks(id, body.questionId, body.newMarks, body.remarks);

      // Async sync to MongoDB Atlas
      try {
        await connectDB();
        if (id.length === 24) {
          await Evaluation.findOneAndUpdate(
            { submissionId: id },
            {
              $set: {
                teacherRemarks: body.remarks || "Marks adjusted by instructor",
                "questionBreakdown.$[elem].marksAwarded": body.newMarks,
              },
            },
            {
              arrayFilters: [{ "elem.questionId": body.questionId }],
            }
          );
        }
      } catch (dbErr) {
        console.warn("MongoDB marks update sync warning:", dbErr);
      }

      return NextResponse.json({ success: true, submission: updated });
    }

    // 2. Support Teacher Approval & Publish
    if (body.isApprovedByTeacher !== undefined) {
      const existing = store.getSubmissionById(id);
      if (existing && existing.evaluation) {
        existing.evaluation.isApprovedByTeacher = true;
        existing.evaluation.teacherRemarks = body.remarks || existing.evaluation.teacherRemarks;
      }

      try {
        await connectDB();
        if (id.length === 24) {
          await Evaluation.findOneAndUpdate(
            { submissionId: id },
            {
              $set: {
                isApprovedByTeacher: true,
                teacherApprovedAt: new Date(),
                teacherRemarks: body.remarks || "Approved by instructor",
              },
            }
          );
          await Submission.findByIdAndUpdate(id, {
            $set: { status: "EVALUATED" },
          });
        }
      } catch (dbErr) {
        console.warn("MongoDB approval sync warning:", dbErr);
      }

      return NextResponse.json({
        success: true,
        message: "Evaluation officially approved and published to student",
      });
    }

    return NextResponse.json({ success: false, error: "Invalid update request" }, { status: 400 });
  } catch (err: any) {
    console.error("PUT /api/submissions/:id error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
