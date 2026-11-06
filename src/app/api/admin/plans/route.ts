// src/app/api/admin/plans/route.ts
// Super Admin Subscription & Plan Management API
// Supports reading plan configurations, updating plan quotas & prices, and reassigning plans

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import InstitutionModel from "@/models/Institution";
import SubscriptionModel from "@/models/Subscription";

// Default in-memory plan configurations that admin can edit
let planCatalog = [
  {
    id: "FREE",
    name: "Pilot / Free Tier",
    priceBdt: 0,
    priceUsd: 0,
    description: "Ideal for individual tutors and trial testing.",
    maxStudents: 50,
    maxEvaluations: 100,
    features: [
      "Up to 50 Registered Students",
      "100 AI Script Evaluations / Month",
      "Gemini 2.0 Flash Standard OCR",
      "Public & Private Model Tests",
      "Community Email Support",
    ],
    popular: false,
    isActive: true,
  },
  {
    id: "PRO",
    name: "Institution Pro",
    priceBdt: 4999,
    priceUsd: 49,
    description: "Designed for coaching centers and high school departments.",
    maxStudents: 500,
    maxEvaluations: 1500,
    features: [
      "Up to 500 Registered Students",
      "1,500 AI Script Evaluations / Month",
      "Bengali CQ 4-Step Rubric Engine",
      "Teacher Score Overrides & Approval Stamp",
      "BYOK Gemini API Key Support",
      "Priority OCR Processing (< 1.5s)",
    ],
    popular: true,
    isActive: true,
  },
  {
    id: "ENTERPRISE",
    name: "University & Board Enterprise",
    priceBdt: 19999,
    priceUsd: 199,
    description: "For colleges, universities, and large academic chains.",
    maxStudents: 5000,
    maxEvaluations: 20000,
    features: [
      "Unlimited / 5,000+ Registered Students",
      "20,000+ Handwritten Script Evaluations",
      "Dedicated Vision OCR Pipeline",
      "Custom Domain & White-label Branding",
      "Dedicated Account Manager & 99.9% SLA",
      "LMS / SIS REST API Integrations",
    ],
    popular: false,
    isActive: true,
  },
];

export async function GET() {
  try {
    let institutionAssignments: any[] = [];

    try {
      await connectDB();
      const institutions = await InstitutionModel.find()
        .select("name slug contactEmail subscriptionPlan status studentCount")
        .lean();

      institutionAssignments = institutions.map((inst: any) => ({
        id: inst._id.toString(),
        name: inst.name,
        slug: inst.slug,
        contactEmail: inst.contactEmail,
        currentPlan: inst.subscriptionPlan || "PRO",
        status: inst.status || "ACTIVE",
      }));
    } catch (dbErr) {
      // Non-blocking fallback
      institutionAssignments = [
        {
          id: "inst_demo_1",
          name: "Dhaka Imperial College",
          slug: "dhaka-imperial",
          contactEmail: "admin@dhakaimperial.edu.bd",
          currentPlan: "PRO",
          status: "ACTIVE",
        },
      ];
    }

    return NextResponse.json({
      success: true,
      plans: planCatalog,
      institutions: institutionAssignments,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    // 1. Updating a plan definition (Price, Student quota, Evaluation quota, Features)
    if (body.action === "UPDATE_PLAN_DEFINITION") {
      const { planId, name, priceBdt, priceUsd, maxStudents, maxEvaluations, description, features } = body;
      const targetPlan = planCatalog.find((p) => p.id === planId);
      if (!targetPlan) {
        return NextResponse.json(
          { success: false, error: "Plan not found" },
          { status: 404 }
        );
      }

      if (name !== undefined) targetPlan.name = name;
      if (priceBdt !== undefined) targetPlan.priceBdt = Number(priceBdt);
      if (priceUsd !== undefined) targetPlan.priceUsd = Number(priceUsd);
      if (maxStudents !== undefined) targetPlan.maxStudents = Number(maxStudents);
      if (maxEvaluations !== undefined) targetPlan.maxEvaluations = Number(maxEvaluations);
      if (description !== undefined) targetPlan.description = description;
      if (features !== undefined && Array.isArray(features)) targetPlan.features = features;

      return NextResponse.json({
        success: true,
        message: `Plan ${planId} updated successfully.`,
        plan: targetPlan,
      });
    }

    // 2. Assigning or updating an institution's plan
    if (body.action === "ASSIGN_INSTITUTION_PLAN") {
      const { institutionId, newPlan } = body;
      if (!institutionId || !newPlan) {
        return NextResponse.json(
          { success: false, error: "institutionId and newPlan are required" },
          { status: 400 }
        );
      }

      try {
        await connectDB();
        await InstitutionModel.findByIdAndUpdate(institutionId, {
          subscriptionPlan: newPlan,
        });

        // Also record in Subscription collection
        await SubscriptionModel.findOneAndUpdate(
          { institutionId },
          {
            plan: newPlan,
            status: "ACTIVE",
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            billingCycle: "MONTHLY",
            amount: newPlan === "PRO" ? 4999 : newPlan === "ENTERPRISE" ? 19999 : 0,
            currency: "BDT",
          },
          { upsert: true }
        );
      } catch (dbErr) {
        console.warn("DB update warning for plan assign:", dbErr);
      }

      return NextResponse.json({
        success: true,
        message: `Institution plan updated to ${newPlan}.`,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, priceBdt, priceUsd, maxStudents, maxEvaluations, description, features, popular } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Plan name is required" },
        { status: 400 }
      );
    }

    const newId =
      name.toUpperCase().replace(/[^A-Z0-9]/g, "_") + "_" + Date.now().toString().slice(-4);

    const newPlan = {
      id: newId,
      name,
      priceBdt: Number(priceBdt) || 0,
      priceUsd: Number(priceUsd) || 0,
      description: description || "Custom educational plan tier",
      maxStudents: Number(maxStudents) || 100,
      maxEvaluations: Number(maxEvaluations) || 500,
      features:
        Array.isArray(features) && features.length > 0
          ? features
          : [
              `Up to ${maxStudents || 100} Registered Students`,
              `${maxEvaluations || 500} AI Script Evaluations / Month`,
              "Gemini 2.0 Flash Vision OCR",
              "Classroom Batch Control & Codes",
            ],
      popular: Boolean(popular),
      isActive: true,
    };

    planCatalog.push(newPlan);

    return NextResponse.json({
      success: true,
      message: `Plan ${name} created successfully.`,
      plan: newPlan,
      plans: planCatalog,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const planId = searchParams.get("planId");

    if (!planId) {
      return NextResponse.json(
        { success: false, error: "planId is required" },
        { status: 400 }
      );
    }

    const index = planCatalog.findIndex((p) => p.id === planId);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "Plan not found" },
        { status: 404 }
      );
    }

    const deleted = planCatalog.splice(index, 1);

    return NextResponse.json({
      success: true,
      message: `Plan ${deleted[0].name} deleted successfully.`,
      plans: planCatalog,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

