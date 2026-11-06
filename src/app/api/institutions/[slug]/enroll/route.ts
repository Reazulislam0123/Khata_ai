import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const enrolledStudents = store.getEnrolledStudents(slug);
  return NextResponse.json({ success: true, enrolledStudents });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();

    if (!body.studentName || !body.studentRoll || !body.batchId) {
      return NextResponse.json(
        { success: false, error: "Student Name, Roll Number, and Batch are required." },
        { status: 400 }
      );
    }

    const newEnrollment = store.enrollStudent({
      institutionSlug: slug,
      batchId: body.batchId,
      batchName: body.batchName,
      studentName: body.studentName,
      studentRoll: body.studentRoll,
      studentEmail: body.studentEmail || "",
      studentPhone: body.studentPhone || "",
    });

    return NextResponse.json({ success: true, student: newEnrollment });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
