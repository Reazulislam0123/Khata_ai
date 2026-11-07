// src/models/Question.ts
import mongoose, { Document, Model, Schema } from "mongoose";

// ── Subdocument interfaces ────────────────────────────────────────────────────

export interface IMCQOption {
  label: "A" | "B" | "C" | "D";
  text: string;
}

export interface IRubricCriterion {
  criterion: string;
  maxPoints: number;
  description: string;
  keywords: string[];
}

export interface ICQPart {
  part: "ka" | "kha" | "ga" | "gha";
  bengaliLabel: string;
  marks: number;
  questionText: string;
  modelAnswer: string;
  rubrics: IRubricCriterion[];
}

// ── Main Question interface ───────────────────────────────────────────────────

export type QuestionType = "MCQ" | "CQ" | "WRITTEN" | "DESCRIPTIVE" | "IELTS_TASK";
export type DifficultyLevel = "EASY" | "MEDIUM" | "HARD";

export interface IQuestion extends Document {
  institutionId?: mongoose.Types.ObjectId;
  subjectId?: mongoose.Types.ObjectId;
  createdBy?: mongoose.Types.ObjectId;
  type: QuestionType;
  questionText: string;
  stimulusText?: string;
  imageUrl?: string;
  marks: number;
  difficulty: DifficultyLevel;
  bloomsLevel?: string;
  tags: string[];
  curriculumCode?: string;

  // MCQ specific
  mcqOptions?: IMCQOption[];
  correctOption?: "A" | "B" | "C" | "D";

  // CQ specific
  cqParts?: ICQPart[];

  // Written / Descriptive / IELTS
  modelAnswer?: string;
  rubrics?: IRubricCriterion[];
  ieltsTaskType?: "TASK_1" | "TASK_2";
  ieltsMinWords?: number;

  aiGenerated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ── Subdocument schemas ───────────────────────────────────────────────────────

const MCQOptionSchema = new Schema<IMCQOption>(
  { label: { type: String, enum: ["A", "B", "C", "D"] }, text: { type: String } },
  { _id: false }
);

const RubricCriterionSchema = new Schema<IRubricCriterion>(
  {
    criterion: { type: String, required: true },
    maxPoints: { type: Number, required: true },
    description: { type: String, default: "" },
    keywords: [{ type: String }],
  },
  { _id: false }
);

const CQPartSchema = new Schema<ICQPart>(
  {
    part: { type: String, enum: ["ka", "kha", "ga", "gha"] },
    bengaliLabel: { type: String },
    marks: { type: Number },
    questionText: { type: String },
    modelAnswer: { type: String, default: "" },
    rubrics: [RubricCriterionSchema],
  },
  { _id: false }
);

// ── Main Question schema ──────────────────────────────────────────────────────

const QuestionSchema = new Schema<IQuestion>(
  {
    institutionId: { type: Schema.Types.ObjectId, ref: "Institution", default: null },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    type: {
      type: String,
      enum: ["MCQ", "CQ", "WRITTEN", "DESCRIPTIVE", "IELTS_TASK"],
      required: true,
    },
    questionText: { type: String, required: true },
    stimulusText: { type: String, default: null },
    imageUrl: { type: String, default: null },
    marks: { type: Number, required: true },
    difficulty: { type: String, enum: ["EASY", "MEDIUM", "HARD"], default: "MEDIUM" },
    bloomsLevel: { type: String, default: null },
    tags: [{ type: String }],
    curriculumCode: { type: String, default: null },

    // MCQ
    mcqOptions: [MCQOptionSchema],
    correctOption: { type: String, enum: ["A", "B", "C", "D"], default: null },

    // CQ
    cqParts: [CQPartSchema],

    // Written / IELTS
    modelAnswer: { type: String, default: null },
    rubrics: [RubricCriterionSchema],
    ieltsTaskType: { type: String, enum: ["TASK_1", "TASK_2"], default: null },
    ieltsMinWords: { type: Number, default: null },

    aiGenerated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

QuestionSchema.index({ institutionId: 1, subjectId: 1, type: 1 });
QuestionSchema.index({ institutionId: 1, difficulty: 1 });
QuestionSchema.index({ tags: 1 });

const Question: Model<IQuestion> =
  mongoose.models.Question || mongoose.model<IQuestion>("Question", QuestionSchema);

export default Question;

