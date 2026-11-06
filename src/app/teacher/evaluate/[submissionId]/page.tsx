"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Save,
  Send,
  Eye,
  Edit3,
} from "lucide-react";
import { Submission } from "@/lib/types";

export default function GradingReviewWorkspace({
  params,
}: {
  params: Promise<{ submissionId: string }>;
}) {
  const { submissionId } = use(params);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [teacherRemarks, setTeacherRemarks] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"questions" | "ocr" | "rubric">("questions");

  useEffect(() => {
    fetch(`/api/submissions/${submissionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.submission) {
          setSubmission(data.submission);
          if (data.submission.evaluation?.teacherRemarks) {
            setTeacherRemarks(data.submission.evaluation.teacherRemarks);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [submissionId]);

  const handleUpdateMarks = async (questionId: string, newMarks: number) => {
    if (!submission) return;

    try {
      const res = await fetch(`/api/submissions/${submissionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId,
          newMarks,
          remarks: teacherRemarks,
        }),
      });
      const data = await res.json();
      if (data.submission) {
        setSubmission(data.submission);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveAndPublish = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/submissions/${submissionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isApprovedByTeacher: true,
          remarks: teacherRemarks || "Verified and approved by teacher",
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Evaluation officially approved and published! Student can now view verified score & feedback.");
      } else {
        alert(data.error || "Failed to publish evaluation");
      }
    } catch {
      alert("Error approving script");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-12 text-center text-xs text-muted-foreground">
        Loading grading review workspace...
      </div>
    );
  }

  if (!submission || !submission.evaluation) {
    return (
      <div className="container mx-auto p-12 text-center text-xs text-muted-foreground">
        Submission not found or evaluation pending.
      </div>
    );
  }

  const { evaluation } = submission;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Top Workspace Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <Link
            href="/teacher"
            className="p-1.5 rounded-lg border border-border hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-extrabold text-foreground">{submission.studentName}</h2>
              <span className="text-xs text-muted-foreground">({submission.studentRoll})</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {submission.curriculumCode}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">{submission.examTitle}</p>
          </div>
        </div>

        {/* Score & Publish Button */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[11px] text-muted-foreground">Current Score:</span>
            <div className="text-base font-black text-foreground">
              {evaluation.totalScore} / {evaluation.maxScore}{" "}
              <span className="text-xs font-bold text-emerald-600">({evaluation.grade})</span>
            </div>
          </div>

          <button
            onClick={handleApproveAndPublish}
            disabled={isSaving}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors"
          >
            <CheckCircle2 className="h-4 w-4" />
            Approve & Publish to Student
          </button>
        </div>
      </div>

      {/* Main Split Screen */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left: Zoomable Answer Sheet (5 cols) */}
        <div className="lg:col-span-6 border-b lg:border-b-0 lg:border-r border-border bg-slate-950 relative flex flex-col">
          {/* Zoom Toolbar */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-black/70 backdrop-blur px-2 py-1 rounded-xl border border-white/10 text-white text-xs">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.2))}
              className="p-1 hover:bg-white/10 rounded"
              title="Zoom Out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="font-mono text-[11px]">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.2))}
              className="p-1 hover:bg-white/10 rounded"
              title="Zoom In"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 hover:bg-white/10 rounded ml-1"
              title="Reset"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Answer Sheet Container */}
          <div className="flex-1 overflow-auto p-6 flex items-center justify-center">
            <div
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: "center" }}
              className="transition-transform duration-150 relative max-w-full"
            >
              {submission.answerSheetImages[0] ? (
                <img
                  src={submission.answerSheetImages[0]}
                  alt="Student handwritten answer sheet"
                  className="rounded-lg shadow-2xl max-h-[85vh] object-contain border border-white/10"
                />
              ) : (
                <div className="text-white text-xs">No image uploaded</div>
              )}
            </div>
          </div>
        </div>

        {/* Right: AI Markings & Override Workspace (6 cols) */}
        <div className="lg:col-span-6 overflow-y-auto p-6 space-y-6 bg-card">
          {/* Legibility Alert Banner (if any) */}
          {evaluation.hasLegibilityIssues && (
            <div className="p-4 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 space-y-1">
              <div className="flex items-center gap-2 font-bold text-xs">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                ⚠️ Handwriting Legibility Alert: Manual Review Requested
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                The AI detected low-contrast or ambiguous handwriting in this submission.
                Please inspect the highlighted section and adjust marks accordingly.
              </p>
            </div>
          )}

          {/* AI Evaluator Badge & Rationale */}
          <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                AI Grading Summary ({evaluation.evaluatedBy})
              </span>
              <span className="text-emerald-600 font-bold">
                Confidence: {Math.round(evaluation.overallConfidence * 100)}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {evaluation.overallFeedback}
            </p>
          </div>

          {/* Workspace Tabs */}
          <div className="flex items-center gap-2 border-b border-border pb-2">
            <button
              onClick={() => setActiveTab("questions")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "questions"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Step Marks Breakdown
            </button>
            <button
              onClick={() => setActiveTab("ocr")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "ocr"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Vision OCR Recognized Text
            </button>
          </div>

          {activeTab === "ocr" ? (
            <div className="p-4 rounded-xl border border-border bg-background space-y-2 font-mono text-xs text-foreground">
              <div className="text-[11px] font-bold text-muted-foreground uppercase font-sans flex items-center justify-between">
                <span>Extracted Student Script Text:</span>
                <span className="text-emerald-600 font-bold">OCR Processed</span>
              </div>
              <div className="whitespace-pre-wrap leading-relaxed bg-muted/20 p-3 rounded-lg border border-border">
                {evaluation.ocrRecognizedText ||
                  evaluation.questionEvaluations[0]?.extractedText ||
                  "No text recognized in script."}
              </div>
            </div>
          ) : (
            /* Questions Evaluation Breakdown */
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Questions & Step Marks Breakdown
              </h3>

              {evaluation.questionEvaluations.map((q, idx) => (
              <div
                key={q.questionId}
                className="rounded-xl border border-border bg-background p-4 space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span className="font-extrabold text-xs text-foreground">
                    Question #{idx + 1} ({q.questionType})
                  </span>

                  {/* Teacher Mark Override Input */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground font-medium">Marks:</span>
                    <input
                      type="number"
                      step="0.5"
                      min={0}
                      max={q.maxMarks}
                      value={q.awardedMarks}
                      onChange={(e) => handleUpdateMarks(q.questionId, Number(e.target.value))}
                      className="w-16 px-2 py-0.5 rounded-lg border border-border bg-card text-center text-xs font-black text-emerald-700 focus:ring-1 focus:ring-emerald-500"
                    />
                    <span className="text-xs text-muted-foreground font-bold">/ {q.maxMarks}</span>
                  </div>
                </div>

                {/* Subparts (for CQ ক, খ, গ, ঘ) */}
                {q.cqPartEvaluations && (
                  <div className="space-y-2 pt-1">
                    {q.cqPartEvaluations.map((part) => (
                      <div
                        key={part.part}
                        className="p-3 rounded-lg bg-muted/30 border border-border/80 space-y-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {part.bengaliLabel} ({part.part.toUpperCase()})
                          </span>
                          <span className="font-bold text-foreground">
                            {part.awardedMarks} / {part.maxMarks} marks
                          </span>
                        </div>
                        <p className="text-muted-foreground text-[11px] leading-snug">
                          {part.feedback}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Rubric Scores (for IELTS or Descriptive) */}
                {q.rubricScores && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {q.rubricScores.map((r) => (
                      <div
                        key={r.rubricId}
                        className="p-2.5 rounded-lg bg-muted/30 border border-border text-[11px] space-y-1"
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span>{r.criterion}</span>
                          <span className="text-emerald-700">
                            {r.awardedPoints} / {r.maxPoints}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-[10px] leading-snug">{r.justification}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          )}

          {/* Teacher Personal Remarks */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Edit3 className="h-3.5 w-3.5 text-emerald-600" />
              Teacher Remarks / Feedback to Student:
            </label>
            <textarea
              rows={3}
              value={teacherRemarks}
              onChange={(e) => setTeacherRemarks(e.target.value)}
              placeholder="Write personal encouragement or specific study tips for this student..."
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs bengali-font focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
