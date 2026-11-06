// src/models/Exam.ts
import mongoose, { Document, Model, Schema } from "mongoose";

export type ExamStatus = "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ENDED";

export interface IExamQuestion {
  questionId: mongoose.Types.ObjectId;
  allocatedMarks: number;
  orderIndex: number;
}

export interface IExam extends Document {
  institutionId: mongoose.Types.ObjectId;
  subjectId?: mongoose.Types.ObjectId;
  batchId?: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  title: string;
  instructions?: string;
  curriculumCode: string;
  status: ExamStatus;
  accessCode?: string;
  durationMinutes: number;
  totalMarks: number;
  passMarkPercentage: number;
  negativeMarkingRate: number;
  scheduledStart?: Date;
  scheduledEnd?: Date;
  isOnline: boolean;
  questions: IExamQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const ExamQuestionSchema = new Schema<IExamQuestion>(
  {
    questionId: { type: Schema.Types.ObjectId, ref: "Question", required: true },
    allocatedMarks: { type: Number, required: true },
    orderIndex: { type: Number, required: true },
  },
  { _id: false }
);

const ExamSchema = new Schema<IExam>(
  {
    institutionId: { type: Schema.Types.ObjectId, ref: "Institution", required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", default: null },
    batchId: { type: Schema.Types.ObjectId, ref: "Batch", default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    instructions: { type: String, default: null },
    curriculumCode: { type: String, required: true, default: "HSC" },
    status: {
      type: String,
      enum: ["DRAFT", "SCHEDULED", "PUBLISHED", "ENDED"],
      default: "DRAFT",
    },
    accessCode: { type: String, default: null },
    durationMinutes: { type: Number, required: true, default: 60 },
    totalMarks: { type: Number, required: true, default: 100 },
    passMarkPercentage: { type: Number, default: 33 },
    negativeMarkingRate: { type: Number, default: 0 },
    scheduledStart: { type: Date, default: null },
    scheduledEnd: { type: Date, default: null },
    isOnline: { type: Boolean, default: true },
    questions: [ExamQuestionSchema],
  },
  { timestamps: true }
);

ExamSchema.index({ institutionId: 1, status: 1, scheduledStart: -1 });
ExamSchema.index({ batchId: 1, status: 1 });

const Exam: Model<IExam> =
  mongoose.models.Exam || mongoose.model<IExam>("Exam", ExamSchema);

export default Exam;

