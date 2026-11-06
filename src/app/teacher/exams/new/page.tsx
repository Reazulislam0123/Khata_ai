"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  PlusCircle,
  Trash2,
  Save,
  BookOpen,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Building2,
  ListPlus,
  Scale,
  FileText,
  Clock,
  ChevronDown,
  Lock,
  Globe,
  Users,
  Copy,
} from "lucide-react";
import { EXAM_TYPES } from "@/lib/constants";
import { CQPart, Question, RubricPoint, Batch } from "@/lib/types";

function NewExamForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const instSlug = searchParams.get("institutionSlug") || "";

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [curriculumCode, setCurriculumCode] = useState("HSC");
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [negativeMarkingRate, setNegativeMarkingRate] = useState(0.0);
  const [accessCode, setAccessCode] = useState(
    instSlug ? `${instSlug.toUpperCase().slice(0, 4)}_${Math.floor(100 + Math.random() * 900)}` : "EXAM2026"
  );
  const [isPrivate, setIsPrivate] = useState(false);
  const [privateAccessToken, setPrivateAccessToken] = useState(
    `PVT_${Math.random().toString(36).substring(2, 8).toUpperCase()}`
  );
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOwner, setIsOwner] = useState(true);
  const [instName, setInstName] = useState("");
  const [permissionError, setPermissionError] = useState("");

  // AI Question Generator Modal State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTopic, setAiTopic] = useState("গতিবিদ্যা ও প্রাসের গতি");
  const [aiType, setAiType] = useState<"CQ" | "MCQ" | "WRITTEN">("CQ");
  const [aiDifficulty, setAiDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM");
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  useEffect(() => {
    if (instSlug) {
      fetch(`/api/institutions/${instSlug}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.institution) {
            setInstName(data.institution.name);
          }
          if (data.isOwner === false) {
            setIsOwner(false);
            setPermissionError(
              `You are not the registered creator of "${data.institution?.name || instSlug}". Only the creator can publish exams in this institution.`
            );
          } else {
            setIsOwner(true);
            setPermissionError("");
          }
        })
        .catch(() => {});

      fetch(`/api/institutions/${instSlug}/batches`)
        .then((r) => r.json())
        .then((data) => {
          if (data.batches) setBatches(data.batches);
        })
        .catch(() => {});
    }
  }, [instSlug]);

  // Questions array
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: `q_${Date.now()}_1`,
      examId: "",
      type: "CQ",
      orderIndex: 1,
      marks: 10,
      questionText: "উদ্দীপকটি পড়ে নিচের প্রশ্নগুলোর উত্তর দাও:",
      stimulusText: "একটি গতিশীল গাড়ি ও প্রাস সংক্রান্ত ব্যবহারিক পরীক্ষার তথ্য...",
      cqParts: [
        {
          part: "ka",
          bengaliLabel: "ক",
          cognitiveLevel: "জ্ঞানমূলক",
          marks: 1,
          questionText: "প্রাস কাকে বলে?",
          modelAnswer: "আনুভূমিকের সাথে কোনো কোণে শূন্যে নিক্ষিপ্ত বস্তুকে প্রাস বলে।",
          rubrics: [
            {
              id: "r1",
              criterion: "সঠিক ও পূর্ণাঙ্গ সংজ্ঞা",
              maxPoints: 1,
              description: "প্রাসের সংজ্ঞায় তীর্যক নিক্ষেপণ ও শূন্যে গতিশীল থাকার শর্ত থাকলে ১ নম্বর।",
            },
          ],
        },
        {
          part: "kha",
          bengaliLabel: "খ",
          cognitiveLevel: "অনুধাবনমূলক",
          marks: 2,
          questionText: "চলন্ত বাসের যাত্রী হঠাৎ ব্রেক কষলে সামনে ঝুঁকে পড়ে কেন? ব্যাখ্যা করো।",
          modelAnswer: "গতিজড়তার কারণে। বাসের সাথে শরীরের নিম্নাংশ স্থির হলেও ঊর্ধ্বাংশ গতি বজায় রাখতে চায়।",
          rubrics: [
            {
              id: "r2_1",
              criterion: "পয়েন্ট ১: গতিজড়তা চিহ্নিতকরণ",
              maxPoints: 1,
              description: "১ম প্যারায় গতিজড়তার প্রত্যক্ষ উল্লেখ করলে ১ নম্বর।",
            },
            {
              id: "r2_2",
              criterion: "পয়েন্ট ২: বেগ ও শরীরের অংশের বৈসাদৃশ্য",
              maxPoints: 1,
              description: "২য় প্যারায় শরীরের ঊর্ধ্বাংশ ও নিম্নাংশের আপেক্ষিক গতির বিজ্ঞানসম্মত ব্যাখ্যায় ১ নম্বর।",
            },
          ],
        },
        {
          part: "ga",
          bengaliLabel: "গ",
          cognitiveLevel: "প্রয়োগমূলক",
          marks: 3,
          questionText: "উদ্দীপক অনুসারে বস্তুটির সর্বোচ্চ উচ্চতায় পৌঁছানোর সময় নির্ণয় করো।",
          modelAnswer: "t = v₀ sinθ / g সমীকরণ প্রয়োগ করে মান বসিয়ে সঠিক এককসহ উত্তর।",
          rubrics: [
            {
              id: "r3_1",
              criterion: "পয়েন্ট ১: সঠিক সূত্র নির্ধারণ",
              maxPoints: 1,
              description: "উল্লম্ব বেগ ও সময়ের সূত্র (t = v₀ sinθ / g) লিখলে ১ নম্বর।",
            },
            {
              id: "r3_2",
              criterion: "পয়েন্ট ২: সঠিক মান প্রতিস্থাপন ও গণনা",
              maxPoints: 1,
              description: "উদ্দীপক থেকে প্রাপ্ত মান সমীকরণে বসিয়ে গণনা করলে ১ নম্বর।",
            },
            {
              id: "r3_3",
              criterion: "পয়েন্ট ৩: এককসহ চূড়ান্ত ফলাফল",
              maxPoints: 1,
              description: "সেকেণ্ড (s) এককসহ নির্ভুল ফলাফলে ১ নম্বর।",
            },
          ],
        },
        {
          part: "gha",
          bengaliLabel: "ঘ",
          cognitiveLevel: "উচ্চতর দক্ষতামূলক",
          marks: 4,
          questionText: "গাণিতিক বিশ্লেষণের মাধ্যমে শক্তির সংরক্ষণশীলতা নীতি যাচাই করে মতামত দাও।",
          modelAnswer: "সর্বোচ্চ উচ্চতা ও আদি অবস্থানে মোট শক্তি সমান (Ek + Ep = ধ্রুবক) প্রতিপাদন করে যৌক্তিক সিদ্ধান্ত।",
          rubrics: [
            {
              id: "r4_1",
              criterion: "পয়েন্ট ১: সিদ্ধান্ত উপস্থাপন",
              maxPoints: 1,
              description: "নীতিটি সংরক্ষিত থাকবে কি না সে সম্পর্কে স্পষ্ট প্রাথমিক মতামত দিলে ১ নম্বর।",
            },
            {
              id: "r4_2",
              criterion: "পয়েন্ট ২: তত্ত্বীয় ধারণা ও সমীকরণ",
              maxPoints: 1,
              description: "বিভব শক্তি ও গতিশক্তির সূত্রাবলী উপস্থাপনে ১ নম্বর।",
            },
            {
              id: "r4_3",
              criterion: "পয়েন্ট ৩: গাণিতিক প্রতিপাদন",
              maxPoints: 1,
              description: "উভয় অবস্থানে মোট শক্তির সমতা প্রমাণের গণনায় ১ নম্বর।",
            },
            {
              id: "r4_4",
              criterion: "পয়েন্ট ৪: তুলনামূলক উপসংহার",
              maxPoints: 1,
              description: "উদ্দীপকের সাথে সমন্বয় করে চূড়ান্ত সিদ্ধান্তে উপনীত হলে ১ নম্বর।",
            },
          ],
        },
      ],
    },
  ]);

  // Add CQ Question
  const addCQ = () => {
    const newQ: Question = {
      id: `q_${Date.now()}_${questions.length + 1}`,
      examId: "",
      type: "CQ",
      orderIndex: questions.length + 1,
      marks: 10,
      questionText: "উদ্দীপকটি পড়ে নিচের প্রশ্নগুলোর উত্তর দাও:",
      stimulusText: "উদ্দীপকের দৃশ্যপট, উপাত্ত বা তথ্য এখানে লিখুন...",
      cqParts: [
        {
          part: "ka",
          bengaliLabel: "ক",
          cognitiveLevel: "জ্ঞানমূলক",
          marks: 1,
          questionText: "জ্ঞানমূলক প্রশ্ন লিখুন",
          modelAnswer: "আদর্শ উত্তর",
          rubrics: [{ id: `r_${Date.now()}_1`, criterion: "সঠিক সংজ্ঞা বা তথ্য", maxPoints: 1, description: "সঠিক তথ্যে ১ নম্বর।" }],
        },
        {
          part: "kha",
          bengaliLabel: "খ",
          cognitiveLevel: "অনুধাবনমূলক",
          marks: 2,
          questionText: "অনুধাবনমূলক প্রশ্ন লিখুন",
          modelAnswer: "আদর্শ উত্তর (২ প্যারা)",
          rubrics: [
            { id: `r_${Date.now()}_2_1`, criterion: "১ম প্যারা: মূল কারণ", maxPoints: 1, description: "কারণ চিহ্নিতকরণে ১ নম্বর।" },
            { id: `r_${Date.now()}_2_2`, criterion: "২য় প্যারা: ব্যাখ্যা", maxPoints: 1, description: "যৌক্তিক ব্যাখ্যায় ১ নম্বর।" },
          ],
        },
        {
          part: "ga",
          bengaliLabel: "গ",
          cognitiveLevel: "প্রয়োগমূলক",
          marks: 3,
          questionText: "প্রয়োগমূলক প্রশ্ন লিখুন",
          modelAnswer: "সূত্র ও গাণিতিক গণনা...",
          rubrics: [
            { id: `r_${Date.now()}_3_1`, criterion: "সূত্র নির্ধারণ", maxPoints: 1, description: "সঠিক সূত্রে ১ নম্বর।" },
            { id: `r_${Date.now()}_3_2`, criterion: "মান প্রতিস্থাপন", maxPoints: 1, description: "মান বসানোতে ১ নম্বর।" },
            { id: `r_${Date.now()}_3_3`, criterion: "এককসহ উত্তর", maxPoints: 1, description: "এককসহ ফলাফলে ১ নম্বর।" },
          ],
        },
        {
          part: "gha",
          bengaliLabel: "ঘ",
          cognitiveLevel: "উচ্চতর দক্ষতামূলক",
          marks: 4,
          questionText: "উচ্চতর দক্ষতামূলক প্রশ্ন লিখুন",
          modelAnswer: "৪ ধাপের সমন্বিত মূল্যায়ন...",
          rubrics: [
            { id: `r_${Date.now()}_4_1`, criterion: "সিদ্ধান্ত", maxPoints: 1, description: "স্পষ্ট মতামতে ১ নম্বর।" },
            { id: `r_${Date.now()}_4_2`, criterion: "তত্ত্বীয় ব্যাখ্যা", maxPoints: 1, description: "তত্ত্বীয় উপস্থাপনে ১ নম্বর।" },
            { id: `r_${Date.now()}_4_3`, criterion: "গাণিতিক বিশ্লেষণ", maxPoints: 1, description: "সঠিক বিশ্লেষণে ১ নম্বর।" },
            { id: `r_${Date.now()}_4_4`, criterion: "উপসংহার", maxPoints: 1, description: "সমন্বিত সমাপনীতে ১ নম্বর।" },
          ],
        },
      ],
    };
    setQuestions([...questions, newQ]);
  };

  // Add Written / Descriptive Question with Rubric Points
  const addWrittenQuestion = () => {
    const newQ: Question = {
      id: `q_${Date.now()}_${questions.length + 1}`,
      examId: "",
      type: "DESCRIPTIVE",
      orderIndex: questions.length + 1,
      marks: 5,
      questionText: "বর্ণনামূলক প্রশ্ন লিখুন...",
      modelAnswer: "আদর্শ উত্তর বা নির্দেশিকা...",
      rubrics: [
        {
          id: `r_${Date.now()}_w1`,
          criterion: "পয়েন্ট ১: মূল তত্ত্ব ও ভিত্তি",
          maxPoints: 2,
          description: "মূল তত্ত্ব সঠিক উপস্থাপন করলে ২ নম্বর প্রদান করা হবে।",
        },
        {
          id: `r_${Date.now()}_w2`,
          criterion: "পয়েন্ট ২: প্রাসঙ্গিক উদাহরণ বা সমীকরণ",
          maxPoints: 2,
          description: "বাস্তব উদাহরণ বা সমীকরণ দিলে ২ নম্বর।",
        },
        {
          id: `r_${Date.now()}_w3`,
          criterion: "পয়েন্ট ৩: উপসংহার ও পরিচ্ছন্ন উপস্থাপন",
          maxPoints: 1,
          description: "পরিপাটি বিন্যাস ও উপসংহারে ১ নম্বর।",
        },
      ],
    };
    setQuestions([...questions, newQ]);
  };

  // Add MCQ Question
  const addMCQ = () => {
    const newQ: Question = {
      id: `q_${Date.now()}_${questions.length + 1}`,
      examId: "",
      type: "MCQ",
      orderIndex: questions.length + 1,
      marks: 1,
      questionText: "নতুন বহুনির্বাচনী প্রশ্ন লিখুন...",
      mcqOptions: [
        { id: "opt_1", text: "বিকল্প ক", isCorrect: true, explanation: "সঠিক উত্তর" },
        { id: "opt_2", text: "বিকল্প খ", isCorrect: false },
        { id: "opt_3", text: "বিকল্প গ", isCorrect: false },
        { id: "opt_4", text: "বিকল্প ঘ", isCorrect: false },
      ],
    };
    setQuestions([...questions, newQ]);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  // Rubric helpers for CQ Subparts
  const addCQPartRubric = (qIdx: number, pIdx: number) => {
    const updated = [...questions];
    const targetPart = updated[qIdx].cqParts?.[pIdx];
    if (targetPart) {
      targetPart.rubrics.push({
        id: `r_${Date.now()}`,
        criterion: "নতুন পয়েন্ট / মানদণ্ড",
        maxPoints: 1,
        description: "এই পয়েন্ট উপস্থিত থাকলে নির্ধারিত নম্বর প্রদান করা হবে।",
      });
      setQuestions(updated);
    }
  };

  const removeCQPartRubric = (qIdx: number, pIdx: number, rIdx: number) => {
    const updated = [...questions];
    const targetPart = updated[qIdx].cqParts?.[pIdx];
    if (targetPart && targetPart.rubrics.length > 1) {
      targetPart.rubrics.splice(rIdx, 1);
      setQuestions(updated);
    }
  };

  // Rubric helpers for Written Questions
  const addWrittenRubric = (qIdx: number) => {
    const updated = [...questions];
    if (!updated[qIdx].rubrics) updated[qIdx].rubrics = [];
    updated[qIdx].rubrics!.push({
      id: `r_${Date.now()}`,
      criterion: "নতুন প্রয়োজনীয় পয়েন্ট",
      maxPoints: 1,
      description: "এই শর্ত পূরণ করলে নম্বর প্রদান করা হবে।",
    });
    setQuestions(updated);
  };

  const removeWrittenRubric = (qIdx: number, rIdx: number) => {
    const updated = [...questions];
    if (updated[qIdx].rubrics && updated[qIdx].rubrics!.length > 1) {
      updated[qIdx].rubrics!.splice(rIdx, 1);
      setQuestions(updated);
    }
  };

  const handleAiGenerate = async () => {
    setIsAiGenerating(true);
    try {
      const res = await fetch("/api/questions/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subject || "Physics",
          topic: aiTopic || "গতিবিদ্যা ও বলবিদ্যা",
          curriculumCode,
          questionType: aiType,
          difficulty: aiDifficulty,
          count: 1,
        }),
      });
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions([...questions, ...data.questions]);
        setShowAiModal(false);
      } else {
        alert("Failed to generate question. Please try again.");
      }
    } catch (err) {
      alert("AI Generation error occurred.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleSaveExam = async () => {
    if (!title || !subject) {
      alert("Please fill in Exam Title and Subject");
      return;
    }

    if (!isOwner && instSlug) {
      alert(permissionError || "Permission Denied: You cannot create exams in this institution because you are not its creator.");
      return;
    }

    setIsSubmitting(true);
    const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);

    const selectedBatch = batches.find((b) => b.id === selectedBatchId);

    try {
      const res = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          subject,
          curriculumCode,
          durationMinutes: Number(durationMinutes),
          totalMarks,
          negativeMarkingRate: Number(negativeMarkingRate),
          passMarkPercentage: 33,
          isOnline: true,
          isPublished: true,
          isPublic: !isPrivate,
          isPrivate,
          privateAccessToken: isPrivate ? privateAccessToken : undefined,
          batchId: selectedBatchId || undefined,
          batchName: selectedBatch?.name,
          accessCode,
          institutionSlug: instSlug || undefined,
          questions,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (instSlug) {
          router.push(`/portal/${instSlug}`);
        } else {
          router.push("/portal");
        }
      } else {
        alert(data.error || "Failed to create exam");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while saving the exam.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-border gap-4">
        <div className="flex items-center gap-3">
          <Link
            href={instSlug ? `/portal/${instSlug}` : "/portal"}
            className="p-2 rounded-xl border border-border hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-foreground">
              Create Exam with Custom Rubric Points
            </h1>
            <p className="text-xs text-muted-foreground">
              Define questions, model answers, and exact marks for each point so AI evaluates answer sheets transparently.
            </p>
          </div>
        </div>

        <button
          onClick={handleSaveExam}
          disabled={isSubmitting || (!isOwner && !!instSlug)}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            "Publishing..."
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save & Publish Exam
            </>
          )}
        </button>
      </div>

      {/* Permission Warning if not the creator */}
      {!isOwner && instSlug && (
        <div className="p-5 rounded-2xl bg-destructive/10 border border-destructive/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-extrabold text-sm text-destructive flex items-center gap-2">
              <Lock className="h-4 w-4" /> Permission Denied for this Institution
            </h4>
            <p className="text-xs text-muted-foreground">{permissionError}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/teacher/exams/new"
              className="px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-accent text-xs font-bold text-foreground transition-all"
            >
              Create Independent Exam
            </Link>
            <Link
              href="/profile?tab=institutions"
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all"
            >
              My Institutions
            </Link>
          </div>
        </div>
      )}

      {/* Institution Association Banner if created from an Institution Portal and user is owner */}
      {isOwner && instSlug && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">
                Publishing for Institution Portal:{" "}
                <span className="text-emerald-700 dark:text-emerald-300 font-extrabold font-mono">
                  /portal/{instSlug}
                </span>
              </p>
              <p className="text-[11px] text-muted-foreground">
                This exam will be directly visible to your students on this institution's portal.
              </p>
            </div>
          </div>
          <Link
            href={`/portal/${instSlug}`}
            className="text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:underline shrink-0"
          >
            View Portal →
          </Link>
        </div>
      )}

      {/* Step 1: Basic Exam Information */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-emerald-600" />
          Step 1: Exam Basic Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Exam Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. HSC Physics 1st Paper Weekly Model Test"
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Subject / Course:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Physics / রসায়ন / Math"
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Curriculum / Exam Format:</label>
            <select
              value={curriculumCode}
              onChange={(e) => setCurriculumCode(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {EXAM_TYPES.map((type) => (
                <option key={type.id} value={type.code}>
                  {type.name} ({type.nameBn})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Time Limit (Minutes):</label>
            <input
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Negative Marking Rate:</label>
            <input
              type="number"
              step="0.05"
              value={negativeMarkingRate}
              onChange={(e) => setNegativeMarkingRate(Number(e.target.value))}
              placeholder="0.0 for Board, 0.25 for Varsity, 0.50 for BCS"
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Direct Exam Access Code:</label>
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ""))}
              placeholder="e.g. PHYS2026"
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono font-bold text-emerald-700 dark:text-emerald-400"
            />
          </div>

          {batches.length > 0 && (
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-emerald-600" />
                Assign to Institution Batch (ব্যাচ নির্বাচন):
              </label>
              <select
                value={selectedBatchId}
                onChange={(e) => setSelectedBatchId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="">All Batches & Open Students (উন্মুক্ত / সকল ব্যাচ)</option>
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.curriculumCode || "HSC"})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Exam Visibility & Privacy */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
          <label className="text-xs font-bold text-foreground block">Exam Visibility & Access Control:</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={() => setIsPrivate(false)}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                !isPrivate
                  ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-1 ring-emerald-500"
                  : "border-border bg-background hover:bg-muted/40"
              }`}
            >
              <Globe className={`h-4 w-4 mt-0.5 ${!isPrivate ? "text-emerald-600" : "text-muted-foreground"}`} />
              <div>
                <p className="text-xs font-bold text-foreground">🌐 Public Exam (উন্মুক্ত পরীক্ষা)</p>
                <p className="text-[11px] text-muted-foreground">
                  Visible on the Student Arena & Institution Portal. Any student can discover and take it.
                </p>
              </div>
            </div>

            <div
              onClick={() => setIsPrivate(true)}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                isPrivate
                  ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-1 ring-emerald-500"
                  : "border-border bg-background hover:bg-muted/40"
              }`}
            >
              <Lock className={`h-4 w-4 mt-0.5 ${isPrivate ? "text-emerald-600" : "text-muted-foreground"}`} />
              <div>
                <p className="text-xs font-bold text-foreground">🔒 Private Exam (গোপন / নির্দিষ্ট ব্যাচ লিংক)</p>
                <p className="text-[11px] text-muted-foreground">
                  Hidden from public listings. Only students with the private link can view, take, and see results.
                </p>
              </div>
            </div>
          </div>

          {isPrivate && (
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span className="font-semibold text-foreground">Private Shareable Link:</span>
                <code className="font-mono text-emerald-800 dark:text-emerald-300 font-bold bg-white dark:bg-card px-2 py-0.5 rounded border border-emerald-200">
                  /exam/{accessCode}?privateKey={privateAccessToken}
                </code>
              </div>
              <button
                type="button"
                onClick={() => {
                  const url = `${window.location.origin}/exam/${accessCode}?privateKey=${privateAccessToken}`;
                  navigator.clipboard.writeText(url);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                className="px-2.5 py-1 rounded bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 flex items-center gap-1"
              >
                {copiedLink ? <CheckCircle2 className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copiedLink ? "Copied!" : "Copy Private Link"}
              </button>
            </div>
          )}
        </div>

        {/* Live Link Preview Callout */}
        <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="text-muted-foreground font-medium">Student Direct Exam Link:</span>
            <code className="font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-white dark:bg-card px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-700">
              /exam/{accessCode || "CODE"}
            </code>
          </div>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold">
            ✓ Students take exam online or snap photos of handwritten papers
          </span>
        </div>
      </div>

      {/* Step 2: Questions & Specified Marking Rubrics */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
              <Scale className="h-5 w-5 text-emerald-600" />
              Step 2: Questions & Specified Marking Rubrics
            </h3>
            <p className="text-xs text-muted-foreground">
              Specify the model answers and the exact marks given for each required point.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAiModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-purple-300 bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 text-xs font-bold hover:bg-purple-100 transition-colors shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5 text-purple-600" />
              ✨ AI Question Generator
            </button>
            <button
              onClick={addCQ}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 transition-colors"
            >
              <PlusCircle className="h-3.5 w-3.5 text-emerald-600" />
              + Add CQ (ক, খ, গ, ঘ)
            </button>
            <button
              onClick={addWrittenQuestion}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-300 bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 transition-colors"
            >
              <PlusCircle className="h-3.5 w-3.5 text-blue-600" />
              + Add Written Question
            </button>
            <button
              onClick={addMCQ}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-foreground text-xs font-bold hover:bg-accent transition-colors"
            >
              <PlusCircle className="h-3.5 w-3.5 text-emerald-600" />
              + Add MCQ
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5"
            >
              {/* Question Header */}
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-muted text-foreground">
                    Question #{idx + 1}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {q.type === "CQ"
                      ? "Creative Question (১০ নম্বর)"
                      : q.type === "DESCRIPTIVE"
                      ? `Written / Descriptive (${q.marks} নম্বর)`
                      : "MCQ (১ নম্বর)"}
                  </span>
                </div>
                <button
                  onClick={() => removeQuestion(q.id)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title="Remove question"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* CQ TYPE */}
              {q.type === "CQ" && (
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">উদ্দীপক (Stimulus Context):</label>
                    <textarea
                      rows={2}
                      value={q.stimulusText}
                      onChange={(e) => {
                        const updated = [...questions];
                        updated[idx].stimulusText = e.target.value;
                        setQuestions(updated);
                      }}
                      className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs bengali-font focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  {/* 4 subparts: ক, খ, গ, ঘ */}
                  <div className="space-y-4">
                    {q.cqParts?.map((part, pIdx) => (
                      <div
                        key={part.part}
                        className="p-4 rounded-xl border border-border bg-muted/20 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                            {part.bengaliLabel} - {part.cognitiveLevel}
                          </span>
                          <span className="text-xs font-bold text-foreground">
                            সর্বোচ্চ নম্বর: {part.marks}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-muted-foreground">প্রশ্ন:</label>
                          <input
                            type="text"
                            value={part.questionText}
                            onChange={(e) => {
                              const updated = [...questions];
                              if (updated[idx].cqParts) {
                                updated[idx].cqParts[pIdx].questionText = e.target.value;
                                setQuestions(updated);
                              }
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs bengali-font"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-muted-foreground">আদর্শ উত্তর (Model Answer):</label>
                          <textarea
                            rows={2}
                            value={part.modelAnswer}
                            onChange={(e) => {
                              const updated = [...questions];
                              if (updated[idx].cqParts) {
                                updated[idx].cqParts[pIdx].modelAnswer = e.target.value;
                                setQuestions(updated);
                              }
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs bengali-font"
                          />
                        </div>

                        {/* Specified Rubric Points Breakdown */}
                        <div className="pt-2 border-t border-border/60 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                              <Scale className="h-3 w-3 text-emerald-600" />
                              নম্বর বরাদ্দের সুনির্দিষ্ট পয়েন্টসমূহ (Marking Rubric Points):
                            </span>
                            <button
                              type="button"
                              onClick={() => addCQPartRubric(idx, pIdx)}
                              className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                            >
                              <PlusCircle className="h-3 w-3" /> + Add Point
                            </button>
                          </div>

                          <div className="space-y-2">
                            {part.rubrics.map((r, rIdx) => (
                              <div
                                key={r.id}
                                className="p-2.5 rounded-lg border border-border bg-background flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs"
                              >
                                <input
                                  type="text"
                                  value={r.criterion}
                                  placeholder="পয়েন্ট / মানদণ্ডের নাম (e.g. গতিজড়তা চিহ্নিতকরণ)"
                                  onChange={(e) => {
                                    const updated = [...questions];
                                    if (updated[idx].cqParts) {
                                      updated[idx].cqParts[pIdx].rubrics[rIdx].criterion = e.target.value;
                                      setQuestions(updated);
                                    }
                                  }}
                                  className="flex-1 px-2.5 py-1 rounded border border-border bg-muted/20 text-xs"
                                />

                                <div className="flex items-center gap-1 shrink-0">
                                  <span className="text-[11px] text-muted-foreground font-semibold">নম্বর:</span>
                                  <input
                                    type="number"
                                    step="0.5"
                                    value={r.maxPoints}
                                    onChange={(e) => {
                                      const updated = [...questions];
                                      if (updated[idx].cqParts) {
                                        updated[idx].cqParts[pIdx].rubrics[rIdx].maxPoints = Number(e.target.value);
                                        setQuestions(updated);
                                      }
                                    }}
                                    className="w-14 px-2 py-1 rounded border border-border bg-muted/20 text-xs font-bold text-center"
                                  />
                                </div>

                                <input
                                  type="text"
                                  value={r.description}
                                  placeholder="কেন নম্বর পাবে (e.g. ১ নম্বর প্রদান)"
                                  onChange={(e) => {
                                    const updated = [...questions];
                                    if (updated[idx].cqParts) {
                                      updated[idx].cqParts[pIdx].rubrics[rIdx].description = e.target.value;
                                      setQuestions(updated);
                                    }
                                  }}
                                  className="w-full sm:w-56 px-2.5 py-1 rounded border border-border bg-muted/20 text-xs"
                                />

                                {part.rubrics.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeCQPartRubric(idx, pIdx, rIdx)}
                                    className="p-1 text-muted-foreground hover:text-destructive"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* WRITTEN / DESCRIPTIVE TYPE */}
              {q.type === "DESCRIPTIVE" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="sm:col-span-3 space-y-1">
                      <label className="text-xs font-bold text-foreground">প্রশ্ন (Question Text):</label>
                      <input
                        type="text"
                        value={q.questionText}
                        onChange={(e) => {
                          const updated = [...questions];
                          updated[idx].questionText = e.target.value;
                          setQuestions(updated);
                        }}
                        className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground">মোট নম্বর (Marks):</label>
                      <input
                        type="number"
                        value={q.marks}
                        onChange={(e) => {
                          const updated = [...questions];
                          updated[idx].marks = Number(e.target.value);
                          setQuestions(updated);
                        }}
                        className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">আদর্শ উত্তর (Model Answer):</label>
                    <textarea
                      rows={2}
                      value={q.modelAnswer || ""}
                      onChange={(e) => {
                        const updated = [...questions];
                        updated[idx].modelAnswer = e.target.value;
                        setQuestions(updated);
                      }}
                      className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  {/* Specified Rubric Points Breakdown */}
                  <div className="pt-2 border-t border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Scale className="h-3.5 w-3.5 text-blue-600" />
                        এই প্রশ্নের সুনির্দিষ্ট পয়েন্ট ও নম্বর বরাদ্দ (Specified Points & Marks):
                      </span>
                      <button
                        type="button"
                        onClick={() => addWrittenRubric(idx)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <PlusCircle className="h-3.5 w-3.5" /> + Add Point
                      </button>
                    </div>

                    <div className="space-y-2">
                      {q.rubrics?.map((r, rIdx) => (
                        <div
                          key={r.id}
                          className="p-2.5 rounded-lg border border-border bg-background flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs"
                        >
                          <input
                            type="text"
                            value={r.criterion}
                            placeholder="পয়েন্টের নাম (e.g. সূত্রের সঠিক প্রতিপাদন)"
                            onChange={(e) => {
                              const updated = [...questions];
                              if (updated[idx].rubrics) {
                                updated[idx].rubrics![rIdx].criterion = e.target.value;
                                setQuestions(updated);
                              }
                            }}
                            className="flex-1 px-2.5 py-1.5 rounded-lg border border-border bg-muted/20 text-xs"
                          />

                          <div className="flex items-center gap-1 shrink-0">
                            <span className="text-[11px] text-muted-foreground font-semibold">নম্বর:</span>
                            <input
                              type="number"
                              step="0.5"
                              value={r.maxPoints}
                              onChange={(e) => {
                                const updated = [...questions];
                                if (updated[idx].rubrics) {
                                  updated[idx].rubrics![rIdx].maxPoints = Number(e.target.value);
                                  setQuestions(updated);
                                }
                              }}
                              className="w-14 px-2 py-1.5 rounded-lg border border-border bg-muted/20 text-xs font-bold text-center"
                            />
                          </div>

                          <input
                            type="text"
                            value={r.description}
                            placeholder="শর্ত বা ব্যাখ্যা"
                            onChange={(e) => {
                              const updated = [...questions];
                              if (updated[idx].rubrics) {
                                updated[idx].rubrics![rIdx].description = e.target.value;
                                setQuestions(updated);
                              }
                            }}
                            className="w-full sm:w-60 px-2.5 py-1.5 rounded-lg border border-border bg-muted/20 text-xs"
                          />

                          {q.rubrics && q.rubrics.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeWrittenRubric(idx, rIdx)}
                              className="p-1 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* MCQ TYPE */}
              {q.type === "MCQ" && (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={q.questionText}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[idx].questionText = e.target.value;
                      setQuestions(updated);
                    }}
                    placeholder="বহুনির্বাচনী প্রশ্ন লিখুন..."
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.mcqOptions?.map((opt, oIdx) => (
                      <div
                        key={opt.id}
                        className="flex items-center gap-2 p-2.5 rounded-xl border border-border bg-background text-xs"
                      >
                        <input
                          type="radio"
                          name={`opt_${q.id}`}
                          checked={opt.isCorrect}
                          onChange={() => {
                            const updated = [...questions];
                            updated[idx].mcqOptions?.forEach((o, i) => {
                              o.isCorrect = i === oIdx;
                            });
                            setQuestions(updated);
                          }}
                        />
                        <input
                          type="text"
                          value={opt.text}
                          onChange={(e) => {
                            const updated = [...questions];
                            if (updated[idx].mcqOptions) {
                              updated[idx].mcqOptions[oIdx].text = e.target.value;
                              setQuestions(updated);
                            }
                          }}
                          className="flex-1 bg-transparent border-none focus:outline-none text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* AI Question Generator Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">AI Question Generator</h3>
                  <p className="text-[11px] text-muted-foreground">
                    Generate creative questions & point-by-point rubrics instantly
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="text-muted-foreground hover:text-foreground text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Topic or Chapter *</label>
                <input
                  type="text"
                  placeholder="e.g. গতিবিদ্যা ও প্রাসের গতি / জৈব রসায়ন / Integral Calculus"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Question Type</label>
                  <select
                    value={aiType}
                    onChange={(e) => setAiType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-semibold focus:outline-none"
                  >
                    <option value="CQ">Creative Question (ক, খ, গ, ঘ - ১০ নম্বর)</option>
                    <option value="MCQ">Multiple Choice (১ নম্বর)</option>
                    <option value="WRITTEN">Written / Descriptive (৫ নম্বর)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Difficulty Level</label>
                  <select
                    value={aiDifficulty}
                    onChange={(e) => setAiDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-semibold focus:outline-none"
                  >
                    <option value="EASY">Standard / Board Level</option>
                    <option value="MEDIUM">Challenging / College Standard</option>
                    <option value="HARD">Varsity / Engineering Competitive</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-[11px] text-purple-800 dark:text-purple-300">
                ✨ The AI will generate: Stimulus (উদ্দীপক), Sub-questions (ক-জ্ঞান, খ-অনুধাবন, গ-প্রয়োগ, ঘ-উচ্চতর দক্ষতা), model answers, and precise marks allocation rubrics.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="py-2 px-4 rounded-xl border border-border hover:bg-accent text-xs font-bold text-muted-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAiGenerate}
                disabled={isAiGenerating || !aiTopic.trim()}
                className="py-2.5 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/20 disabled:opacity-50 flex items-center gap-1.5"
              >
                {isAiGenerating ? "Generating Question..." : "Generate Question & Rubrics"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NewExamPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto p-16 text-center text-xs text-muted-foreground">
          Loading exam creator...
        </div>
      }
    >
      <NewExamForm />
    </Suspense>
  );
}
