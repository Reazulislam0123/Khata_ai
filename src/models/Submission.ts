// src/models/Submission.ts
import mongoose, { Document, Model, Schema } from "mongoose";

export type SubmissionStatus =
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "EVALUATING"
  | "EVALUATED"
  | "NEEDS_REVIEW";

export interface IAnswer {
  questionId: mongoose.Types.ObjectId;
  type: "MCQ" | "CQ" | "WRITTEN" | "DESCRIPTIVE" | "IELTS_TASK";
  selectedOption?: string;      // MCQ: "A" | "B" | "C" | "D"
  writtenAnswer?: string;       // typed text answer
  answerSheetImageUrls?: string[]; // Cloudinary URLs for handwritten sheets
}

export interface ISubmission extends Document {
  examId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  institutionId: mongoose.Types.ObjectId;
  status: SubmissionStatus;
  startedAt: Date;
  submittedAt?: Date;
  timeTakenSeconds?: number;
  answers: IAnswer[];
  createdAt: Date;
  updatedAt: Date;
}

const AnswerSchema = new Schema<IAnswer>(
  {
    questionId: { type: Schema.Types.ObjectId, ref: "Question", required: true },
    type: {
      type: String,
      enum: ["MCQ", "CQ", "WRITTEN", "DESCRIPTIVE", "IELTS_TASK"],
      required: true,
    },
    selectedOption: { type: String, default: null },
    writtenAnswer: { type: String, default: null },
    answerSheetImageUrls: [{ type: String }],
  },
  { _id: false }
);

const SubmissionSchema = new Schema<ISubmission>(
  {
    examId: { type: Schema.Types.ObjectId, ref: "Exam", required: true },
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    institutionId: { type: Schema.Types.ObjectId, ref: "Institution", required: true },
    status: {
      type: String,
      enum: ["IN_PROGRESS", "SUBMITTED", "EVALUATING", "EVALUATED", "NEEDS_REVIEW"],
      default: "IN_PROGRESS",
    },
    startedAt: { type: Date, default: Date.now },
    submittedAt: { type: Date, default: null },
    timeTakenSeconds: { type: Number, default: null },
    answers: [AnswerSchema],
  },
  { timestamps: true }
);

// Unique: one submission per student per exam
SubmissionSchema.index({ examId: 1, studentId: 1 }, { unique: true });
SubmissionSchema.index({ institutionId: 1, status: 1 });
SubmissionSchema.index({ studentId: 1, createdAt: -1 });

const Submission: Model<ISubmission> =
  mongoose.models.Submission ||
  mongoose.model<ISubmission>("Submission", SubmissionSchema);

export default Submission;

