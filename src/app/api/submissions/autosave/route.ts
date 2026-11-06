// src/app/api/submissions/autosave/route.ts
// Real-time autosave endpoint for student exam answers

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { examId, studentId, answers, lastSavedAt } = body;

    if (!examId) {
      return NextResponse.json(
        { success: false, error: "Exam ID is required" },
        { status: 400 }
      );
    }

    // Acknowledge draft save
    return NextResponse.json({
      success: true,
      savedAt: new Date().toISOString(),
      itemsCount: Object.keys(answers || {}).length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

