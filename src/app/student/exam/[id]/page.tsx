"use client";

import { useEffect, useState, use, useRef } from "react";
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
  Trash2,
  ZoomIn,
  X,
  FileCheck2,
  Image as ImageIcon,
  AlertTriangle,
} from "lucide-react";
import { Exam, SubmissionAnswer } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";

export default function StudentExamArena({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { mongoUser, firebaseUser } = useAuth();

  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(5400); // default 90 mins
  const [timerStarted, setTimerStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, SubmissionAnswer>>({});
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluatingStep, setEvaluatingStep] = useState<string>("");
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Load Exam Data & Auto-start Timer
  useEffect(() => {
    fetch(`/api/exams/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.exam) {
          setExam(data.exam);
          const duration = (data.exam.durationMinutes || 90) * 60;
          setTimeLeftSeconds(duration);
          setTimerStarted(true);
        }
      })
      .catch((err) => console.error("Error fetching exam:", err))
      .finally(() => setLoading(false));
  }, [id]);

  // Automatic Countdown Timer
  useEffect(() => {
    if (!timerStarted) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto submit when time expires
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerStarted]);

  const formatTimer = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
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

  // Photo / Camera Handlers
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedPhotos((prev) => [...prev, event.target?.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = "";
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAutoSubmit = () => {
    if (!isSubmitting) {
      handleSubmitExam();
    }
  };

  const handleSubmitExam = async () => {
    if (!exam) return;
    setIsSubmitting(true);
    setEvaluatingStep("1. Submitting your examination answers...");

    try {
      const studentName = mongoUser?.name || firebaseUser?.displayName || "Student Examinee";
      const studentEmail = mongoUser?.email || firebaseUser?.email || "student@dhakacollege.edu.bd";
      const studentRoll = mongoUser?.rollNo || "Roll 101";

      // 1. Submit exam
      const subRes = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: exam.id,
          studentName,
          studentEmail,
          studentRoll,
          answers,
          answerSheetImages: uploadedPhotos,
        }),
      });
      const subData = await subRes.json();

      if (subData.submission) {
        setEvaluatingStep("2. KhataAI Vision OCR scanning answer script...");

        // 2. Trigger auto-evaluation
        const evalRes = await fetch("/api/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            submissionId: subData.submission.id,
            studentName,
            studentRoll,
            answerSheetImages: uploadedPhotos,
          }),
        });
        const evalData = await evalRes.json();

        setEvaluatingStep("3. Finalizing marks & score breakdown...");

        // 3. Navigate to results viewer
        setTimeout(() => {
          router.push(`/student/results/${subData.submission.id}`);
        }, 600);
      }
    } catch (err) {
      console.error("Submission failed:", err);
      setIsSubmitting(false);
      setEvaluatingStep("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 space-y-3">
        <div className="h-10 w-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-muted-foreground font-semibold">
          Initializing secure exam arena & starting timer...
        </p>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="container mx-auto p-12 text-center space-y-4">
        <div className="text-xl font-bold text-foreground">Exam Not Found</div>
        <p className="text-xs text-muted-foreground">The requested exam could not be located or has ended.</p>
        <Link
          href="/student"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Student Arena
        </Link>
      </div>
    );
  }

  const isLowTime = timeLeftSeconds <= 300; // < 5 mins
  const isCriticalTime = timeLeftSeconds <= 60; // < 1 min

  return (
    <div className="min-h-screen bg-muted/10 pb-20">
      {/* Hidden File Inputs for Camera & Gallery */}
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        onChange={handlePhotoUpload}
        className="hidden"
      />
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        multiple
        onChange={handlePhotoUpload}
        className="hidden"
      />

      {/* Sticky Top Bar with Automatic Running Timer */}
      <div className="sticky top-16 z-40 w-full border-b border-border bg-card/95 backdrop-blur px-4 sm:px-6 py-3 shadow-md">
        <div className="container mx-auto max-w-5xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/student"
              className="p-2 rounded-xl border border-border hover:bg-accent transition-colors shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-foreground truncate max-w-[200px] sm:max-w-md">
                  {exam.title}
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {exam.curriculumCode || "HSC"}
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground font-medium">
                {exam.subject} • Total: {exam.totalMarks} Marks
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Automatic Countdown Timer Badge */}
            <div
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-2xl font-mono text-xs sm:text-sm font-black transition-all shadow-inner ${
                isCriticalTime
                  ? "bg-rose-600 text-white animate-pulse"
                  : isLowTime
                  ? "bg-amber-500 text-white animate-pulse"
                  : "bg-slate-900 text-emerald-400 border border-emerald-900/40"
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>{formatTimer(timeLeftSeconds)}</span>
            </div>

            {/* Quick Submit Button */}
            <button
              onClick={handleSubmitExam}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 rounded-2xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-colors disabled:opacity-60 shrink-0"
            >
              {isSubmitting ? (
                <>
                  <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="hidden sm:inline">Evaluating...</span>
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  <span>Submit Exam</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Low Time Warning Alert Banner */}
      {isLowTime && (
        <div className="bg-amber-500 text-white px-4 py-2 text-center text-xs font-bold flex items-center justify-center gap-2 animate-bounce">
          <AlertTriangle className="h-4 w-4" />
          <span>Warning: Less than 5 minutes remaining! Complete answers or photograph your script now.</span>
        </div>
      )}

      {/* Main Examination Body */}
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 pt-6 space-y-6">
        {/* Photo Upload / Camera Card Banner (Khata AI Feature) */}
        <div className="rounded-3xl border-2 border-dashed border-emerald-500/40 bg-gradient-to-r from-emerald-50/60 via-teal-50/40 to-background dark:from-emerald-950/30 dark:to-background p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-600 text-white shadow-sm">
                  <Camera className="h-5 w-5" />
                </span>
                <h3 className="text-base font-black text-foreground">
                  Take Photo / Upload Handwritten Script (খাতার ছবি আপলোড)
                </h3>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                You can write answers on physical paper, snap photos with your phone camera or webcam, and KhataAI will grade them step-by-step!
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
              >
                <Camera className="h-4 w-4" />
                <span>Take Photo</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-emerald-600 bg-white dark:bg-card hover:bg-emerald-50 text-emerald-800 dark:text-emerald-300 text-xs font-bold transition-all"
              >
                <Upload className="h-4 w-4" />
                <span>Upload Images</span>
              </button>
            </div>
          </div>

          {/* Uploaded Photos Gallery Preview */}
          {uploadedPhotos.length > 0 ? (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-300 font-bold">
                <span>📸 {uploadedPhotos.length} Script Page(s) Attached for KhataAI OCR Evaluation:</span>
                <span className="text-[11px] text-muted-foreground">Click any page to zoom</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {uploadedPhotos.map((photo, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-2xl overflow-hidden border border-border bg-card shadow-sm aspect-[3/4]"
                  >
                    <img
                      src={photo}
                      alt={`Script Page ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div
                      onClick={() => setPreviewPhoto(photo)}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white gap-1 text-[11px] font-bold"
                    >
                      <ZoomIn className="h-4 w-4" /> Zoom
                    </div>
                    <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-bold backdrop-blur-sm">
                      Page {idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-rose-600 text-white hover:bg-rose-700 shadow-md transition-all"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div
              onClick={() => cameraInputRef.current?.click()}
              className="border border-dashed border-emerald-300 dark:border-emerald-800 rounded-2xl p-4 text-center cursor-pointer hover:bg-emerald-500/5 transition-colors"
            >
              <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                📄 No script photos added yet. Click &quot;Take Photo&quot; or &quot;Upload Images&quot; to attach your answer sheets.
              </p>
            </div>
          )}
        </div>

        {/* Questions Loop */}
        <div className="space-y-6">
          {exam.questions.map((q, idx) => (
            <div
              key={q.id}
              className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    Question #{idx + 1}
                  </span>
                  <span className="text-xs font-bold text-foreground">
                    {q.marks} Marks
                  </span>
                </div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
                  Format: {q.type}
                </span>
              </div>

              {/* Stimulus / Prompt (উদ্দীপক) */}
              {q.stimulusText && (
                <div className="p-4 rounded-2xl bg-muted/40 border border-border text-xs bengali-font space-y-1">
                  <div className="font-bold text-foreground flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                    <span>📖 উদ্দীপক (Stimulus):</span>
                  </div>
                  <p className="text-foreground/90 leading-relaxed whitespace-pre-line">
                    {q.stimulusText}
                  </p>
                </div>
              )}

              {/* Question Text */}
              <p className="text-sm font-semibold text-foreground leading-relaxed bengali-font">
                {q.questionText}
              </p>

              {/* MCQ Options */}
              {q.type === "MCQ" && q.mcqOptions && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {q.mcqOptions.map((opt) => {
                    const isSelected = answers[q.id]?.selectedOptionId === opt.id;
                    return (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => handleSelectMCQ(q.id, opt.id)}
                        className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left text-xs transition-all ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-200 font-bold shadow-md shadow-emerald-500/10"
                            : "border-border bg-background hover:bg-accent text-foreground"
                        }`}
                      >
                        <div
                          className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "border-emerald-600 bg-emerald-600 text-white"
                              : "border-muted-foreground"
                          }`}
                        >
                          {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                        </div>
                        <span className="bengali-font">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* CQ / Written Answer Arena */}
              {(q.type === "CQ" || (q.type as string) === "WRITTEN" || q.type === "DESCRIPTIVE" || q.type === "IELTS_TASK") && (
                <div className="space-y-4 pt-2">
                  {/* For CQ Subparts ক, খ, গ, ঘ */}
                  {q.cqParts && q.cqParts.length > 0 ? (
                    <div className="space-y-4">
                      {q.cqParts.map((part) => (
                        <div key={part.part} className="space-y-1.5 p-3.5 rounded-2xl bg-muted/20 border border-border/70">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-foreground bengali-font">
                              ({part.bengaliLabel}) {part.questionText}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              {part.marks} নম্বর
                            </span>
                          </div>
                          <textarea
                            rows={2}
                            placeholder={`Type answer for (${part.bengaliLabel}) or write on paper and upload photo above...`}
                            value={answers[`${q.id}_${part.part}`]?.typedAnswer || ""}
                            onChange={(e) => handleTypeAnswer(`${q.id}_${part.part}`, e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs bengali-font focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <textarea
                      rows={5}
                      placeholder="Type your mathematical derivation, explanation or essay here, or snap a photo of your paper above..."
                      value={answers[q.id]?.typedAnswer || ""}
                      onChange={(e) => handleTypeAnswer(q.id, e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-border bg-background text-xs bengali-font focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Submission Bar */}
        <div className="p-6 rounded-3xl bg-card border border-border text-center space-y-3 shadow-md">
          <p className="text-xs text-muted-foreground">
            Make sure all answers are written or photographed before submitting. KhataAI will grade and provide instant feedback!
          </p>
          <button
            type="button"
            onClick={handleSubmitExam}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-10 py-3.5 rounded-2xl bg-emerald-600 font-bold text-sm text-white shadow-xl shadow-emerald-600/30 hover:bg-emerald-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2 mx-auto"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{evaluatingStep || "Evaluating Exam with KhataAI..."}</span>
              </>
            ) : (
              <>
                <FileCheck2 className="h-4 w-4" />
                <span>Submit Exam & Check Result with KhataAI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {previewPhoto && (
        <div
          onClick={() => setPreviewPhoto(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] bg-card rounded-3xl p-3 border border-border shadow-2xl flex flex-col items-center"
          >
            <button
              onClick={() => setPreviewPhoto(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors z-10"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={previewPhoto}
              alt="Script Preview"
              className="max-h-[80vh] w-auto object-contain rounded-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
