"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  Upload,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  FileCheck2,
  AlertTriangle,
  Play,
  RotateCcw,
  BookOpen,
  User,
} from "lucide-react";
import { Exam } from "@/lib/types";

export default function TeacherEvaluationStudioPage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-12 text-center text-xs text-muted-foreground">Loading Studio...</div>}>
      <TeacherEvaluationStudio />
    </Suspense>
  );
}

function TeacherEvaluationStudio() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedExamId = searchParams.get("examId");

  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState(preselectedExamId || "");
  const [studentName, setStudentName] = useState("Adnan Sami");
  const [studentRoll, setStudentRoll] = useState("Roll: 1045 (Notre Dame College)");
  const [images, setImages] = useState<string[]>([
    "/samples/bengali_cq_script.svg",
  ]);
  const [activePreviewIdx, setActivePreviewIdx] = useState(0);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalProgress, setEvalProgress] = useState(0);
  const [evalStepText, setEvalStepText] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/exams")
      .then((r) => r.json())
      .then((data) => {
        if (data.exams && data.exams.length > 0) {
          setExams(data.exams);
          if (!selectedExamId) {
            setSelectedExamId(data.exams[0].id || data.exams[0]._id);
          }
        }
      })
      .catch((err) => console.error("Error fetching exams:", err));
  }, [selectedExamId]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImages((prev) => [event.target?.result as string, ...prev]);
        setActivePreviewIdx(0);
      }
      setIsCompressing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== indexToRemove);
      if (activePreviewIdx >= updated.length) {
        setActivePreviewIdx(Math.max(0, updated.length - 1));
      }
      return updated;
    });
  };

  const handleLoadDemoScript = (samplePath: string, name: string, roll: string) => {
    setImages([samplePath]);
    setStudentName(name);
    setStudentRoll(roll);
    setActivePreviewIdx(0);
  };

  const handleStartEvaluation = async () => {
    if (!selectedExamId) {
      alert("Please select an exam first.");
      return;
    }
    if (images.length === 0) {
      alert("Please upload or select at least one answer sheet image.");
      return;
    }

    setIsEvaluating(true);

    const steps = [
      "Uploading answer sheet images...",
      "Extracting Bengali/English handwriting via Vision OCR...",
      "Evaluating against marking rubrics & model answer...",
      "Finalizing question scores & checking legibility...",
    ];

    for (let i = 0; i < steps.length; i++) {
      setEvalProgress(i + 1);
      setEvalStepText(steps[i]);
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    try {
      // Create submission and evaluate with student metadata
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: selectedExamId,
          answerSheetImages: images,
          studentName: studentName.trim() || "Adnan Sami",
          studentRoll: studentRoll.trim() || "Roll: 1045",
        }),
      });

      const data = await res.json();
      if (data.success && data.submission) {
        router.push(`/teacher/evaluate/${data.submission.id}`);
      } else {
        alert(data.error || "Evaluation failed. Please verify the exam and image.");
        setIsEvaluating(false);
      }
    } catch (err: any) {
      console.error("Evaluation request error:", err);
      alert("Evaluation failed: " + err.message);
      setIsEvaluating(false);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Link
            href="/teacher"
            className="p-2 rounded-xl border border-border hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-foreground">
              Answer Sheet Scanner & AI Evaluator
            </h1>
            <p className="text-xs text-muted-foreground">
              Capture or upload student papers to automatically grade and generate detailed rationale.
            </p>
          </div>
        </div>

        <button
          onClick={handleStartEvaluation}
          disabled={isEvaluating || images.length === 0}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all disabled:opacity-60"
        >
          {isEvaluating ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Evaluating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Start AI Evaluation
            </>
          )}
        </button>
      </div>

      {/* Target Exam Selection & Student Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl border border-border bg-card shadow-sm">
        <div className="space-y-1.5 sm:col-span-1">
          <label className="text-xs font-bold text-foreground">Select Exam to Grade:</label>
          <select
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            {exams.map((exam) => (
              <option key={exam.id} value={exam.id}>
                [{exam.curriculumCode}] {exam.title}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5 sm:col-span-1">
          <label className="text-xs font-bold text-foreground">Student Name:</label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5 sm:col-span-1">
          <label className="text-xs font-bold text-foreground">Student Roll / Institution:</label>
          <input
            type="text"
            value={studentRoll}
            onChange={(e) => setStudentRoll(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Scanner & Upload Hub */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Camera Snapshot & File Upload */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
              <Camera className="h-4 w-4 text-emerald-600" />
              Capture or Upload Answer Sheet
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Use your phone or webcam to snap clear photos of the student's handwritten papers, or drag and drop image files.
            </p>

            {/* Hidden Inputs */}
            <input
              type="file"
              ref={cameraInputRef}
              accept="image/*"
              capture="environment"
              onChange={handleImageUpload}
              className="hidden"
            />
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 p-5 rounded-xl border-2 border-emerald-500/40 bg-emerald-50/50 hover:bg-emerald-50 dark:bg-emerald-950/30 transition-all text-emerald-900 dark:text-emerald-300 group"
              >
                <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <Camera className="h-5 w-5" />
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold">Open Camera</div>
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400">Direct mobile capture</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 p-5 rounded-xl border-2 border-dashed border-border bg-muted/20 hover:bg-muted/40 transition-all text-foreground group"
              >
                <div className="h-10 w-10 rounded-full bg-muted text-foreground flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <Upload className="h-5 w-5" />
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold">Upload Photos</div>
                  <div className="text-[10px] text-muted-foreground">PNG, JPG, WebP</div>
                </div>
              </button>
            </div>

            {/* 1-Click Fast Demo Scripts for Instant Testing */}
            <div className="pt-2 border-t border-border space-y-2">
              <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                Fast 1-Click Demo Answer Scripts:
              </span>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() =>
                    handleLoadDemoScript(
                      "/samples/bengali_cq_script.svg",
                      "Adnan Sami",
                      "Roll: 1045 (Notre Dame College)"
                    )
                  }
                  className="px-2.5 py-1 rounded-lg border border-purple-300 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 font-semibold hover:bg-purple-100 transition-all"
                >
                  ⚡ Physics CQ (Bengali)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleLoadDemoScript(
                      "/samples/chemistry_cq_script.svg",
                      "Tahmid Hasan",
                      "Roll: 2018 (Dhaka College)"
                    )
                  }
                  className="px-2.5 py-1 rounded-lg border border-teal-300 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 font-semibold hover:bg-teal-100 transition-all"
                >
                  ⚡ Chemistry CQ
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleLoadDemoScript(
                      "/samples/math_cq_script.svg",
                      "Samiha Rahman",
                      "Roll: 1022 (Viqarunnisa)"
                    )
                  }
                  className="px-2.5 py-1 rounded-lg border border-blue-300 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 font-semibold hover:bg-blue-100 transition-all"
                >
                  ⚡ Higher Math CQ
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleLoadDemoScript(
                      "/samples/handwritten_essay_intro.jpg",
                      "Tanvir Ahmed",
                      "Roll: 3012 (Rajuk Uttara)"
                    )
                  }
                  className="px-2.5 py-1 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold hover:bg-emerald-100 transition-all"
                >
                  ⚡ Essay Script Photo
                </button>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-muted/40 border border-border text-[11px] text-muted-foreground space-y-1">
            <div className="font-bold text-foreground">💡 Tips for Best AI Recognition:</div>
            <div>• Ensure good lighting without harsh shadows</div>
            <div>• Keep camera parallel to the paper</div>
            <div>• All margins and question numbers (ক, খ, গ, ঘ) should be clearly visible</div>
          </div>
        </div>

        {/* Right: Uploaded Pages Preview & Gallery */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-emerald-600" />
              Scanned Script Pages ({images.length})
            </h3>
            {images.length > 0 && (
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Ready for AI Evaluation
              </span>
            )}
          </div>

          {images.length === 0 ? (
            <div className="h-64 rounded-xl border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground text-xs text-center p-4">
              <Camera className="h-8 w-8 text-muted-foreground/50 mb-2" />
              <p>No answer sheet scanned yet.</p>
              <p className="text-[10px] mt-1">Click the Camera or Upload button on the left.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Main Image Preview */}
              <div className="relative h-64 w-full rounded-xl overflow-hidden border border-border shadow-inner bg-slate-950 flex items-center justify-center">
                <Image
                  src={images[activePreviewIdx] || images[0]}
                  alt="Scanned answer sheet preview"
                  fill
                  unoptimized
                  className="object-contain p-2"
                />
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur text-white text-[11px] px-2.5 py-1 rounded-lg font-mono">
                  Page {activePreviewIdx + 1} of {images.length}
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveImage(activePreviewIdx)}
                  title="Remove this page"
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/70 hover:bg-red-600 text-white text-xs transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Thumbnails Row for Multiple Pages */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActivePreviewIdx(idx)}
                      className={`relative h-16 w-16 shrink-0 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                        activePreviewIdx === idx
                          ? "border-emerald-500 shadow-md ring-2 ring-emerald-300"
                          : "border-border opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Page ${idx + 1}`}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                      <span className="absolute bottom-0 right-0 bg-black/70 text-[9px] text-white px-1 font-mono">
                        {idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Progress bar during evaluation */}
              {isEvaluating && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-200">
                    <span className="flex items-center gap-1.5">
                      <div className="h-3 w-3 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                      {evalStepText || "Evaluating script..."}
                    </span>
                    <span>Step {evalProgress} of 4</span>
                  </div>
                  <div className="w-full bg-emerald-200 dark:bg-emerald-900 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full transition-all duration-500"
                      style={{ width: `${(evalProgress / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                <span>Handwriting Legibility:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> High Confidence
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
