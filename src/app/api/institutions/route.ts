// src/app/api/institutions/route.ts
// MongoDB-backed Institution Management API
// GET /api/institutions - List or find institution by slug/userId
// POST /api/institutions - Create or update institution in MongoDB Atlas

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Institution from "@/models/Institution";
import User from "@/models/User";
import { store } from "@/lib/store";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const userId = searchParams.get("userId");

    if (slug) {
      const inst = await Institution.findOne({ slug }).lean();
      if (inst) {
        return NextResponse.json({ success: true, institution: inst });
      }
      const fallback = store.getInstitutionBySlug(slug);
      if (fallback) {
        return NextResponse.json({ success: true, institution: fallback });
      }
      return NextResponse.json(
        { success: false, error: "Institution not found" },
        { status: 404 }
      );
    }

    if (userId) {
      // Find institutions owned by user in MongoDB
      const insts = await Institution.find({
        $or: [
          { adminUserId: userId.length === 24 ? userId : undefined },
          { contactEmail: userId },
        ],
      }).lean();

      if (insts.length > 0) {
        return NextResponse.json({
          success: true,
          institutions: insts,
          institution: insts[0],
        });
      }

      const userInstitutions = store.getInstitutions().filter((i) => i.userId === userId);
      return NextResponse.json({
        success: true,
        institutions: userInstitutions,
        institution: userInstitutions[0] || null,
      });
    }

    const allInsts = await Institution.find({ status: "ACTIVE" }).lean();
    if (allInsts.length > 0) {
      return NextResponse.json({ success: true, institutions: allInsts });
    }

    return NextResponse.json({ success: true, institutions: store.getInstitutions() });
  } catch (err: any) {
    console.error("GET /api/institutions error:", err);
    return NextResponse.json({ success: true, institutions: store.getInstitutions() });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.name || !body.slug) {
      return NextResponse.json(
        { success: false, error: "Name and Slug are required" },
        { status: 400 }
      );
    }

    const slug = body.slug.toLowerCase().trim();

    // Check or find Admin User
    let adminUser = null;
    if (body.userId && body.userId.length === 24) {
      adminUser = await User.findById(body.userId);
    }
    if (!adminUser) {
      adminUser = await User.findOne({ role: "ADMIN" });
    }

    let institution = await Institution.findOne({ slug });

    if (!institution) {
      institution = await Institution.create({
        name: body.name.trim(),
        nameBn: body.nameBn || null,
        slug,
        type: body.type || "COACHING",
        adminUserId: adminUser?._id,
        contactEmail: body.contactEmail || "admin@institution.edu.bd",
        phone: body.contactPhone || null,
        address: body.address || null,
        description: body.description || null,
        subscriptionPlan: body.subscriptionPlan || "FREE",
        status: "ACTIVE",
        scriptsQuota: 100,
        scriptsUsed: 0,
      });
    } else {
      institution.name = body.name.trim();
      if (body.nameBn) institution.nameBn = body.nameBn;
      if (body.type) institution.type = body.type;
      if (body.contactEmail) institution.contactEmail = body.contactEmail;
      if (body.contactPhone) institution.phone = body.contactPhone;
      if (body.address) institution.address = body.address;
      if (body.description) institution.description = body.description;
      await institution.save();
    }

    // Mirror to store
    store.createOrUpdateInstitution({
      ...body,
      userId: adminUser?._id?.toString() || "usr_teacher_01",
      contactEmail: institution.contactEmail,
    });

    return NextResponse.json({ success: true, institution });
  } catch (err: any) {
    console.error("POST /api/institutions error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to save institution" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, name, slug, contactEmail, subscriptionPlan, status } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Institution ID is required" },
        { status: 400 }
      );
    }

    const updateFields: any = {};
    if (name) updateFields.name = name;
    if (slug) updateFields.slug = slug.toLowerCase().trim();
    if (contactEmail) updateFields.contactEmail = contactEmail.toLowerCase().trim();
    if (subscriptionPlan) updateFields.subscriptionPlan = subscriptionPlan;
    if (status) updateFields.status = status;

    const updated = await Institution.findByIdAndUpdate(id, updateFields, { new: true });
    return NextResponse.json({
      success: true,
      message: "Institution updated successfully",
      institution: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "id is required" },
        { status: 400 }
      );
    }

    await Institution.findByIdAndDelete(id);
    return NextResponse.json({
      success: true,
      message: "Institution deleted successfully",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
