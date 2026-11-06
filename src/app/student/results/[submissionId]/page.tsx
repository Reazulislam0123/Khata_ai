"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Award,
  Sparkles,
  HelpCircle,
  AlertCircle,
  FileText,
  Lightbulb,
  MessageSquare,
  Camera,
  ZoomIn,
  X,
  ExternalLink,
} from "lucide-react";
import { Submission } from "@/lib/types";

export default function TransparentScriptViewer({
  params,
}: {
  params: Promise<{ submissionId: string }>;
}) {
  const { submissionId } = use(params);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/submissions/${submissionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.submission) setSubmission(data.submission);
      })
      .finally(() => setLoading(false));
  }, [submissionId]);

  if (loading) {
    return (
      <div className="container mx-auto p-12 text-center text-xs text-muted-foreground">
        Loading evaluated script and answer sheet photos...
      </div>
    );
  }

  if (!submission || !submission.evaluation) {
    return (
      <div className="container mx-auto p-12 text-center text-xs text-muted-foreground">
        Graded script not available yet.
      </div>
    );
  }

  const { evaluation } = submission;

  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className="p-2 rounded-xl border border-border hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-foreground">
                Graded Script & Score Breakdown
              </h1>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Transparent AI Evaluation
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {submission.examTitle} • Student: <strong>{submission.studentName}</strong> {submission.studentRoll && `(${submission.studentRoll})`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 rounded-xl border border-border bg-card hover:bg-accent text-xs font-bold text-foreground flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <FileText className="h-3.5 w-3.5 text-emerald-600" /> Print / Save PDF
          </button>
          <Link
            href="/student"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
          >
            All Exams →
          </Link>
        </div>
      </div>

      {/* Hero Score Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-card via-emerald-50/20 to-card border border-emerald-500/20 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Total Marks Obtained
            </span>
            <div className="text-4xl sm:text-5xl font-black text-foreground">
              {evaluation.totalScore}{" "}
              <span className="text-2xl font-bold text-muted-foreground">/ {evaluation.maxScore}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Percentage: <strong className="text-foreground">{evaluation.percentage}%</strong>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-muted-foreground font-semibold">National Grade:</div>
              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{evaluation.grade}</div>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-emerald-600 text-white flex flex-col items-center justify-center font-extrabold shadow-lg shadow-emerald-600/25">
              <span className="text-[10px] uppercase font-bold opacity-80">GPA</span>
              <span className="text-lg leading-none">{evaluation.gpa.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* AI Confidence & Examiner Info */}
        <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 font-medium text-foreground">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            Evaluated by: <strong>{evaluation.evaluatedBy}</strong>
          </span>
          {evaluation.isApprovedByTeacher ? (
            <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="h-3.5 w-3.5" /> ✅ Verified & Officially Approved by Teacher
            </span>
          ) : (
            <span className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> High Precision Step-Matching
            </span>
          )}
        </div>
      </div>

      {/* Prominent Answer Sheet Photo Card */}
      {submission.answerSheetImages && submission.answerSheetImages.length > 0 && (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-emerald-600" />
              <h2 className="text-base font-extrabold text-foreground">
                Submitted Answer Sheet Photos ({submission.answerSheetImages.length} Pages)
              </h2>
            </div>
            <span className="text-xs text-muted-foreground">Click any photo to zoom</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {submission.answerSheetImages.map((img, i) => (
              <div
                key={i}
                onClick={() => setSelectedPhoto(img)}
                className="relative rounded-2xl overflow-hidden border border-border bg-muted/30 cursor-pointer group hover:border-emerald-500 transition-all shadow-sm"
              >
                <img
                  src={img}
                  alt={`Student Answer Sheet Page ${i + 1}`}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-1.5 text-xs font-bold">
                  <ZoomIn className="h-4 w-4" /> Click to View Full Size
                </div>
                <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/70 text-white text-[11px] font-semibold backdrop-blur-sm">
                  📄 Page {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Photo Modal Zoom Viewer */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] bg-card rounded-3xl p-4 overflow-hidden border border-border shadow-2xl flex flex-col items-center"
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors z-10"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={selectedPhoto}
              alt="Answer Sheet Full View"
              className="max-h-[80vh] w-auto object-contain rounded-2xl"
            />
            <p className="text-xs text-muted-foreground mt-3">
              Full-resolution optical scan evaluated by AI Vision
            </p>
          </div>
        </div>
      )}

      {/* Teacher Remarks Card (if available) */}
      {evaluation.teacherRemarks && (
        <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/60 dark:bg-emerald-950/20 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-300">
            <MessageSquare className="h-4 w-4 text-emerald-600" />
            Teacher's Feedback & Remarks:
          </div>
          <p className="text-xs sm:text-sm text-emerald-950 dark:text-emerald-100 leading-relaxed bengali-font font-medium">
            "{evaluation.teacherRemarks}"
          </p>
        </div>
      )}

      {/* Evaluated Questions Breakdown & Point Rationale */}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-black text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-600" />
            Transparent Step-by-Step Marking & Point Rationale
          </h2>
          <p className="text-xs text-muted-foreground">
            Exact breakdown of marks earned, specific points present, and reasons for marks awarded or deducted.
          </p>
        </div>

        {evaluation.questionEvaluations.map((q, idx) => (
          <div
            key={q.questionId}
            className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="font-extrabold text-xs text-foreground bg-muted px-2.5 py-1 rounded">
                Question #{idx + 1} ({q.questionType})
              </span>
              <div className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400">
                {q.awardedMarks} / {q.maxMarks} marks
              </div>
            </div>

            {/* CQ Subparts (ক, খ, গ, ঘ) */}
            {q.cqPartEvaluations ? (
              <div className="space-y-4">
                {q.cqPartEvaluations.map((part) => (
                  <div
                    key={part.part}
                    className="p-4 rounded-2xl border border-border bg-muted/20 space-y-3.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                        {part.bengaliLabel} - {part.part.toUpperCase()}
                      </span>
                      <span className="font-bold text-xs text-foreground">
                        {part.awardedMarks} / {part.maxMarks} marks
                      </span>
                    </div>

                    {/* Student Extracted Answer */}
                    <div className="space-y-1 text-xs">
                      <div className="font-bold text-foreground">What you wrote (খাতায় যা লেখা ছিল):</div>
                      <p className="text-muted-foreground p-3 rounded-xl bg-background border border-border bengali-font italic leading-relaxed">
                        "{part.extractedStudentText}"
                      </p>
                    </div>

                    {/* AI Explanation & Feedback */}
                    <div className="space-y-1 text-xs">
                      <div className="font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        Why you got this mark (মার্ক প্রাপ্তির কারণ):
                      </div>
                      <p className="text-xs text-foreground leading-relaxed bengali-font bg-emerald-50/50 dark:bg-emerald-950/20 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/60">
                        {part.feedback}
                      </p>
                    </div>

                    {/* Rubric Points with Mark Allocation */}
                    {part.rubricScores && part.rubricScores.length > 0 && (
                      <div className="pt-2 border-t border-border/80 space-y-1.5">
                        <div className="text-[10px] font-bold text-muted-foreground uppercase">
                          Specific Points Evaluated:
                        </div>
                        <div className="space-y-1">
                          {part.rubricScores.map((r) => (
                            <div
                              key={r.rubricId}
                              className="flex flex-wrap items-center justify-between text-xs p-2 rounded-lg bg-background border border-border gap-2"
                            >
                              <span className="text-foreground font-medium">{r.criterion}</span>
                              <span className="font-bold text-emerald-700 dark:text-emerald-400 text-xs">
                                +{r.awardedPoints} / {r.maxPoints} pts ({r.justification})
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-xs bg-muted/40 p-3 rounded-xl space-y-1">
                  <span className="font-bold text-foreground">AI Evaluator Feedback:</span>
                  <p className="text-xs text-foreground leading-relaxed">{q.feedback}</p>
                </div>
                {q.rubricScores && q.rubricScores.length > 0 && (
                  <div className="pt-2 border-t border-border/80 space-y-1.5">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase">
                      Specific Points Evaluated:
                    </div>
                    <div className="space-y-1">
                      {q.rubricScores.map((r) => (
                        <div
                          key={r.rubricId}
                          className="flex flex-wrap items-center justify-between text-xs p-2.5 rounded-xl bg-background border border-border gap-2"
                        >
                          <span className="text-foreground font-medium">{r.criterion}</span>
                          <span className="font-bold text-emerald-700 dark:text-emerald-400 text-xs">
                            +{r.awardedPoints} / {r.maxPoints} pts ({r.justification})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {q.improvementTips && (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Recommendation for improvement:</strong> {q.improvementTips}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
