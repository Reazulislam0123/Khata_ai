import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/server-auth";
import { store } from "@/lib/store";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const institution = store.getInstitutionBySlug(slug);

  if (!institution) {
    return NextResponse.json({ success: false, error: "Institution not found" }, { status: 404 });
  }

  const loggedInUser = await getAuthenticatedUser();

  const isOwner =
    !!loggedInUser &&
    (loggedInUser.role === "ADMIN" ||
      loggedInUser.id === institution.userId);

  // Get batches and enrolled students for this institution
  const batches = store.getBatches(slug);
  const enrolledStudents = store.getEnrolledStudents(slug);

  // Get exams for this institution (owners/teachers see both public and private; visitors see public only)
  const exams = store.getExamsByInstitution(slug, isOwner);

  // Get submissions for this institution
  const examIds = new Set(exams.map((e) => e.id));
  const allSubmissions = store.getSubmissions();
  const submissions = allSubmissions.filter(
    (s) =>
      examIds.has(s.examId) ||
      s.institutionSlug === slug ||
      (slug === "udvash-academic" && (!s.institutionSlug || s.institutionSlug === "udvash-academic"))
  );

  return NextResponse.json({
    success: true,
    institution,
    exams,
    submissions,
    batches,
    enrolledStudents,
    isOwner,
    currentUser: loggedInUser,
  });
}
