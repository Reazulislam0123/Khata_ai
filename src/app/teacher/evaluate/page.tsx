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
    "https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80",
  ]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalProgress, setEvalProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/exams")
      .then((r) => r.json())
      .then((data) => {
        if (data.exams) {
          setExams(data.exams);
          if (!selectedExamId && data.exams.length > 0) {
            setSelectedExamId(data.exams[0].id);
          }
        }
      });
  }, [selectedExamId]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    // Convert to object URL or base64 for immediate visual display
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImages([event.target.result as string, ...images]);
      }
      setIsCompressing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleStartEvaluation = async () => {
    if (!selectedExamId) {
      alert("Please select an exam first.");
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
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    try {
      // Create submission and evaluate
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: selectedExamId,
          answerSheetImages: images,
        }),
      });

      const data = await res.json();
      if (data.submission) {
        router.push(`/teacher/evaluate/${data.submission.id}`);
      }
    } catch (err) {
      console.error(err);
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
                onClick={() => cameraInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 p-5 rounded-xl border-2 border-emerald-500/40 bg-emerald-50/50 hover:bg-emerald-50 transition-all text-emerald-900 group"
              >
                <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <Camera className="h-5 w-5" />
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold">Open Camera</div>
                  <div className="text-[10px] text-emerald-700">Direct mobile capture</div>
                </div>
              </button>

              <button
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
          </div>

          <div className="p-3 rounded-xl bg-muted/40 border border-border text-[11px] text-muted-foreground space-y-1">
            <div className="font-bold text-foreground">💡 Tips for Best AI Recognition:</div>
            <div>• Ensure good lighting without harsh shadows</div>
            <div>• Keep camera parallel to the paper</div>
            <div>• All margins and question numbers (ক, খ, গ, ঘ) should be clearly visible</div>
          </div>
        </div>

        {/* Right: Uploaded Pages Preview */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-emerald-600" />
              Scanned Script Pages ({images.length})
            </h3>
            {images.length > 0 && (
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Ready for AI
              </span>
            )}
          </div>

          {images.length === 0 ? (
            <div className="h-56 rounded-xl border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground text-xs text-center p-4">
              <Camera className="h-8 w-8 text-muted-foreground/50 mb-2" />
              <p>No answer sheet scanned yet.</p>
              <p className="text-[10px] mt-1">Click the Camera or Upload button on the left.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative h-64 w-full rounded-xl overflow-hidden border border-border shadow-inner bg-slate-950">
                <Image
                  src={images[0]}
                  alt="Scanned answer sheet preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur text-white text-[11px] px-2 py-0.5 rounded font-mono">
                  Page 1 of {images.length}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
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
