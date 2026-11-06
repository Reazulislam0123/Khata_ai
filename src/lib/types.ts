export type UserRole = "STUDENT" | "TEACHER" | "ADMIN";

export type InstitutionType = "COACHING" | "SCHOOL" | "COLLEGE" | "VARSITY" | "INDIVIDUAL";

export interface InstitutionProfile {
  id: string;
  userId: string;
  name: string;
  nameBn?: string;
  slug: string;
  type: InstitutionType;
  description: string;
  logoUrl?: string;
  bannerUrl?: string;
  contactEmail: string;
  contactPhone: string;
  address?: string;
  subscriptionPlan: "FREE" | "TEACHER_PRO" | "COACHING_ULTRA" | "VARSITY_ENTERPRISE";
  scriptsQuota: number;
  scriptsUsed: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  institution?: string;
  institutionSlug?: string;
  avatarUrl?: string;
  phone?: string;
}

export type CurriculumCategory = "BANGLADESHI_NATIONAL" | "VARSITY_ADMISSION" | "JOB_RECRUITMENT" | "INTERNATIONAL" | "CUSTOM";

export interface ExamTypeConfig {
  id: string;
  code: string;
  name: string;
  nameBn: string;
  category: CurriculumCategory;
  defaultNegativeMarking: number;
  hasCQ: boolean;
  hasMCQ: boolean;
  hasDescriptive: boolean;
  hasPractical: boolean;
  description: string;
  descriptionBn: string;
}

export type QuestionType = "MCQ" | "CQ" | "DESCRIPTIVE" | "IELTS_TASK";

export interface MCQOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface RubricPoint {
  id: string;
  criterion: string;
  maxPoints: number;
  description: string;
  keywords?: string[];
}

export interface CQPart {
  part: "ka" | "kha" | "ga" | "gha";
  bengaliLabel: string;
  cognitiveLevel: "জ্ঞানমূলক" | "অনুধাবনমূলক" | "প্রয়োগমূলক" | "উচ্চতর দক্ষতামূলক";
  marks: number;
  questionText: string;
  modelAnswer: string;
  rubrics: RubricPoint[];
}

export interface Question {
  id: string;
  examId: string;
  type: QuestionType;
  orderIndex: number;
  marks: number;
  questionText: string;
  stimulusText?: string; // উদ্দীপক for CQ
  imageUrl?: string;
  
  // MCQ fields
  mcqOptions?: MCQOption[];
  
  // CQ fields (4 distinct sub-questions totaling 10 marks)
  cqParts?: CQPart[];
  
  // Descriptive / IELTS fields
  modelAnswer?: string;
  rubrics?: RubricPoint[];
  ieltsTaskType?: "TASK_1" | "TASK_2";
  ieltsMinWords?: number;
}

export interface Batch {
  id: string;
  institutionSlug: string;
  name: string;
  description?: string;
  curriculumCode?: string;
  createdAt: string;
  enrolledStudentsCount?: number;
}

export interface EnrolledStudent {
  id: string;
  batchId: string;
  batchName?: string;
  institutionSlug: string;
  studentName: string;
  studentRoll: string;
  studentEmail?: string;
  studentPhone?: string;
  enrolledAt: string;
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  curriculumCode: string; // 'SSC', 'HSC', 'IELTS', 'DU_A', 'BUET', 'BCS', etc.
  creatorId: string;
  creatorName: string;
  totalMarks: number;
  durationMinutes: number;
  isOnline: boolean;
  isPublished: boolean;
  negativeMarkingRate: number;
  passMarkPercentage: number;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
  accessCode?: string;
  isPublic?: boolean;
  isPrivate?: boolean;
  privateAccessToken?: string;
  institutionSlug?: string;
  batchId?: string;
  batchName?: string;
}

export interface SubmissionAnswer {
  questionId: string;
  typedAnswer?: string;
  selectedOptionId?: string; // For MCQ
  handwrittenImageUrls?: string[]; // Multi-page answer images
}

export interface RubricScoreItem {
  rubricId: string;
  criterion: string;
  awardedPoints: number;
  maxPoints: number;
  justification: string;
}

export interface CQPartEvaluation {
  part: "ka" | "kha" | "ga" | "gha";
  bengaliLabel: string;
  awardedMarks: number;
  maxMarks: number;
  extractedStudentText: string;
  feedback: string;
  rubricScores: RubricScoreItem[];
  modelAnswer: string;
}

export interface QuestionEvaluation {
  questionId: string;
  questionType: QuestionType;
  awardedMarks: number;
  maxMarks: number;
  extractedText?: string;
  legibilityScore: number; // 0.0 to 1.0
  isIllegible: boolean;
  legibilityNote?: string;
  feedback: string;
  improvementTips?: string;
  modelAnswer?: string;
  rubricScores?: RubricScoreItem[];
  cqPartEvaluations?: CQPartEvaluation[];
  isFlaggedForTeacherReview: boolean;
  flagReason?: string;
}

export interface EvaluationResult {
  id: string;
  submissionId: string;
  evaluatedBy: string; // e.g. "Google Gemini 3.8 Flash" or "Teacher Override"
  aiModelId: string;
  aiProvider: string;
  evaluatedAt: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  grade: string; // 'A+', 'A', '5.0', 'Band 7.5', etc.
  gpa: number;
  overallConfidence: number; // 0.0 to 1.0
  overallFeedback: string;
  hasLegibilityIssues: boolean;
  legibilitySummary?: string;
  teacherRemarks?: string;
  isApprovedByTeacher: boolean;
  ocrRecognizedText?: string;
  questionEvaluations: QuestionEvaluation[];
}

export interface Submission {
  id: string;
  examId: string;
  examTitle: string;
  subject: string;
  curriculumCode: string;
  studentId: string;
  studentName: string;
  studentRoll?: string;
  studentEmail?: string;
  batchId?: string;
  batchName?: string;
  institutionSlug?: string;
  submittedAt: string;
  status: "PENDING_EVALUATION" | "EVALUATING" | "EVALUATED" | "NEEDS_REVIEW";
  answerSheetImages: string[];
  answers: Record<string, SubmissionAnswer>;
  evaluation?: EvaluationResult;
}

export interface AIModelDefinition {
  id: string;
  name: string;
  provider: "google" | "openai" | "anthropic" | "xai" | "deepseek" | "custom";
  description: string;
  releaseDate: string;
  recommendedFor: string;
  isVisionCapable: boolean;
  tier: "flagship" | "fast" | "reasoning" | "custom";
  badge?: string;
}

export interface AIProviderConfig {
  provider: "google" | "openai" | "anthropic" | "xai" | "deepseek" | "custom";
  apiKey: string;
  baseUrl?: string;
  selectedModelId: string;
  isActive: boolean;
}

export interface GlobalAISettings {
  defaultProvider: "google" | "openai" | "anthropic" | "xai" | "deepseek" | "custom";
  defaultModelId: string;
  providers: Record<string, AIProviderConfig>;
  perCurriculumOverrides: Record<string, { provider: string; modelId: string }>;
  fallbackEnabled: boolean;
}
