import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const exam = store.getExamByAccessCode(code);

  if (!exam) {
    return NextResponse.json({ success: false, error: "Exam not found with code: " + code }, { status: 404 });
  }

  return NextResponse.json({ success: true, exam });
}
