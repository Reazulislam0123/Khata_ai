"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  ArrowRight,
  Sparkles,
  Play,
  KeyRound,
  Filter,
  GraduationCap,
  History,
  FileText,
  User,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  School,
} from "lucide-react";
import { Exam, Submission } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";

export default function StudentArenaPage() {
  const router = useRouter();
  const { mongoUser, firebaseUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"exams" | "my-batch" | "history" | "code">("exams");
  const [exams, setExams] = useState<Exam[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCurriculum, setSelectedCurriculum] = useState<string>("ALL");
  const [privateCode, setPrivateCode] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [examsRes, subsRes] = await Promise.all([
          fetch("/api/exams"),
          fetch("/api/submissions"),
        ]);
        const examsData = await examsRes.json();
        const subsData = await subsRes.json();

        if (examsData.exams) setExams(examsData.exams);
        if (subsData.submissions) setSubmissions(subsData.submissions);
      } catch (err) {
        console.error("Failed loading student portal data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleEnterPrivateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!privateCode.trim()) return;
    router.push(`/exam/${privateCode.trim().toUpperCase()}`);
  };

  const curricula = [
    { id: "ALL", label: "All Public Exams" },
    { id: "HSC", label: "HSC (উচ্চ মাধ্যমিক)" },
    { id: "SSC", label: "SSC (মাধ্যমিক)" },
    { id: "DU_A", label: "DU 'Ka' Admission (ঢাবি)" },
    { id: "BUET", label: "BUET Written (বুয়েট)" },
    { id: "BCS", label: "BCS Exam (বিসিএস)" },
    { id: "IELTS", label: "IELTS Writing" },
  ];

  const filteredExams =
    selectedCurriculum === "ALL"
      ? exams
      : exams.filter((e) => e.curriculumCode === selectedCurriculum);

  // Calculate quick student stats
  const evaluatedSubs = submissions.filter((s) => s.evaluation);
  const avgScore =
    evaluatedSubs.length > 0
      ? Math.round(
          evaluatedSubs.reduce(
            (acc, s) => acc + (s.evaluation?.percentage || 0),
            0
          ) / evaluatedSubs.length
        )
      : 0;

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-8">
      {/* Top Banner & Student Overview */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              KHATA AI • Student Examination Arena
            </div>
            {mongoUser?.subscriptionStatus === "PENDING_APPROVAL" ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold animate-pulse">
                <Clock className="h-3.5 w-3.5" /> Plan Upgrade Pending Admin Review
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
                <CheckCircle2 className="h-3.5 w-3.5" /> Plan: {mongoUser?.plan || "FREE"} (Active)
              </div>
            )}
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {mongoUser || firebaseUser
              ? `Welcome, ${mongoUser?.name || firebaseUser?.displayName || firebaseUser?.email?.split("@")[0]}`
              : "Take Official Model Tests & Get AI Evaluated"}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Practice with official HSC, SSC, University Admission (DU, BUET), BCS, and IELTS exams.
            Submit typed responses or snap photos of your handwritten answer scripts for instant, step-by-step AI grading.
          </p>
        </div>

        {/* Quick Student Stat Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10 mt-6 relative z-10">
          <div className="bg-white/10 backdrop-blur rounded-2xl p-3 border border-white/10">
            <div className="text-[11px] text-emerald-200">Exams Taken</div>
            <div className="text-xl sm:text-2xl font-black">{submissions.length}</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-3 border border-white/10">
            <div className="text-[11px] text-emerald-200">Average Score</div>
            <div className="text-xl sm:text-2xl font-black">{avgScore > 0 ? `${avgScore}%` : "N/A"}</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-3 border border-white/10">
            <div className="text-[11px] text-emerald-200">Graded Scripts</div>
            <div className="text-xl sm:text-2xl font-black">{evaluatedSubs.length}</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-3 border border-white/10">
            <div className="text-[11px] text-emerald-200">Active Curricula</div>
            <div className="text-xl sm:text-2xl font-black">7 Streams</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("exams")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "exams"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "bg-card border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookOpen className="h-4 w-4" />
          Official Model Tests ({exams.length})
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "history"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "bg-card border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          <History className="h-4 w-4" />
          My Graded Scripts ({submissions.length})
        </button>

        <button
          onClick={() => setActiveTab("code")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "code"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "bg-card border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          <KeyRound className="h-4 w-4" />
          Enter Private Code
        </button>
      </div>

      {/* TAB 1: OFFICIAL MODEL TESTS */}
      {activeTab === "exams" && (
        <div className="space-y-6">
          {/* Quick Code Bar */}
          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-card p-4 sm:p-5 shadow-sm">
            <form onSubmit={handleEnterPrivateExam} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-foreground">
                    Have a Private Coaching or College Exam Code?
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Enter your exam access code (e.g. <code>BATCH2026</code>) to begin test immediately.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={privateCode}
                  onChange={(e) => setPrivateCode(e.target.value.toUpperCase())}
                  placeholder="e.g. HSC2026"
                  className="px-3.5 py-2 rounded-xl border border-border bg-background text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase focus:ring-2 focus:ring-emerald-500 focus:outline-none w-full sm:w-44"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                >
                  <Play className="h-3.5 w-3.5 fill-white" />
                  Enter Arena
                </button>
              </div>
            </form>
          </div>

          {/* Curriculum Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {curricula.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCurriculum(c.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCurriculum === c.id
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Public Exams Grid */}
          {loading ? (
            <div className="p-16 text-center text-xs text-muted-foreground">
              Loading public examination catalog...
            </div>
          ) : filteredExams.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border border-dashed border-border bg-card space-y-2">
              <p className="text-sm font-bold text-foreground">No exams found for this category.</p>
              <p className="text-xs text-muted-foreground">Try selecting "All Public Exams" above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredExams.map((exam) => (
                <div
                  key={exam.id}
                  className="p-6 rounded-3xl border border-border bg-card shadow-sm hover:border-emerald-300 hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {exam.curriculumCode}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" /> {exam.durationMinutes} mins
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-foreground group-hover:text-emerald-600 transition-colors line-clamp-2">
                        {exam.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{exam.subject}</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-border text-xs text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>
                        Total Marks: <strong className="text-foreground">{exam.totalMarks}</strong>
                      </span>
                      <span>
                        Negative:{" "}
                        <strong className="text-foreground">
                          {exam.negativeMarkingRate ? `-${exam.negativeMarkingRate}` : "None"}
                        </strong>
                      </span>
                    </div>

                    <Link
                      href={`/exam/${exam.accessCode || exam.id}`}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
                    >
                      <Play className="h-3.5 w-3.5 fill-white" />
                      <span>Take Exam Now</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY GRADED SCRIPTS */}
      {activeTab === "history" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-600" />
                Evaluated Answer Scripts & Mark Sheets ({submissions.length})
              </h2>
              <p className="text-xs text-muted-foreground">
                Click any script to inspect AI line-by-line grading, rubrics, and feedback.
              </p>
            </div>
          </div>

          {submissions.length === 0 ? (
            <div className="p-16 text-center rounded-3xl border border-dashed border-border bg-card space-y-3">
              <Award className="h-10 w-10 text-muted-foreground mx-auto" />
              <p className="text-sm font-bold text-foreground">No exam submissions yet.</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Take any public model test or enter your teacher's private exam code to get your first AI-evaluated score sheet.
              </p>
              <button
                onClick={() => setActiveTab("exams")}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md"
              >
                Browse Model Tests
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {submissions.map((sub) => {
                const evalData = sub.evaluation;
                return (
                  <div
                    key={sub.id}
                    className="p-5 rounded-2xl border border-border bg-card hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {sub.curriculumCode || "HSC"}
                        </span>
                        <h3 className="font-bold text-sm text-foreground">{sub.examTitle}</h3>
                        <p className="text-xs text-muted-foreground">
                          {sub.subject} • Submitted: {new Date(sub.submittedAt).toLocaleDateString()}
                        </p>
                      </div>

                      {evalData ? (
                        <div className="text-right shrink-0">
                          <div className="text-2xl font-black text-foreground">
                            {evalData.totalScore}
                            <span className="text-xs text-muted-foreground">/{evalData.maxScore}</span>
                          </div>
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Grade: {evalData.grade} (GPA {evalData.gpa.toFixed(1)})
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">
                          Evaluating
                        </span>
                      )}
                    </div>

                    <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Candidate: <strong>{sub.studentName}</strong>
                      </span>
                      <Link
                        href={`/student/results/${sub.id}`}
                        className="inline-flex items-center gap-1 font-bold text-emerald-600 hover:text-emerald-700"
                      >
                        Inspect Graded Khata <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PRIVATE CODE PORTAL */}
      {activeTab === "code" && (
        <div className="max-w-xl mx-auto rounded-3xl border border-border bg-card p-8 shadow-sm space-y-6 text-center">
          <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 mx-auto flex items-center justify-center">
            <KeyRound className="h-7 w-7" />
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-black text-foreground">Enter Private Classroom Exam</h2>
            <p className="text-xs text-muted-foreground">
              Teachers provide access codes (e.g. <code>BATCH2026</code>) for private batch examinations.
            </p>
          </div>

          <form onSubmit={handleEnterPrivateExam} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Exam Access Code:</label>
              <input
                type="text"
                required
                value={privateCode}
                onChange={(e) => setPrivateCode(e.target.value.toUpperCase())}
                placeholder="e.g. BATCH2026 or HSC2026"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm font-mono font-bold text-center tracking-widest uppercase focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Play className="h-4 w-4 fill-white" />
              Start Private Exam Session
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
