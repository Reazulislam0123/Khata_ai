import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import connectDB from "@/lib/mongodb";
import SubmissionModel from "@/models/Submission";
import UserModel from "@/models/User";
import ExamModel from "@/models/Exam";
import mongoose from "mongoose";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const examId = searchParams.get("examId");
  const studentId = searchParams.get("studentId");

  let submissions = store.getSubmissions();
  if (examId) {
    submissions = submissions.filter((s) => s.examId === examId);
  }
  if (studentId) {
    submissions = submissions.filter((s) => s.studentId === studentId);
  }

  // Also query MongoDB Atlas for persistent submissions
  try {
    await connectDB();
    const query: Record<string, any> = {};
    if (examId && mongoose.Types.ObjectId.isValid(examId)) {
      query.examId = new mongoose.Types.ObjectId(examId);
    }
    if (studentId && mongoose.Types.ObjectId.isValid(studentId)) {
      query.studentId = new mongoose.Types.ObjectId(studentId);
    }

    const mongoSubs = await SubmissionModel.find(query)
      .populate("studentId", "name email rollNumber")
      .populate("examId", "title subject curriculumCode totalMarks")
      .sort({ createdAt: -1 })
      .lean();

    if (mongoSubs && mongoSubs.length > 0) {
      // Merge unique entries
      const existingIds = new Set(submissions.map((s) => s.id));
      for (const mSub of mongoSubs) {
        const id = (mSub as any)._id.toString();
        if (!existingIds.has(id)) {
          const sUser = (mSub as any).studentId;
          const sExam = (mSub as any).examId;
          submissions.unshift({
            id,
            examId: sExam?._id?.toString() || (mSub as any).examId?.toString() || "",
            examTitle: sExam?.title || "Examination",
            subject: sExam?.subject || "General",
            curriculumCode: sExam?.curriculumCode || "HSC",
            studentId: sUser?._id?.toString() || (mSub as any).studentId?.toString() || "",
            studentName: sUser?.name || "Student Examinee",
            studentRoll: sUser?.rollNumber || "Roll 101",
            studentEmail: sUser?.email || "student@khata.ai",
            status: (mSub as any).status || "EVALUATED",
            submittedAt: (mSub as any).submittedAt?.toISOString() || (mSub as any).createdAt?.toISOString() || new Date().toISOString(),
            answerSheetImages: [],
            answers: {},
          });
        }
      }
    }
  } catch (err) {
    // Non-blocking fallback to store
  }

  return NextResponse.json({ success: true, submissions });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const currentUser = store.getCurrentUser();
    const exam = store.getExamById(body.examId);

    // Save in in-memory store for instant UI response and legacy compatibility
    const newSubmission = store.createSubmission({
      examId: body.examId,
      examTitle: exam?.title || body.examTitle || "General Exam",
      subject: exam?.subject || body.subject || "General",
      curriculumCode: exam?.curriculumCode || body.curriculumCode || "HSC",
      studentId: body.studentId || currentUser?.id || `student_${Date.now()}`,
      studentName: body.studentName || currentUser?.name || "Student Examinee",
      studentRoll: body.studentRoll || currentUser?.institution || "Roll 101",
      studentEmail: body.studentEmail || currentUser?.email || "student@khata.ai",
      batchId: body.batchId || exam?.batchId,
      batchName: body.batchName || exam?.batchName,
      institutionSlug: body.institutionSlug || exam?.institutionSlug,
      status: "PENDING_EVALUATION",
      answerSheetImages: body.answerSheetImages || [],
      answers: body.answers || {},
    });

    // Also persist into MongoDB Atlas Submission collection
    try {
      await connectDB();
      let mExam = null;
      if (body.examId && mongoose.Types.ObjectId.isValid(body.examId)) {
        mExam = await ExamModel.findById(body.examId);
      }

      // Check if student exists or create fallback student document
      let studentDoc = null;
      if (body.studentId && mongoose.Types.ObjectId.isValid(body.studentId)) {
        studentDoc = await UserModel.findById(body.studentId);
      }
      if (!studentDoc && (body.studentEmail || currentUser?.email)) {
        studentDoc = await UserModel.findOne({ email: body.studentEmail || currentUser?.email });
      }

      const answersList: any[] = [];
      if (body.answers && typeof body.answers === "object") {
        for (const [qId, ans] of Object.entries<any>(body.answers)) {
          answersList.push({
            questionId: mongoose.Types.ObjectId.isValid(qId)
              ? new mongoose.Types.ObjectId(qId)
              : new mongoose.Types.ObjectId(),
            type: ans.selectedOptionId ? "MCQ" : "CQ",
            selectedOption: ans.selectedOptionId || null,
            writtenAnswer: ans.typedAnswer || null,
            answerSheetImageUrls: body.answerSheetImages || [],
          });
        }
      }

      const mongoSubmission = await SubmissionModel.create({
        examId: mExam?._id || new mongoose.Types.ObjectId(),
        studentId: studentDoc?._id || new mongoose.Types.ObjectId(),
        institutionId: mExam?.institutionId || new mongoose.Types.ObjectId(),
        status: "SUBMITTED",
        startedAt: new Date(),
        submittedAt: new Date(),
        answers: answersList,
      });

      // Keep matching ID if feasible
      if (mongoSubmission) {
        (newSubmission as any).mongoId = mongoSubmission._id.toString();
      }
    } catch (dbErr) {
      console.warn("MongoDB Submission persistence warning:", dbErr);
    }

    return NextResponse.json({ success: true, submission: newSubmission });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
