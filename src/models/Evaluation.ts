// src/models/Evaluation.ts
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IRubricScore {
  criterion: string;
  pointsAwarded: number;
  maxPoints: number;
  feedback: string;
}

export interface IQuestionBreakdown {
  questionId: mongoose.Types.ObjectId;
  type: string;
  marksAwarded: number;
  maxMarks: number;
  isCorrect?: boolean;         // MCQ only
  selectedOption?: string;     // MCQ: student's answer
  correctOption?: string;      // MCQ: correct answer
  rubricScores?: IRubricScore[]; // Written/CQ
  extractedText?: string;      // OCR text from answer sheet
  aiFeedback: string;
  confidence: number;          // 0.0 - 1.0
  isFlaggedForReview: boolean;
  flagReason?: string;
}

export interface IEvaluation extends Document {
  submissionId: mongoose.Types.ObjectId;
  examId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  institutionId: mongoose.Types.ObjectId;

  aiProvider: string;
  aiModelId: string;
  evaluatedAt: Date;
  overallConfidence: number;
  hasLegibilityIssues: boolean;
  legibilitySummary?: string;

  questionBreakdown: IQuestionBreakdown[];

  totalScore: number;
  maxScore: number;
  percentage: number;
  grade: string;
  gpa: number;
  overallFeedback: string;

  isApprovedByTeacher: boolean;
  teacherRemarks?: string;
  teacherApprovedAt?: Date;
  teacherApprovedBy?: mongoose.Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const RubricScoreSchema = new Schema<IRubricScore>(
  {
    criterion: String,
    pointsAwarded: Number,
    maxPoints: Number,
    feedback: String,
  },
  { _id: false }
);

const QuestionBreakdownSchema = new Schema<IQuestionBreakdown>(
  {
    questionId: { type: Schema.Types.ObjectId, ref: "Question" },
    type: String,
    marksAwarded: Number,
    maxMarks: Number,
    isCorrect: { type: Boolean, default: null },
    selectedOption: { type: String, default: null },
    correctOption: { type: String, default: null },
    rubricScores: [RubricScoreSchema],
    extractedText: { type: String, default: null },
    aiFeedback: { type: String, default: "" },
    confidence: { type: Number, default: 1.0 },
    isFlaggedForReview: { type: Boolean, default: false },
    flagReason: { type: String, default: null },
  },
  { _id: false }
);

const EvaluationSchema = new Schema<IEvaluation>(
  {
    submissionId: { type: Schema.Types.ObjectId, ref: "Submission", required: true, unique: true },
    examId: { type: Schema.Types.ObjectId, ref: "Exam", required: true },
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    institutionId: { type: Schema.Types.ObjectId, ref: "Institution", required: true },

    aiProvider: { type: String, default: "google" },
    aiModelId: { type: String, default: "gemini-pro" },
    evaluatedAt: { type: Date, default: Date.now },
    overallConfidence: { type: Number, default: 1.0 },
    hasLegibilityIssues: { type: Boolean, default: false },
    legibilitySummary: { type: String, default: null },

    questionBreakdown: [QuestionBreakdownSchema],

    totalScore: { type: Number, required: true },
    maxScore: { type: Number, required: true },
    percentage: { type: Number, required: true },
    grade: { type: String, required: true },
    gpa: { type: Number, default: 0 },
    overallFeedback: { type: String, default: "" },

    isApprovedByTeacher: { type: Boolean, default: false },
    teacherRemarks: { type: String, default: null },
    teacherApprovedAt: { type: Date, default: null },
    teacherApprovedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

EvaluationSchema.index({ institutionId: 1, isApprovedByTeacher: 1 });
EvaluationSchema.index({ studentId: 1, createdAt: -1 });
EvaluationSchema.index({ examId: 1 });

const Evaluation: Model<IEvaluation> =
  mongoose.models.Evaluation ||
  mongoose.model<IEvaluation>("Evaluation", EvaluationSchema);

export default Evaluation;

