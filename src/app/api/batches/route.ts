// src/app/api/batches/route.ts
// MongoDB-backed Batch Management API
// GET /api/batches - List batches
// POST /api/batches - Create a new batch

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Batch from "@/models/Batch";
import Institution from "@/models/Institution";
import { store } from "@/lib/store";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const institutionSlug = searchParams.get("institutionSlug");
    const institutionId = searchParams.get("institutionId");

    let query: any = { isActive: true };

    if (institutionId) {
      query.institutionId = institutionId;
    } else if (institutionSlug) {
      const inst = await Institution.findOne({ slug: institutionSlug });
      if (inst) {
        query.institutionId = inst._id;
      }
    }

    const batches = await Batch.find(query)
      .populate("subjectIds", "name code")
      .sort({ createdAt: -1 })
      .lean();

    // If MongoDB has batches, return them; otherwise provide initial fallback
    if (batches.length > 0) {
      return NextResponse.json({ success: true, batches });
    }

    // Fallback seed data if fresh database
    const seedBatches = store.getBatches();
    return NextResponse.json({ success: true, batches: seedBatches });
  } catch (err: any) {
    console.error("GET /api/batches error:", err);
    return NextResponse.json({ success: true, batches: store.getBatches() });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, description, curriculumCode = "HSC", institutionSlug, institutionId } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, error: "Batch name is required." },
        { status: 400 }
      );
    }

    let targetInstId = institutionId;
    if (!targetInstId && institutionSlug) {
      let inst = await Institution.findOne({ slug: institutionSlug });
      if (!inst) {
        // Create institution if not exists
        inst = await Institution.create({
          name: institutionSlug.replace(/-/g, " ").toUpperCase(),
          slug: institutionSlug,
          type: "COACHING",
          contactEmail: "admin@institution.edu.bd",
          scriptsQuota: 100,
        });
      }
      targetInstId = inst._id;
    }

    if (!targetInstId) {
      // Find or create default institution
      let defaultInst = await Institution.findOne();
      if (!defaultInst) {
        defaultInst = await Institution.create({
          name: "Main Coaching Campus",
          slug: "main-campus",
          type: "COACHING",
          contactEmail: "admin@khata.ai",
        });
      }
      targetInstId = defaultInst._id;
    }

    const newBatch = await Batch.create({
      institutionId: targetInstId,
      name: name.trim(),
      description: description || "",
      curriculumCode,
      enrolledStudentCount: 0,
      isActive: true,
    });

    // Also mirror to store for instant backward compatibility
    store.createBatch({
      institutionSlug: institutionSlug || "main-campus",
      name: newBatch.name,
      description: newBatch.description,
      curriculumCode: newBatch.curriculumCode,
    });

    return NextResponse.json({
      success: true,
      batch: newBatch,
      message: "Batch successfully created in MongoDB Atlas",
    });
  } catch (err: any) {
    console.error("POST /api/batches error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create batch" },
      { status: 500 }
    );
  }
}

