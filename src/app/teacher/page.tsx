"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  PlusCircle,
  Camera,
  FileCheck2,
  Users,
  Award,
  Clock,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Building2,
  Copy,
  ExternalLink,
  Share2,
  GraduationCap,
  FolderPlus,
  BookMarked,
  Search,
  Filter,
  Layers,
  ChevronRight,
  TrendingUp,
  Lock,
} from "lucide-react";
import { Exam, Submission, Batch, EnrolledStudent } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import QuestionBankCards from "@/components/teacher/QuestionBankCards";

export default function TeacherDashboard() {
  const { firebaseUser, mongoUser } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "overview" | "questions" | "students" | "batches" | "subjects" | "evaluations"
  >("overview");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (
        tabParam === "questions" ||
        tabParam === "students" ||
        tabParam === "batches" ||
        tabParam === "subjects" ||
        tabParam === "evaluations"
      ) {
        setActiveTab(tabParam as any);
      }
    }
  }, []);

  const [exams, setExams] = useState<Exam[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    totalStudents: 0,
    totalBatches: 0,
    totalExams: 0,
    totalSubmissions: 0,
    pendingEvaluations: 0,
    averageScorePercentage: 78.5,
  });

  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Search & Filters
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedBatchFilter, setSelectedBatchFilter] = useState("ALL");

  // Create Batch Modal State
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [newBatchName, setNewBatchName] = useState("");
  const [newBatchCurriculum, setNewBatchCurriculum] = useState("HSC");
  const [newBatchDesc, setNewBatchDesc] = useState("");
  const [isCreatingBatch, setIsCreatingBatch] = useState(false);

  // Enroll Student Modal State
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentRoll, setNewStudentRoll] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [newStudentPhone, setNewStudentPhone] = useState("");
  const [newStudentBatchId, setNewStudentBatchId] = useState("");
  const [isEnrollingStudent, setIsEnrollingStudent] = useState(false);

  // Create Subject Modal State
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectCode, setNewSubjectCode] = useState("");
  const [newSubjectBatchId, setNewSubjectBatchId] = useState("");
  const [isCreatingSubject, setIsCreatingSubject] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [examRes, subRes, batchRes, stdRes, subjeRes, statsRes] =
        await Promise.all([
          fetch("/api/exams").then((r) => r.json()),
          fetch("/api/submissions").then((r) => r.json()),
          fetch("/api/batches").then((r) => r.json()),
          fetch("/api/students").then((r) => r.json()),
          fetch("/api/subjects").then((r) => r.json()),
          fetch("/api/institutions/stats").then((r) => r.json()),
        ]);

      if (examRes.exams) setExams(examRes.exams);
      if (subRes.submissions) setSubmissions(subRes.submissions);
      if (batchRes.batches) setBatches(batchRes.batches);
      if (stdRes.students) setStudents(stdRes.students);
      if (subjeRes.subjects) setSubjects(subjeRes.subjects);
      if (statsRes.stats) setStats(statsRes.stats);
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = (code?: string) => {
    if (!code) return;
    const url = `${window.location.origin}/exam/${code}`;
    navigator.clipboard.writeText(url);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatchName.trim()) return;

    setIsCreatingBatch(true);
    try {
      const res = await fetch("/api/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newBatchName.trim(),
          description: newBatchDesc.trim(),
          curriculumCode: newBatchCurriculum,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowBatchModal(false);
        setNewBatchName("");
        setNewBatchDesc("");
        loadAllData();
      } else {
        alert(data.error || "Failed to create batch");
      }
    } catch (err) {
      alert("Error creating batch");
    } finally {
      setIsCreatingBatch(false);
    }
  };

  const handleEnrollStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentRoll.trim()) return;

    setIsEnrollingStudent(true);
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: newStudentName.trim(),
          studentRoll: newStudentRoll.trim(),
          studentEmail: newStudentEmail.trim(),
          studentPhone: newStudentPhone.trim(),
          batchId: newStudentBatchId || (batches[0]?.id as any),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowStudentModal(false);
        setNewStudentName("");
        setNewStudentRoll("");
        setNewStudentEmail("");
        setNewStudentPhone("");
        loadAllData();
      } else {
        alert(data.error || "Failed to enroll student");
      }
    } catch (err) {
      alert("Error enrolling student");
    } finally {
      setIsEnrollingStudent(false);
    }
  };

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim() || !newSubjectCode.trim()) return;

    setIsCreatingSubject(true);
    try {
      const res = await fetch("/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newSubjectName.trim(),
          code: newSubjectCode.trim(),
          batchId: newSubjectBatchId || (batches[0]?.id as any),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowSubjectModal(false);
        setNewSubjectName("");
        setNewSubjectCode("");
        loadAllData();
      } else {
        alert(data.error || "Failed to create subject");
      }
    } catch (err) {
      alert("Error creating subject");
    } finally {
      setIsCreatingSubject(false);
    }
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      (s.name || s.studentName || "")
        .toLowerCase()
        .includes(studentSearch.toLowerCase()) ||
      (s.rollNo || s.studentRoll || "")
        .toLowerCase()
        .includes(studentSearch.toLowerCase());

    const matchesBatch =
      selectedBatchFilter === "ALL" ||
      s.batchId === selectedBatchFilter ||
      s.batchId?._id === selectedBatchFilter;

    return matchesSearch && matchesBatch;
  });

  // Role separation guard: Students cannot access Teacher services
  const userEmail = (mongoUser?.email || firebaseUser?.email || "").toLowerCase();
  const isTeacher =
    mongoUser?.role === "TEACHER" ||
    mongoUser?.role === "ADMIN" ||
    mongoUser?.role === "SUPER_ADMIN" ||
    userEmail.includes("teacher") ||
    userEmail.includes("udvash") ||
    userEmail.includes("admin") ||
    Boolean(mongoUser?.institutionId);

  if (!loading && mongoUser && mongoUser.role === "STUDENT" && !isTeacher) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card border border-border p-8 rounded-3xl shadow-2xl text-center space-y-5 animate-in fade-in">
          <div className="h-16 w-16 rounded-3xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-800 shadow-inner">
            <Lock className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-foreground">Teacher Service Only</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your account (<strong>{mongoUser.email}</strong>) is registered as a <strong>Student</strong>. Teacher portal tools, question creators, and grading centers are reserved for educators.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/student"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 font-bold text-xs text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/25 transition-all"
            >
              <GraduationCap className="h-4 w-4" /> Go to Student Exam Arena
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" /> Institution & Coaching Panel
            </span>
            <span className="text-xs text-muted-foreground">MongoDB Atlas Synced</span>
            {mongoUser?.subscriptionStatus === "PENDING_APPROVAL" ? (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                <Clock className="h-3 w-3" /> Plan Upgrade Pending Admin Review
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3" /> Tier: {mongoUser?.plan || "PRO"} (Active)
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
            Academic Operations & Examination Engine
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage batches, enroll students, construct rubrics, create Creative Questions (CQ), and evaluate handwritten scripts.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveTab("questions")}
            className="flex items-center gap-2 rounded-xl border border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-4 py-2.5 text-xs sm:text-sm font-bold shadow-sm hover:bg-emerald-100 transition-all"
          >
            <Sparkles className="h-4 w-4 text-emerald-600" />
            Question Cards
          </button>
          <Link
            href="/teacher/evaluate"
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
          >
            <Camera className="h-4 w-4" />
            Scan Answer Sheets
          </Link>
          <Link
            href="/teacher/exams/new"
            className="flex items-center gap-2 rounded-xl border border-border bg-card text-foreground px-4 py-2.5 text-xs sm:text-sm font-bold shadow-sm hover:bg-accent transition-all"
          >
            <PlusCircle className="h-4 w-4 text-emerald-600" />
            New Exam Builder
          </Link>
        </div>
      </div>

      {/* Navigation Tab Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-border">
        {[
          { id: "overview", label: "Dashboard Overview", icon: Layers },
          { id: "questions", label: "Question Bank (Cards)", icon: Sparkles },
          { id: "students", label: `Students (${students.length})`, icon: GraduationCap },
          { id: "batches", label: `Batches (${batches.length})`, icon: FolderPlus },
          { id: "subjects", label: `Subjects (${subjects.length})`, icon: BookMarked },
          { id: "evaluations", label: `Evaluations (${submissions.length})`, icon: FileCheck2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-muted/60 text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* TAB: QUESTION BANK (CARD MODE) */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {activeTab === "questions" && (
        <QuestionBankCards />
      )}

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* TAB 1: OVERVIEW */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Institution Portal Link Quick-Banner */}
          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-gradient-to-r from-emerald-50/80 via-teal-50/50 to-background dark:from-emerald-950/40 dark:to-background p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-foreground">
                    Your Public Coaching Portal is Active
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
                    LIVE
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Students can join your portal to access scheduled tests, practice CQ papers, and view AI-evaluated answer scripts.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <Link
                href="/portal"
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" /> View Public Portal
              </Link>
            </div>
          </div>

          {/* Overview Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-bold uppercase tracking-wider">Total Enrolled</span>
                <Users className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-foreground">
                {stats.totalStudents || students.length}
              </div>
              <p className="text-[11px] text-muted-foreground">Active students across all batches</p>
            </div>

            <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-bold uppercase tracking-wider">Active Batches</span>
                <FolderPlus className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-foreground">
                {stats.totalBatches || batches.length}
              </div>
              <p className="text-[11px] text-muted-foreground">HSC, SSC, Varsity admission</p>
            </div>

            <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-bold uppercase tracking-wider">Published Exams</span>
                <BookOpen className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-foreground">
                {stats.totalExams || exams.length}
              </div>
              <p className="text-[11px] text-emerald-600 font-medium">With detailed AI rubrics</p>
            </div>

            <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-bold uppercase tracking-wider">Scripts Evaluated</span>
                <FileCheck2 className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-600">
                {stats.totalSubmissions || submissions.length}
              </div>
              <p className="text-[11px] text-muted-foreground">Automated OCR & grading</p>
            </div>
          </div>

          {/* Main Grid: Exams List & Pending Submissions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Col: Exams Management */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-emerald-600" />
                  Active Exams & Test Links
                </h2>
                <Link
                  href="/teacher/exams/new"
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                >
                  + Create New Exam
                </Link>
              </div>

              <div className="space-y-3">
                {loading ? (
                  <div className="p-8 text-center text-xs text-muted-foreground">Loading exams...</div>
                ) : exams.length === 0 ? (
                  <div className="p-8 rounded-2xl border border-border bg-card text-center text-xs text-muted-foreground">
                    No exams created yet. Click "Create Exam" to begin.
                  </div>
                ) : (
                  exams.map((exam: any) => (
                    <div
                      key={exam.id || exam._id}
                      className="p-5 rounded-2xl border border-border bg-card shadow-sm hover:border-emerald-300 transition-all space-y-3.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200">
                            {exam.curriculumCode}
                          </span>
                          <h3 className="font-bold text-sm text-foreground">{exam.title}</h3>
                        </div>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {exam.durationMinutes} mins
                        </span>
                      </div>

                      {/* Shareable Student Exam Link Row */}
                      <div className="p-2.5 rounded-xl bg-muted/60 border border-border flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-muted-foreground font-semibold flex items-center gap-1">
                            <Share2 className="h-3 w-3 text-emerald-600" /> Link:
                          </span>
                          <code className="text-emerald-700 dark:text-emerald-400 font-mono text-[11px] bg-background px-2 py-0.5 rounded border border-border">
                            /exam/{exam.accessCode || exam.id || exam._id}
                          </code>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyLink(exam.accessCode || exam.id || exam._id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                              copiedCode === (exam.accessCode || exam.id || exam._id)
                                ? "bg-emerald-600 text-white"
                                : "bg-card border border-border hover:bg-accent text-foreground"
                            }`}
                          >
                            {copiedCode === (exam.accessCode || exam.id || exam._id) ? (
                              <>
                                <CheckCircle2 className="h-3.5 w-3.5" /> Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" /> Copy Link
                              </>
                            )}
                          </button>

                          <Link
                            href={`/exam/${exam.accessCode || exam.id || exam._id}`}
                            target="_blank"
                            className="px-2.5 py-1 rounded-lg bg-card border border-border hover:bg-accent text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" /> Open
                          </Link>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                        <div className="flex items-center gap-3">
                          <span>Total Marks: {exam.totalMarks}</span>
                          <span>•</span>
                          <span>Questions: {exam.questions?.length || 4}</span>
                        </div>
                        <Link
                          href={`/teacher/evaluate?examId=${exam.id || exam._id}`}
                          className="font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                        >
                          Evaluate Papers <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Col: Recent Submissions & Scan Launcher */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
                  <FileCheck2 className="h-4 w-4 text-emerald-600" />
                  Recent Submissions
                </h2>
                <Link
                  href="/teacher/evaluate"
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                >
                  + Scan Paper
                </Link>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
                {submissions.length === 0 ? (
                  <div className="p-8 text-center text-xs text-muted-foreground">
                    No student submissions yet.
                  </div>
                ) : (
                  submissions.slice(0, 5).map((sub: any) => (
                    <div
                      key={sub.id || sub._id}
                      className="p-3.5 rounded-xl border border-border bg-muted/30 hover:bg-accent/40 transition-colors flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1 truncate">
                        <div className="font-bold text-foreground truncate">
                          {sub.studentName}
                        </div>
                        <div className="text-[11px] text-muted-foreground truncate">
                          {sub.examTitle}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {sub.evaluation ? (
                          <div className="text-right">
                            <span className="font-black text-xs text-emerald-600">
                              {sub.evaluation.totalScore}/{sub.evaluation.maxScore}
                            </span>
                            <div className="text-[10px] font-bold text-muted-foreground">
                              Grade {sub.evaluation.grade}
                            </div>
                          </div>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                            Evaluating
                          </span>
                        )}

                        <Link
                          href={`/teacher/evaluate/${sub.id || sub._id}`}
                          className="p-1.5 rounded-lg border border-border bg-card hover:bg-accent"
                        >
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* TAB 2: STUDENTS MANAGEMENT */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {activeTab === "students" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">Enrolled Students</h2>
              <p className="text-xs text-muted-foreground">
                Manage student records, assign to batches, and view performance history.
              </p>
            </div>

            <button
              onClick={() => setShowStudentModal(true)}
              className="py-2.5 px-4 rounded-xl bg-emerald-600 font-bold text-xs text-white shadow-md hover:bg-emerald-700 transition-all flex items-center gap-1.5 self-start"
            >
              <PlusCircle className="h-4 w-4" /> Enroll New Student
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by student name or roll number..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <select
              value={selectedBatchFilter}
              onChange={(e) => setSelectedBatchFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-border bg-background text-xs font-semibold focus:outline-none w-full sm:w-auto"
            >
              <option value="ALL">All Batches</option>
              {batches.map((b) => (
                <option key={b.id || (b as any)._id} value={b.id || (b as any)._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Students Table */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/60 border-b border-border text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Roll / ID</th>
                    <th className="py-3 px-4">Batch</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted-foreground">
                        No students found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((std: any, idx) => (
                      <tr key={std.id || std._id || idx} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4 font-bold text-foreground">
                          {std.name || std.studentName}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono bg-muted px-2 py-0.5 rounded text-[11px] font-semibold">
                            {std.rollNo || std.studentRoll || "N/A"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {std.batchName || std.batchId?.name || "Main Batch"}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {std.email || std.studentEmail || "—"}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* TAB 3: BATCH MANAGEMENT */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {activeTab === "batches" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">Academic Batches</h2>
              <p className="text-xs text-muted-foreground">
                Organize exams, subjects, and student cohorts by curriculum.
              </p>
            </div>

            <button
              onClick={() => setShowBatchModal(true)}
              className="py-2.5 px-4 rounded-xl bg-emerald-600 font-bold text-xs text-white shadow-md hover:bg-emerald-700 transition-all flex items-center gap-1.5 self-start"
            >
              <PlusCircle className="h-4 w-4" /> Create New Batch
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {batches.map((batch: any) => (
              <div
                key={batch.id || batch._id}
                className="p-5 rounded-2xl border border-border bg-card shadow-sm hover:border-emerald-300 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200">
                    {batch.curriculumCode}
                  </span>
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    {batch.enrolledStudentsCount || batch.enrolledStudentCount || 0} Students
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-foreground">{batch.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {batch.description || "Active academic evaluation batch."}
                  </p>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Curriculum: {batch.curriculumCode}</span>
                  <Link
                    href={`/teacher/exams/new?batchId=${batch.id || batch._id}`}
                    className="font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    + Create Exam <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* TAB 4: SUBJECT MANAGEMENT */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {activeTab === "subjects" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">Subjects & Modules</h2>
              <p className="text-xs text-muted-foreground">
                Manage subject codes, courses, and syllabus allocations.
              </p>
            </div>

            <button
              onClick={() => setShowSubjectModal(true)}
              className="py-2.5 px-4 rounded-xl bg-emerald-600 font-bold text-xs text-white shadow-md hover:bg-emerald-700 transition-all flex items-center gap-1.5 self-start"
            >
              <PlusCircle className="h-4 w-4" /> Add Subject
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((sub: any, idx) => (
              <div
                key={sub.id || sub._id || idx}
                className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono bg-muted px-2 py-0.5 rounded text-[11px] font-bold text-foreground">
                    {sub.code}
                  </span>
                  <BookMarked className="h-4 w-4 text-emerald-600" />
                </div>
                <h3 className="font-bold text-sm text-foreground">{sub.name}</h3>
                <p className="text-[11px] text-muted-foreground">Course Module for CQ & MCQ Testing</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* TAB 5: EVALUATIONS & REPORTS */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {activeTab === "evaluations" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">Exam Evaluations & Reports</h2>
              <p className="text-xs text-muted-foreground">
                AI graded scripts with point-by-point rubric verification.
              </p>
            </div>

            <Link
              href="/teacher/evaluate"
              className="py-2.5 px-4 rounded-xl bg-emerald-600 font-bold text-xs text-white shadow-md hover:bg-emerald-700 transition-all flex items-center gap-1.5 self-start"
            >
              <Camera className="h-4 w-4" /> Scan & Evaluate New Script
            </Link>
          </div>

          <div className="space-y-3">
            {submissions.map((sub: any) => (
              <div
                key={sub.id || sub._id}
                className="p-4 rounded-2xl border border-border bg-card shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-foreground">{sub.studentName}</h3>
                    <span className="text-xs text-muted-foreground">({sub.studentRoll || "Roll N/A"})</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{sub.examTitle} • {sub.curriculumCode}</p>
                </div>

                <div className="flex items-center gap-4">
                  {sub.evaluation ? (
                    <div className="text-right">
                      <div className="text-sm font-black text-emerald-600">
                        {sub.evaluation.totalScore} / {sub.evaluation.maxScore} Marks
                      </div>
                      <div className="text-[11px] font-semibold text-muted-foreground">
                        Grade {sub.evaluation.grade} ({sub.evaluation.percentage}%)
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-amber-600 font-bold bg-amber-50 px-2.5 py-1 rounded-lg">
                      Pending Evaluation
                    </span>
                  )}

                  <Link
                    href={`/teacher/evaluate/${sub.id || sub._id}`}
                    className="py-1.5 px-3 rounded-xl border border-border bg-muted/60 hover:bg-accent text-xs font-bold text-foreground flex items-center gap-1"
                  >
                    View Report <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* MODAL: CREATE BATCH */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-foreground">Create New Academic Batch</h3>
            <form onSubmit={handleCreateBatch} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Batch Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HSC 2026 Engineering Batch"
                  value={newBatchName}
                  onChange={(e) => setNewBatchName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Curriculum Code</label>
                <select
                  value={newBatchCurriculum}
                  onChange={(e) => setNewBatchCurriculum(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-semibold focus:outline-none"
                >
                  <option value="HSC">HSC (Higher Secondary)</option>
                  <option value="SSC">SSC (Secondary)</option>
                  <option value="DU_A">Dhaka University 'Ka' Unit</option>
                  <option value="BUET">BUET Engineering</option>
                  <option value="IELTS">IELTS Academic</option>
                  <option value="BCS">BCS Preliminary / Written</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Target syllabus, weekly routine, or details..."
                  value={newBatchDesc}
                  onChange={(e) => setNewBatchDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBatchModal(false)}
                  className="py-2 px-4 rounded-xl border border-border hover:bg-accent text-xs font-bold text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingBatch}
                  className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                >
                  {isCreatingBatch ? "Creating..." : "Save Batch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* MODAL: ENROLL STUDENT */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {showStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-foreground">Enroll Student into Batch</h3>
            <form onSubmit={handleEnrollStudent} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Student Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samiha Rahman / Tahmid Hasan"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Roll / Registration Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ENG-105 / 202601"
                  value={newStudentRoll}
                  onChange={(e) => setNewStudentRoll(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Assign to Batch *</label>
                <select
                  value={newStudentBatchId}
                  onChange={(e) => setNewStudentBatchId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-semibold focus:outline-none"
                >
                  {batches.map((b) => (
                    <option key={b.id || (b as any)._id} value={b.id || (b as any)._id}>
                      {b.name} ({b.curriculumCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="student@example.com"
                    value={newStudentEmail}
                    onChange={(e) => setNewStudentEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Phone (Optional)</label>
                  <input
                    type="tel"
                    placeholder="+880 1712..."
                    value={newStudentPhone}
                    onChange={(e) => setNewStudentPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStudentModal(false)}
                  className="py-2 px-4 rounded-xl border border-border hover:bg-accent text-xs font-bold text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEnrollingStudent}
                  className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                >
                  {isEnrollingStudent ? "Enrolling..." : "Enroll Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* MODAL: ADD SUBJECT */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {showSubjectModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-foreground">Add Subject to Batch</h3>
            <form onSubmit={handleCreateSubject} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Subject Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Higher Mathematics 1st Paper"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Subject Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MATH-265"
                  value={newSubjectCode}
                  onChange={(e) => setNewSubjectCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Target Batch</label>
                <select
                  value={newSubjectBatchId}
                  onChange={(e) => setNewSubjectBatchId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-semibold focus:outline-none"
                >
                  {batches.map((b) => (
                    <option key={b.id || (b as any)._id} value={b.id || (b as any)._id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubjectModal(false)}
                  className="py-2 px-4 rounded-xl border border-border hover:bg-accent text-xs font-bold text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingSubject}
                  className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                >
                  {isCreatingSubject ? "Adding..." : "Add Subject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
