import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/server-auth";
import { store } from "@/lib/store";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const batches = store.getBatches(slug);
  return NextResponse.json({ success: true, batches });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();

    if (!body.name) {
      return NextResponse.json(
        { success: false, error: "Batch name is required" },
        { status: 400 }
      );
    }

    const currentUser = await getAuthenticatedUser();
    const institution = store.getInstitutionBySlug(slug);

    if (!institution) {
      return NextResponse.json({ success: false, error: "Institution not found" }, { status: 404 });
    }

    const isOwner = !!currentUser && (currentUser.role === "ADMIN" || institution.userId === currentUser.id);
    if (!isOwner) {
      return NextResponse.json(
        {
          success: false,
          error: `Unauthorized: Only the creator of '${institution.name}' can create batches.`,
        },
        { status: 403 }
      );
    }

    const newBatch = store.createBatch({
      institutionSlug: slug,
      name: body.name,
      description: body.description || "",
      curriculumCode: body.curriculumCode || "HSC",
    });

    return NextResponse.json({ success: true, batch: newBatch });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
