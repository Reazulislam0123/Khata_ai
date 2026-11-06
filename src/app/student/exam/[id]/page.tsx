"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  ArrowLeft,
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Send,
} from "lucide-react";
import { Exam, SubmissionAnswer } from "@/lib/types";

export default function StudentExamArena({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(5400); // 90 mins
  const [answers, setAnswers] = useState<Record<string, SubmissionAnswer>>({});
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    "https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80",
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/exams/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.exam) {
          setExam(data.exam);
          setTimeLeftSeconds(data.exam.durationMinutes * 60);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelectMCQ = (questionId: string, optionId: string) => {
    setAnswers({
      ...answers,
      [questionId]: {
        questionId,
        selectedOptionId: optionId,
      },
    });
  };

  const handleTypeAnswer = (questionId: string, text: string) => {
    setAnswers({
      ...answers,
      [questionId]: {
        questionId,
        typedAnswer: text,
      },
    });
  };

  const handleSubmitExam = async () => {
    if (!exam) return;
    setIsSubmitting(true);

    try {
      // 1. Submit exam
      const subRes = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: exam.id,
          answers,
          answerSheetImages: uploadedPhotos,
        }),
      });
      const subData = await subRes.json();

      if (subData.submission) {
        // 2. Trigger auto-evaluation
        const evalRes = await fetch("/api/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            submissionId: subData.submission.id,
          }),
        });
        const evalData = await evalRes.json();

        // 3. Navigate to results viewer
        router.push(`/student/results/${subData.submission.id}`);
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-12 text-center text-xs text-muted-foreground">
        Loading online exam arena...
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="container mx-auto p-12 text-center text-xs text-muted-foreground">
        Exam not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/10 pb-16">
      {/* Sticky Header with Timer */}
      <div className="sticky top-16 z-40 w-full border-b border-border bg-card/95 backdrop-blur px-6 py-3 shadow-sm">
        <div className="container mx-auto max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/student"
              className="p-1.5 rounded-lg border border-border hover:bg-accent transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h2 className="text-sm font-extrabold text-foreground">{exam.title}</h2>
              <span className="text-[11px] text-muted-foreground">{exam.subject}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Countdown Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 text-white font-mono text-xs font-bold shadow-inner">
              <Clock className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
              <span>Time Left: {formatTimer(timeLeftSeconds)}</span>
            </div>

            <button
              onClick={handleSubmitExam}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-colors disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting & Evaluating...
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  Submit Exam
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Questions Container */}
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 pt-8 space-y-6">
        {/* Instructions banner */}
        <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 text-xs text-emerald-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>
              You can type written answers directly OR click the <strong>Camera</strong> icon to submit handwritten photos.
            </span>
          </div>
          <span className="font-bold">Total Marks: {exam.totalMarks}</span>
        </div>

        {/* Questions Loop */}
        {exam.questions.map((q, idx) => (
          <div
            key={q.id}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="font-extrabold text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                Question #{idx + 1} • {q.marks} Marks
              </span>
              <span className="text-xs text-muted-foreground font-semibold">
                Format: {q.type}
              </span>
            </div>

            {/* Stimulus / Prompt */}
            {q.stimulusText && (
              <div className="p-4 rounded-xl bg-muted/40 border border-border text-xs bengali-font space-y-1">
                <div className="font-bold text-foreground">উদ্দীপক (Stimulus):</div>
                <p className="text-foreground/90 leading-relaxed">{q.stimulusText}</p>
              </div>
            )}

            <p className="text-xs sm:text-sm font-semibold text-foreground leading-relaxed bengali-font">
              {q.questionText}
            </p>

            {/* MCQ Options */}
            {q.type === "MCQ" && q.mcqOptions && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {q.mcqOptions.map((opt) => {
                  const isSelected = answers[q.id]?.selectedOptionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectMCQ(q.id, opt.id)}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border text-left text-xs transition-all ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-50/60 text-emerald-950 font-bold shadow-sm"
                          : "border-border bg-background hover:bg-accent text-foreground"
                      }`}
                    >
                      <div
                        className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? "border-emerald-600 bg-emerald-600 text-white" : "border-muted-foreground"
                        }`}
                      >
                        {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </div>
                      <span>{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* CQ / Written Answer Arena */}
            {(q.type === "CQ" || q.type === "DESCRIPTIVE" || q.type === "IELTS_TASK") && (
              <div className="space-y-3 pt-2">
                {/* For CQ subparts ক, খ, গ, ঘ */}
                {q.cqParts ? (
                  <div className="space-y-4">
                    {q.cqParts.map((part) => (
                      <div key={part.part} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-foreground bengali-font">
                            {part.bengaliLabel}) {part.questionText} ({part.marks} নম্বর)
                          </span>
                        </div>
                        <textarea
                          rows={2}
                          placeholder={`Type answer for (${part.bengaliLabel}) or use handwritten camera upload below...`}
                          value={answers[`${q.id}_${part.part}`]?.typedAnswer || ""}
                          onChange={(e) => handleTypeAnswer(`${q.id}_${part.part}`, e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs bengali-font focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <textarea
                    rows={6}
                    placeholder="Type your essay or solution here..."
                    value={answers[q.id]?.typedAnswer || ""}
                    onChange={(e) => handleTypeAnswer(q.id, e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                )}

                {/* Handwrite Photo Option */}
                <div className="p-3 rounded-xl border border-dashed border-border bg-muted/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-emerald-600" />
                    <span>Have you handwritten this on paper?</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                    ✓ 1 Scanned Sheet Attached
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Bottom Submit Action */}
        <div className="pt-4 text-center">
          <button
            onClick={handleSubmitExam}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-emerald-600 font-bold text-sm text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 transition-all disabled:opacity-60"
          >
            {isSubmitting ? "Evaluating with AI..." : "Submit All Answers for AI Evaluation"}
          </button>
        </div>
      </div>
    </div>
  );
}
