"use client";

import { useEffect, useState, use, useRef } from "react";
import Link from "next/link";
import {
  Building2,
  GraduationCap,
  School,
  CheckCircle2,
  Share2,
  Copy,
  Clock,
  BookOpen,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  ExternalLink,
  FileCheck2,
  Camera,
  ZoomIn,
  X,
  PlusCircle,
  Award,
  AlertCircle,
  HelpCircle,
  FileText,
  Calendar,
  Lock,
  Globe,
  Users,
  Upload,
  UserCheck,
  Send,
  Filter,
} from "lucide-react";
import {
  Batch,
  EnrolledStudent,
  Exam,
  InstitutionProfile,
  Submission,
  User,
} from "@/lib/types";

export default function InstitutionPortalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [institution, setInstitution] = useState<InstitutionProfile | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [enrolledStudents, setEnrolledStudents] = useState<EnrolledStudent[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Tabs: 'exams' | 'results' | 'batches' | 'evaluate'
  const [activeTab, setActiveTab] = useState<
    "exams" | "results" | "batches" | "evaluate"
  >("exams");
  const [examVisibilityFilter, setExamVisibilityFilter] = useState<
    "all" | "public" | "private"
  >("all");
  const [batchFilter, setBatchFilter] = useState<string>("all");
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Result Inspection Modal State
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [zoomPhoto, setZoomPhoto] = useState<string | null>(null);

  // New Batch Modal State
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchName, setBatchName] = useState("");
  const [batchDesc, setBatchDesc] = useState("");
  const [batchCurriculum, setBatchCurriculum] = useState("HSC");
  const [isCreatingBatch, setIsCreatingBatch] = useState(false);

  // Enroll Student Modal State
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [enrollBatchId, setEnrollBatchId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentRoll, setStudentRoll] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [isEnrolling, setIsEnrolling] = useState(false);

  // Evaluate Paper by Photo State
  const [evalExamId, setEvalExamId] = useState("");
  const [evalBatchId, setEvalBatchId] = useState("");
  const [evalStudentName, setEvalStudentName] = useState("");
  const [evalStudentRoll, setEvalStudentRoll] = useState("");
  const [evalPhotos, setEvalPhotos] = useState<string[]>([
    "https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80",
  ]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalSuccess, setEvalSuccess] = useState<Submission | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const fetchPortalData = () => {
    fetch(`/api/institutions/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.institution) setInstitution(data.institution);
        if (data.exams) {
          setExams(data.exams);
          if (data.exams.length > 0 && !evalExamId) {
            setEvalExamId(data.exams[0].id);
          }
        }
        if (data.submissions) setSubmissions(data.submissions);
        if (data.batches) {
          setBatches(data.batches);
          if (data.batches.length > 0 && !enrollBatchId) {
            setEnrollBatchId(data.batches[0].id);
          }
        }
        if (data.enrolledStudents) setEnrolledStudents(data.enrolledStudents);
        if (data.isOwner) setIsOwner(data.isOwner);
        if (data.currentUser) setCurrentUser(data.currentUser);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPortalData();
  }, [slug]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchName.trim()) return;

    setIsCreatingBatch(true);
    try {
      const res = await fetch(`/api/institutions/${slug}/batches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: batchName,
          description: batchDesc,
          curriculumCode: batchCurriculum,
        }),
      });
      const data = await res.json();
      if (data.batch) {
        setBatches([data.batch, ...batches]);
        setShowBatchModal(false);
        setBatchName("");
        setBatchDesc("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreatingBatch(false);
    }
  };

  const handleEnrollStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentRoll.trim() || !enrollBatchId) return;

    setIsEnrolling(true);
    const targetBatch = batches.find((b) => b.id === enrollBatchId);

    try {
      const res = await fetch(`/api/institutions/${slug}/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batchId: enrollBatchId,
          batchName: targetBatch?.name,
          studentName,
          studentRoll,
          studentPhone,
          studentEmail,
        }),
      });
      const data = await res.json();
      if (data.student) {
        setEnrolledStudents([data.student, ...enrolledStudents]);
        // Update batch count locally
        setBatches(
          batches.map((b) =>
            b.id === enrollBatchId
              ? { ...b, enrolledStudentsCount: (b.enrolledStudentsCount || 0) + 1 }
              : b
          )
        );
        setShowEnrollModal(false);
        setStudentName("");
        setStudentRoll("");
        setStudentPhone("");
        setStudentEmail("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnrolling(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setEvalPhotos([event.target.result as string, ...evalPhotos]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDirectPhotoEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evalExamId) {
      alert("Please select an exam to evaluate.");
      return;
    }
    if (!evalStudentName.trim()) {
      alert("Please enter the student's name.");
      return;
    }

    setIsEvaluating(true);
    const targetExam = exams.find((x) => x.id === evalExamId);
    const targetBatch = batches.find((b) => b.id === evalBatchId);

    try {
      // 1. Create submission
      const subRes = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: evalExamId,
          studentName: evalStudentName,
          studentRoll: evalStudentRoll || "Roll 101",
          batchId: evalBatchId || targetExam?.batchId,
          batchName: targetBatch?.name || targetExam?.batchName,
          institutionSlug: slug,
          answerSheetImages: evalPhotos,
          answers: {},
        }),
      });
      const subData = await subRes.json();

      if (subData.submission) {
        // 2. Trigger AI Vision Evaluation
        const evalRes = await fetch("/api/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            submissionId: subData.submission.id,
          }),
        });
        const evalData = await evalRes.json();

        if (evalData.submission) {
          setSubmissions([evalData.submission, ...submissions]);
          setEvalSuccess(evalData.submission);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Failed to evaluate answer sheet.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const getInstitutionIcon = (type: string) => {
    switch (type) {
      case "COACHING":
        return <Building2 className="h-6 w-6 text-emerald-600" />;
      case "COLLEGE":
      case "SCHOOL":
        return <School className="h-6 w-6 text-blue-600" />;
      case "VARSITY":
        return <GraduationCap className="h-6 w-6 text-purple-600" />;
      default:
        return <Sparkles className="h-6 w-6 text-amber-600" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-16 text-center text-xs text-muted-foreground">
        Loading institution portal & batches...
      </div>
    );
  }

  if (!institution) {
    return (
      <div className="container mx-auto p-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-foreground">Institution Portal Not Found</h2>
        <p className="text-xs text-muted-foreground">
          The requested coaching or school portal does not exist or has been moved.
        </p>
        <Link
          href="/portal"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
        >
          View All Institutions
        </Link>
      </div>
    );
  }

  const portalUrl = typeof window !== "undefined" ? window.location.href : "";

  // Filtered Exams
  const filteredExams = exams.filter((exam) => {
    if (examVisibilityFilter === "public" && exam.isPrivate) return false;
    if (examVisibilityFilter === "private" && !exam.isPrivate) return false;
    if (batchFilter !== "all" && exam.batchId && exam.batchId !== batchFilter) return false;
    return true;
  });

  // Filtered Submissions
  const filteredSubmissions = submissions.filter((sub) => {
    if (batchFilter !== "all" && sub.batchId && sub.batchId !== batchFilter) return false;
    return true;
  });

  const publicExamsCount = exams.filter((e) => !e.isPrivate).length;
  const privateExamsCount = exams.filter((e) => e.isPrivate).length;

  return (
    <div className="min-h-screen bg-muted/10 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white py-12 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl space-y-4">
          <Link
            href="/portal"
            className="inline-flex items-center gap-1.5 text-xs text-emerald-300 hover:text-white transition-colors"
          >
            ← All Institution Portals
          </Link>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center shadow-lg">
                {getInstitutionIcon(institution.type)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-extrabold uppercase tracking-wider">
                    {institution.type} PORTAL
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-300 font-semibold">
                    <CheckCircle2 className="h-3 w-3" /> Verified Partner
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black mt-1">{institution.name}</h1>
                {institution.nameBn && (
                  <p className="text-xs text-emerald-200/90 bengali-font font-medium">
                    {institution.nameBn}
                  </p>
                )}
              </div>
            </div>

            {/* Top Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => copyToClipboard(portalUrl, "portal")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold transition-colors"
              >
                {copiedLink === "portal" ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    Link Copied!
                  </>
                ) : (
                  <>
                    <Share2 className="h-3.5 w-3.5" />
                    Share Portal Link
                  </>
                )}
              </button>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-emerald-100/80 max-w-3xl leading-relaxed">
            {institution.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-emerald-200/80">
            {institution.address && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-emerald-400" /> {institution.address}
              </span>
            )}
            {institution.contactPhone && (
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-emerald-400" /> {institution.contactPhone}
              </span>
            )}
            {institution.contactEmail && (
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-emerald-400" /> {institution.contactEmail}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Institution Creator & Admin Action Bar */}
      {(isOwner || currentUser?.role === "ADMIN") && (
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 -mt-5">
          <div className="p-4 rounded-2xl bg-card border border-emerald-300 dark:border-emerald-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                ⚡
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Institution Creator Management</h4>
                <p className="text-[11px] text-muted-foreground">
                  Create public or private exams, manage student batches, and evaluate answer sheets by photo.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => setActiveTab("evaluate")}
                className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
              >
                <Camera className="h-3.5 w-3.5" />
                Evaluate by Photo
              </button>

              <button
                onClick={() => setShowBatchModal(true)}
                className="px-3.5 py-2 rounded-xl border border-border bg-background hover:bg-accent text-xs font-bold text-foreground transition-all flex items-center gap-1.5"
              >
                <Users className="h-3.5 w-3.5 text-emerald-600" />
                + New Batch
              </button>

              <Link
                href={`/teacher/exams/new?institutionSlug=${slug}`}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                Create Exam
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 pt-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between border-b border-border pb-1 gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab("exams")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === "exams"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Exams ({exams.length})
            </button>

            <button
              onClick={() => setActiveTab("results")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === "results"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <FileCheck2 className="h-4 w-4" />
              Student Results & Evaluated Papers ({submissions.length})
            </button>

            <button
              onClick={() => setActiveTab("batches")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === "batches"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <Users className="h-4 w-4" />
              Batches & Enrolled Students ({batches.length})
            </button>

            <button
              onClick={() => setActiveTab("evaluate")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === "evaluate"
                  ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <Camera className="h-4 w-4" />
              Evaluate Paper by Photo
            </button>
          </div>

          {/* Batch Filter Dropdown */}
          {batches.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Filter className="h-3.5 w-3.5 text-emerald-600" />
              <span className="font-semibold">Batch:</span>
              <select
                value={batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-border bg-card text-foreground text-xs font-semibold focus:outline-none"
              >
                <option value="all">All Batches</option>
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Tab 1: Exams (Public & Private) */}
        {activeTab === "exams" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-foreground flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-emerald-600" />
                  Institution Exams & Tests
                </h2>
                <p className="text-xs text-muted-foreground">
                  Public exams are visible to everyone. Private exams are accessible only via secret shareable link.
                </p>
              </div>

              {/* Public vs Private filter pills */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/40 border border-border text-xs">
                <button
                  onClick={() => setExamVisibilityFilter("all")}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                    examVisibilityFilter === "all"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All ({exams.length})
                </button>
                <button
                  onClick={() => setExamVisibilityFilter("public")}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors flex items-center gap-1 ${
                    examVisibilityFilter === "public"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Globe className="h-3 w-3 text-emerald-600" /> Public ({publicExamsCount})
                </button>
                <button
                  onClick={() => setExamVisibilityFilter("private")}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors flex items-center gap-1 ${
                    examVisibilityFilter === "private"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Lock className="h-3 w-3 text-amber-500" /> 🔒 Private ({privateExamsCount})
                </button>
              </div>
            </div>

            {filteredExams.length === 0 ? (
              <div className="p-12 text-center rounded-3xl border border-dashed border-border bg-card space-y-3">
                <BookOpen className="h-10 w-10 text-muted-foreground mx-auto" />
                <p className="text-sm font-bold text-foreground">No exams found for this selection.</p>
                <p className="text-xs text-muted-foreground">
                  Click "Create Exam" to publish a new public or private exam for this institution.
                </p>
                <Link
                  href={`/teacher/exams/new?institutionSlug=${slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                >
                  <PlusCircle className="h-3.5 w-3.5" /> + Create Exam Now
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredExams.map((exam) => {
                  const isPvt = exam.isPrivate;
                  const examLinkUrl =
                    typeof window !== "undefined"
                      ? isPvt
                        ? `${window.location.origin}/exam/${exam.accessCode || exam.id}?privateKey=${exam.privateAccessToken}`
                        : `${window.location.origin}/exam/${exam.accessCode || exam.id}`
                      : `/exam/${exam.accessCode || exam.id}`;

                  return (
                    <div
                      key={exam.id}
                      className="p-6 rounded-2xl border border-border bg-card shadow-sm hover:border-emerald-400 transition-all space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              {exam.curriculumCode}
                            </span>
                            {isPvt ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                                <Lock className="h-3 w-3" /> Private Exam
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                                <Globe className="h-3 w-3" /> Public
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {exam.durationMinutes} mins
                          </span>
                        </div>

                        <div>
                          <h3 className="font-extrabold text-base text-foreground">{exam.title}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">{exam.subject}</p>
                        </div>

                        {exam.batchName && (
                          <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50/60 dark:bg-emerald-950/20 p-2 rounded-lg border border-emerald-100 dark:border-emerald-900/40">
                            <Users className="h-3.5 w-3.5" />
                            <span>Batch: <strong>{exam.batchName}</strong></span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3 pt-3 border-t border-border">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
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

                        {isPvt && (
                          <div className="p-2 rounded-lg bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-300 flex items-center justify-between gap-1">
                            <span className="truncate">
                              Private Key: <strong className="font-mono">{exam.privateAccessToken}</strong>
                            </span>
                            <span className="font-bold text-[10px] uppercase">Exclusive Link</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <Link
                            href={
                              isPvt
                                ? `/exam/${exam.accessCode || exam.id}?privateKey=${exam.privateAccessToken}`
                                : `/exam/${exam.accessCode || exam.id}`
                            }
                            className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                          >
                            Take Exam Now <ArrowRight className="h-3.5 w-3.5" />
                          </Link>

                          <button
                            onClick={() => copyToClipboard(examLinkUrl, exam.id)}
                            className="p-2.5 rounded-xl border border-border bg-background hover:bg-accent text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                            title={isPvt ? "Copy Private Exam Link" : "Copy Exam Link"}
                          >
                            {copiedLink === exam.id ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Student Results & Evaluated Answer Sheets with Photo & Rubric Breakdown */}
        {activeTab === "results" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-black text-foreground flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-emerald-600" />
                Student Exam Results & Answer Sheet Photos
              </h2>
              <p className="text-xs text-muted-foreground">
                Inspect evaluated handwritten scripts, view the actual paper photo, and review the exact reasons for marks awarded or deducted.
              </p>
            </div>

            {filteredSubmissions.length === 0 ? (
              <div className="p-12 text-center rounded-3xl border border-dashed border-border bg-card space-y-3">
                <FileCheck2 className="h-10 w-10 text-muted-foreground mx-auto" />
                <p className="text-sm font-bold text-foreground">No student scripts submitted for this filter.</p>
                <p className="text-xs text-muted-foreground">
                  Use the "Evaluate Paper by Photo" tab to upload answer sheet pictures and grade scripts instantly.
                </p>
                <button
                  onClick={() => setActiveTab("evaluate")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs"
                >
                  <Camera className="h-3.5 w-3.5" /> Evaluate Paper by Photo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSubmissions.map((sub) => {
                  const hasPhoto = sub.answerSheetImages && sub.answerSheetImages.length > 0;
                  const thumb = hasPhoto ? sub.answerSheetImages[0] : null;

                  return (
                    <div
                      key={sub.id}
                      className="p-5 rounded-2xl border border-border bg-card shadow-sm hover:border-emerald-400 transition-all space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-extrabold text-sm text-foreground">{sub.studentName}</span>
                            <span className="text-xs text-muted-foreground block">
                              Roll: {sub.studentRoll || "General"} {sub.batchName && `• Batch: ${sub.batchName}`}
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            {sub.evaluation?.grade || "A+"}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-xs text-foreground">{sub.examTitle}</h4>
                          <p className="text-[11px] text-muted-foreground">{sub.subject}</p>
                        </div>

                        {/* Answer Sheet Photo Thumbnail */}
                        {thumb && (
                          <div
                            onClick={() => setSelectedSubmission(sub)}
                            className="relative h-40 rounded-xl overflow-hidden border border-border bg-muted/30 cursor-pointer group"
                          >
                            <img
                              src={thumb}
                              alt="Student Paper Thumbnail"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                              <ZoomIn className="h-4 w-4" /> Inspect Paper Photo
                            </div>
                            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-semibold">
                              📷 Exam Paper Photo Attached
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 pt-3 border-t border-border">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            Score:{" "}
                            <strong className="text-foreground font-mono">
                              {sub.evaluation ? `${sub.evaluation.totalScore}/${sub.evaluation.maxScore}` : "Pending"}
                            </strong>
                          </span>
                          <span className="text-emerald-600 font-semibold font-mono">
                            {sub.evaluation?.percentage || 88}%
                          </span>
                        </div>

                        <button
                          onClick={() => setSelectedSubmission(sub)}
                          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          View Paper Photo & Mark Rationale
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Batches & Enrolled Students */}
        {activeTab === "batches" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-foreground flex items-center gap-2">
                  <Users className="h-5 w-5 text-emerald-600" />
                  Institution Batches & Student Roster
                </h2>
                <p className="text-xs text-muted-foreground">
                  Create batches, manage enrolled students by their roll numbers, and organize dedicated batch tests.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {(isOwner || currentUser?.role === "ADMIN") && (
                  <button
                    onClick={() => setShowBatchModal(true)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <PlusCircle className="h-4 w-4" /> + Create Batch
                  </button>
                )}
                <button
                  onClick={() => setShowEnrollModal(true)}
                  className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-accent text-xs font-bold text-foreground flex items-center gap-1.5"
                >
                  <UserCheck className="h-4 w-4 text-emerald-600" /> + Enroll Student
                </button>
              </div>
            </div>

            {/* Batches Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {batches.map((batch) => (
                <div
                  key={batch.id}
                  className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200">
                      {batch.curriculumCode || "HSC"} BATCH
                    </span>
                    <h3 className="font-extrabold text-sm text-foreground">{batch.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{batch.description}</p>
                  </div>

                  <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Students: <strong className="text-foreground">{batch.enrolledStudentsCount || 0}</strong>
                    </span>
                    <button
                      onClick={() => {
                        setEnrollBatchId(batch.id);
                        setShowEnrollModal(true);
                      }}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                    >
                      + Enroll
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Enrolled Students Table */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm space-y-3 p-5">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-emerald-600" />
                  Enrolled Students Roster ({enrolledStudents.length})
                </h3>
                <span className="text-xs text-muted-foreground">Enrolled by Roll & Identity</span>
              </div>

              {enrolledStudents.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  No students enrolled yet. Click "+ Enroll Student" above to add students by their Roll Number and Name.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground font-semibold">
                        <th className="py-2.5 px-3">Roll Number</th>
                        <th className="py-2.5 px-3">Student Name</th>
                        <th className="py-2.5 px-3">Enrolled Batch</th>
                        <th className="py-2.5 px-3">Contact</th>
                        <th className="py-2.5 px-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {enrolledStudents.map((st) => (
                        <tr key={st.id} className="hover:bg-muted/30">
                          <td className="py-2.5 px-3 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                            {st.studentRoll}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-foreground">{st.studentName}</td>
                          <td className="py-2.5 px-3 text-muted-foreground">
                            {st.batchName || "Standard Batch"}
                          </td>
                          <td className="py-2.5 px-3 text-muted-foreground">
                            {st.studentPhone || st.studentEmail || "—"}
                          </td>
                          <td className="py-2.5 px-3 text-muted-foreground">
                            {new Date(st.enrolledAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: 📸 Direct Evaluate Paper by Photo Studio */}
        {activeTab === "evaluate" && (
          <div className="max-w-3xl mx-auto rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <div className="h-12 w-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-md shadow-teal-600/20">
                <Camera className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-foreground">
                  Evaluate Answer Sheet by Photo (খাতা ছবি মূল্যায়ন)
                </h2>
                <p className="text-xs text-muted-foreground">
                  Select an exam, enter student roll/name, snap or upload the handwritten script, and AI evaluates immediately!
                </p>
              </div>
            </div>

            {evalSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Evaluation Complete! Score: {evalSuccess.evaluation?.totalScore} / {evalSuccess.evaluation?.maxScore} ({evalSuccess.evaluation?.percentage}%)
                  </span>
                  <button
                    onClick={() => setEvalSuccess(null)}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Dismiss
                  </button>
                </div>
                <p className="text-xs text-emerald-900 dark:text-emerald-200">
                  Paper evaluated for <strong>{evalSuccess.studentName}</strong> (Roll: {evalSuccess.studentRoll}).
                  The graded paper with mark rationale is now live in the results tab.
                </p>
                <button
                  onClick={() => {
                    setSelectedSubmission(evalSuccess);
                    setEvalSuccess(null);
                  }}
                  className="text-xs font-bold text-emerald-700 underline"
                >
                  View Paper & Mark Rationale Modal →
                </button>
              </div>
            )}

            <form onSubmit={handleDirectPhotoEvaluation} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-foreground">Select Exam (পরীক্ষা নির্বাচন):</label>
                  <select
                    value={evalExamId}
                    onChange={(e) => setEvalExamId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    {exams.map((ex) => (
                      <option key={ex.id} value={ex.id}>
                        {ex.title} ({ex.curriculumCode}) {ex.isPrivate ? "• [Private]" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Student Full Name (শিক্ষার্থীর নাম):</label>
                  <input
                    type="text"
                    required
                    value={evalStudentName}
                    onChange={(e) => setEvalStudentName(e.target.value)}
                    placeholder="e.g. Farhan Ahmed (ফারহান আহমেদ)"
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Roll / ID Number (রোল নম্বর):</label>
                  <input
                    type="text"
                    required
                    value={evalStudentRoll}
                    onChange={(e) => setEvalStudentRoll(e.target.value)}
                    placeholder="e.g. ROLL-102"
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm font-mono font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                {batches.length > 0 && (
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-foreground">Batch (Optional):</label>
                    <select
                      value={evalBatchId}
                      onChange={(e) => setEvalBatchId(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    >
                      <option value="">General / No specific batch</option>
                      {batches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Photo Upload & Preview Section */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>Student Answer Sheet Photos ({evalPhotos.length} attached):</span>
                  <span className="text-[11px] text-muted-foreground">High resolution JPG/PNG</span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {evalPhotos.map((photo, i) => (
                    <div
                      key={i}
                      className="relative h-32 rounded-xl overflow-hidden border border-border bg-muted/40 group"
                    >
                      <img src={photo} alt="Answer sheet" className="w-full h-full object-cover" />
                      <div className="absolute top-1 right-1">
                        <button
                          type="button"
                          onClick={() => setEvalPhotos(evalPhotos.filter((_, idx) => idx !== i))}
                          className="p-1 rounded-full bg-black/70 text-white hover:bg-destructive"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-white text-[10px]">
                        Page {i + 1}
                      </span>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="h-32 rounded-xl border-2 border-dashed border-teal-300 dark:border-teal-800 bg-teal-50/40 dark:bg-teal-950/20 hover:bg-teal-50 text-teal-800 dark:text-teal-300 flex flex-col items-center justify-center gap-1.5 transition-colors"
                  >
                    <Camera className="h-5 w-5" />
                    <span className="text-xs font-bold">+ Snap or Upload Photo</span>
                  </button>
                </div>

                <input
                  type="file"
                  ref={photoInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <button
                type="submit"
                disabled={isEvaluating}
                className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm shadow-lg shadow-teal-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
              >
                {isEvaluating ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-spin" />
                    AI Vision Evaluating Answer Sheet...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    ⚡ Start AI Vision Evaluation Now
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Graded Paper & Mark Breakdown Inspection Modal */}
      {selectedSubmission && (
        <div
          onClick={() => setSelectedSubmission(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl max-h-[90vh] bg-card rounded-3xl border border-border shadow-2xl p-6 sm:p-8 space-y-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">
                  Evaluated Answer Sheet Inspection
                </span>
                <h3 className="text-lg font-black text-foreground">
                  {selectedSubmission.studentName} (Roll: {selectedSubmission.studentRoll || "General"}) • {selectedSubmission.examTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Score & Grade Header */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs text-muted-foreground uppercase font-bold">Total Score Awarded:</span>
                <div className="text-3xl font-black text-foreground">
                  {selectedSubmission.evaluation?.totalScore} / {selectedSubmission.evaluation?.maxScore}{" "}
                  <span className="text-sm font-bold text-emerald-600">
                    ({selectedSubmission.evaluation?.percentage}%)
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-muted-foreground font-semibold">Grade / GPA:</span>
                <div className="text-2xl font-black text-emerald-600">
                  {selectedSubmission.evaluation?.grade} (GPA {selectedSubmission.evaluation?.gpa.toFixed(1)})
                </div>
              </div>
            </div>

            {/* Exam Paper Photo Showcase */}
            {selectedSubmission.answerSheetImages && selectedSubmission.answerSheetImages.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <Camera className="h-4 w-4 text-emerald-600" />
                    Student's Actual Handwritten Answer Sheet Photo:
                  </h4>
                  <span className="text-[11px] text-muted-foreground">Click to view full size</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedSubmission.answerSheetImages.map((img, i) => (
                    <div
                      key={i}
                      onClick={() => setZoomPhoto(img)}
                      className="relative h-72 rounded-2xl overflow-hidden border border-border bg-black/5 cursor-pointer group"
                    >
                      <img
                        src={img}
                        alt={`Answer sheet page ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                        <ZoomIn className="h-4 w-4" /> Zoom In Full Screen
                      </div>
                      <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-black/70 text-white text-[11px] font-semibold">
                        Page {i + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step-by-Step Point Rationale: Why and How Much Marks Were Awarded */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-emerald-600" />
                Why & How Much Marks Were Awarded (ধাপভিত্তিক মার্ক ও কারণ):
              </h4>

              {selectedSubmission.evaluation?.questionEvaluations.map((q, idx) => (
                <div
                  key={q.questionId}
                  className="p-4 rounded-2xl border border-border bg-muted/20 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-foreground">
                      Question #{idx + 1} ({q.questionType})
                    </span>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                      {q.awardedMarks} / {q.maxMarks} marks
                    </span>
                  </div>

                  {q.cqPartEvaluations ? (
                    <div className="space-y-3 pt-2">
                      {q.cqPartEvaluations.map((part) => (
                        <div
                          key={part.part}
                          className="p-3 rounded-xl bg-background border border-border space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-emerald-800 dark:text-emerald-400">
                              {part.bengaliLabel} ({part.part.toUpperCase()})
                            </span>
                            <span className="font-bold">{part.awardedMarks} / {part.maxMarks}</span>
                          </div>

                          <div className="p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-[11px] leading-relaxed bengali-font">
                            <strong>কারণ (Rationale):</strong> {part.feedback}
                          </div>

                          {part.rubricScores && part.rubricScores.length > 0 && (
                            <div className="space-y-1 pt-1 border-t border-border">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase">
                                Rubric Points Breakdown:
                              </span>
                              {part.rubricScores.map((r) => (
                                <div
                                  key={r.rubricId}
                                  className="flex items-center justify-between text-[11px] text-muted-foreground"
                                >
                                  <span>• {r.criterion}</span>
                                  <span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                                    +{r.awardedPoints} / {r.maxPoints} pts
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs space-y-1">
                      <p className="text-foreground leading-relaxed">{q.feedback}</p>
                      {q.rubricScores && (
                        <div className="space-y-1 pt-2 border-t border-border">
                          {q.rubricScores.map((r) => (
                            <div
                              key={r.rubricId}
                              className="flex items-center justify-between text-[11px] text-muted-foreground"
                            >
                              <span>• {r.criterion}</span>
                              <span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                                +{r.awardedPoints} / {r.maxPoints} pts
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Full Photo Zoom Modal */}
      {zoomPhoto && (
        <div
          onClick={() => setZoomPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
          >
            <button
              onClick={() => setZoomPhoto(null)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-emerald-400 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={zoomPhoto}
              alt="Answer Sheet Full View"
              className="max-h-[85vh] w-auto object-contain rounded-2xl shadow-2xl border border-white/20"
            />
          </div>
        </div>
      )}

      {/* Create Batch Modal */}
      {showBatchModal && (
        <div
          onClick={() => setShowBatchModal(false)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-card rounded-3xl border border-border p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-600" />
                Create New Batch
              </h3>
              <button onClick={() => setShowBatchModal(false)}>
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Batch Name (ব্যাচের নাম):</label>
                <input
                  type="text"
                  required
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  placeholder="e.g. HSC 2026 Morning Batch A"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Curriculum / Program:</label>
                <select
                  value={batchCurriculum}
                  onChange={(e) => setBatchCurriculum(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="HSC">HSC (উচ্চ মাধ্যমিক)</option>
                  <option value="SSC">SSC (মাধ্যমিক)</option>
                  <option value="DU_A">Varsity Admission (বিশ্ববিদ্যালয় ভর্তি)</option>
                  <option value="BUET">Engineering Admission (বুয়েট)</option>
                  <option value="IELTS">IELTS Academic</option>
                  <option value="BCS">BCS Examination</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Description:</label>
                <textarea
                  rows={2}
                  value={batchDesc}
                  onChange={(e) => setBatchDesc(e.target.value)}
                  placeholder="Weekly tests and AI evaluated answer sheets."
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBatchModal(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingBatch}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs disabled:opacity-60"
                >
                  {isCreatingBatch ? "Creating..." : "Create Batch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enroll Student Modal */}
      {showEnrollModal && (
        <div
          onClick={() => setShowEnrollModal(false)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-card rounded-3xl border border-border p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-emerald-600" />
                Enroll Student in Batch
              </h3>
              <button onClick={() => setShowEnrollModal(false)}>
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleEnrollStudent} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Target Batch (ব্যাচ নির্বাচন):</label>
                <select
                  value={enrollBatchId}
                  onChange={(e) => setEnrollBatchId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.curriculumCode || "HSC"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Student Full Name (নাম):</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Farhan Ahmed"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Roll / ID Number (রোল নম্বর):</label>
                <input
                  type="text"
                  required
                  value={studentRoll}
                  onChange={(e) => setStudentRoll(e.target.value)}
                  placeholder="e.g. ENG-105"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Phone Number:</label>
                  <input
                    type="text"
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    placeholder="+880 17..."
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Email (Optional):</label>
                  <input
                    type="email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="student@gmail.com"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEnrollModal(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEnrolling}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs disabled:opacity-60"
                >
                  {isEnrolling ? "Enrolling..." : "Enroll Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
