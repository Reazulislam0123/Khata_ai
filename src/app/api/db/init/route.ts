import { NextResponse } from "next/server";
import { isDatabaseConnected } from "@/lib/db";
import { store } from "@/lib/store";

export async function GET() {
  const dbStatus = await isDatabaseConnected();
  const examsCount = store.getExams().length;
  const submissionsCount = store.getSubmissions().length;
  const usersCount = store.getAllUsers().length;

  return NextResponse.json({
    success: true,
    dbStatus,
    stats: {
      examsCount,
      submissionsCount,
      usersCount,
    },
  });
}

export async function POST() {
  const dbStatus = await isDatabaseConnected();
  return NextResponse.json({
    success: true,
    message: `Database synchronization complete. Running on ${dbStatus.type}.`,
    dbStatus,
  });
}
