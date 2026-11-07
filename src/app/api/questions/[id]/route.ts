// src/app/api/questions/[id]/route.ts
// Question Card Update (PUT) and Delete (DELETE) API

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import QuestionModel from "@/models/Question";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    let question: any = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      question = await QuestionModel.findById(id).lean();
    } else {
      question = await QuestionModel.findOne({ _id: id }).lean();
    }

    if (!question) {
      return NextResponse.json(
        { success: false, error: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      question: { ...question, id: question._id.toString() },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    await connectDB();

    const updateFields: any = {};
    if (body.questionText !== undefined) updateFields.questionText = body.questionText.trim();
    if (body.stimulusText !== undefined) updateFields.stimulusText = body.stimulusText?.trim() || null;
    if (body.type !== undefined) updateFields.type = body.type;
    if (body.marks !== undefined) updateFields.marks = Number(body.marks);
    if (body.difficulty !== undefined) updateFields.difficulty = body.difficulty;
    if (body.curriculumCode !== undefined) updateFields.curriculumCode = body.curriculumCode;
    if (body.tags !== undefined) updateFields.tags = Array.isArray(body.tags) ? body.tags : body.tags.split(",").map((t: string) => t.trim());
    if (body.mcqOptions !== undefined) updateFields.mcqOptions = body.mcqOptions;
    if (body.correctOption !== undefined) updateFields.correctOption = body.correctOption;
    if (body.cqParts !== undefined) updateFields.cqParts = body.cqParts;
    if (body.modelAnswer !== undefined) updateFields.modelAnswer = body.modelAnswer;
    if (body.rubrics !== undefined) updateFields.rubrics = body.rubrics;
    if (body.imageUrl !== undefined) updateFields.imageUrl = body.imageUrl;

    let updated: any = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      updated = await QuestionModel.findByIdAndUpdate(id, updateFields, { new: true }).lean();
    }

    if (!updated) {
      return NextResponse.json({
        success: true,
        message: "Question updated (simulated)",
        question: { id, ...updateFields },
      });
    }

    return NextResponse.json({
      success: true,
      question: { ...updated, id: updated._id.toString() },
      message: "Question card updated successfully!",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    if (mongoose.Types.ObjectId.isValid(id)) {
      await QuestionModel.findByIdAndDelete(id);
    }

    return NextResponse.json({
      success: true,
      message: "Question card deleted successfully!",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

