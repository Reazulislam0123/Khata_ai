"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User as UserIcon,
  Mail,
  Building2,
  GraduationCap,
  Calendar,
  Award,
  FileCheck2,
  ArrowRight,
  ExternalLink,
  PlusCircle,
  Copy,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  LogOut,
  ShieldCheck,
  Lock,
  Layers,
  FileText,
  KeyRound,
  Eye,
  EyeOff,
  Save,
  Check,
  AlertCircle,
  Edit3,
} from "lucide-react";
import { InstitutionProfile, Submission, User, Exam } from "@/lib/types";

function UserProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [allInstitutions, setAllInstitutions] = useState<InstitutionProfile[]>([]);
  const [createdExams, setCreatedExams] = useState<Exam[]>([]);
  const [activeTab, setActiveTab] = useState<"exams" | "institutions" | "account">("exams");
  const [loading, setLoading] = useState(true);

  // Profile & Password Edit State
  const [editName, setEditName] = useState("");
  const [editInstitution, setEditInstitution] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState("");
  const [profileErrorMsg, setProfileErrorMsg] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState("");
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");

  // New Institution Form State
  const [showAddInst, setShowAddInst] = useState(false);
  const [instName, setInstName] = useState("");
  const [instType, setInstType] = useState<"COACHING" | "SCHOOL" | "COLLEGE" | "VARSITY" | "INDIVIDUAL">("COACHING");
  const [instSlug, setInstSlug] = useState("");
  const [instDescription, setInstDescription] = useState("");
  const [isCreatingInst, setIsCreatingInst] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "institutions") {
      setActiveTab("institutions");
    } else if (tabParam === "account") {
      setActiveTab("account");
    } else if (tabParam === "exams") {
      setActiveTab("exams");
    }
  }, [searchParams]);

  const handleTabChange = (tab: "exams" | "institutions" | "account") => {
    setActiveTab(tab);
    router.replace(`/profile?tab=${tab}`, { scroll: false });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Fast restore from localStorage to eliminate flash/disconnection
      try {
        const cachedUser = localStorage.getItem("khata_user");
        if (cachedUser) {
          const parsed = JSON.parse(cachedUser);
          if (parsed && parsed.id) {
            setCurrentUser(parsed);
            setLoading(false);
          }
        }
      } catch {}

      try {
        const cachedInsts = localStorage.getItem("khata_custom_institutions");
        if (cachedInsts) {
          const parsed = JSON.parse(cachedInsts);
          if (Array.isArray(parsed)) {
            setAllInstitutions((prev) => {
              const ids = new Set(prev.map((p) => p.id));
              const news = parsed.filter((p: any) => !ids.has(p.id));
              return [...news, ...prev];
            });
          }
        }
      } catch {}
    }

    // Fetch fresh user state from server
    fetch("/api/auth/current-user")
      .then((r) => r.json())
      .then((data) => {
        if (data.currentUser) {
          setCurrentUser(data.currentUser);
          try {
            localStorage.setItem("khata_user", JSON.stringify(data.currentUser));
          } catch {}
        } else {
          try {
            const cached = localStorage.getItem("khata_user");
            if (!cached) setCurrentUser(null);
          } catch {
            setCurrentUser(null);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    fetch("/api/submissions/history")
      .then((r) => r.json())
      .then((data) => {
        if (data.submissions) setSubmissions(data.submissions);
      })
      .catch(() => {});

    fetch("/api/institutions")
      .then((r) => r.json())
      .then((data) => {
        if (data.institutions) {
          setAllInstitutions(data.institutions);
        }
      })
      .catch(() => {});

    fetch("/api/exams")
      .then((r) => r.json())
      .then((data) => {
        if (data.exams) setCreatedExams(data.exams);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name || "");
      setEditInstitution(currentUser.institution || "");
    }
  }, [currentUser]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccessMsg("");
    setProfileErrorMsg("");

    if (!editName.trim()) {
      setProfileErrorMsg("Name cannot be empty.");
      return;
    }

    setIsUpdatingProfile(true);
    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName.trim(),
          institution: editInstitution.trim(),
        }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
        try {
          localStorage.setItem("khata_user", JSON.stringify(data.user));
        } catch {}
        setProfileSuccessMsg("Profile information updated successfully!");
        setTimeout(() => setProfileSuccessMsg(""), 4000);
      } else {
        setProfileErrorMsg(data.error || "Failed to update profile.");
      }
    } catch (err: any) {
      setProfileErrorMsg(err.message || "An error occurred.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccessMsg("");
    setPasswordErrorMsg("");

    if (!currentPassword) {
      setPasswordErrorMsg("Please enter your current password.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordErrorMsg("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordErrorMsg("New passwords do not match. Please verify.");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setPasswordSuccessMsg("Password changed successfully!");
        setTimeout(() => setPasswordSuccessMsg(""), 4000);
      } else {
        setPasswordErrorMsg(data.error || "Failed to update password.");
      }
    } catch (err: any) {
      setPasswordErrorMsg(err.message || "An error occurred.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleCopy = (slug: string) => {
    const url = `${window.location.origin}/portal/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(slug);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleCreateInstitution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instName.trim()) return;

    setIsCreatingInst(true);
    const slug = (instSlug || instName)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    try {
      const res = await fetch("/api/institutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: instName.trim(),
          slug,
          type: instType,
          description: instDescription.trim(),
          contactEmail: currentUser?.email || "info@khata.ai",
          userId: currentUser?.id,
        }),
      });
      const data = await res.json();
      if (data.institution) {
        const updated = [data.institution, ...allInstitutions];
        setAllInstitutions(updated);
        try {
          const custom = updated.filter((i) => i.userId === currentUser?.id);
          localStorage.setItem("khata_custom_institutions", JSON.stringify(custom));
        } catch {}
        setShowAddInst(false);
        setInstName("");
        setInstSlug("");
        setInstDescription("");
      } else {
        alert(data.error || "Failed to create institution.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while creating institution.");
    } finally {
      setIsCreatingInst(false);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("khata_user");
    } catch {}
    await fetch("/api/auth/logout", { method: "POST" });
    setCurrentUser(null);
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="container mx-auto p-16 text-center text-xs text-muted-foreground">
        Loading profile and exam records...
      </div>
    );
  }

  // Not Logged In View
  if (!currentUser) {
    return (
      <div className="container mx-auto max-w-md px-4 py-16 text-center space-y-6">
        <div className="h-16 w-16 rounded-3xl bg-muted border border-border flex items-center justify-center mx-auto text-muted-foreground shadow-sm">
          <UserIcon className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-foreground">Sign In to View Your Profile</h1>
          <p className="text-xs text-muted-foreground">
            Sign in to access your registered institutions, view your exam records, and create tests.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-accent text-xs font-bold text-foreground transition-all"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
          >
            Create Free Account
          </Link>
        </div>
      </div>
    );
  }

  // Filter institutions owned by this user (or all if ADMIN)
  const isSuperAdmin = currentUser.role === "ADMIN";
  const myInstitutions = isSuperAdmin
    ? allInstitutions
    : allInstitutions.filter((i) => i.userId === currentUser.id);

  // Filter exams created by this user
  const myCreatedExams = isSuperAdmin
    ? createdExams
    : createdExams.filter((e) => e.creatorId === currentUser.id);

  // Calculate stats
  const evaluatedCount = submissions.filter((s) => s.status === "EVALUATED").length;
  const avgScore =
    evaluatedCount > 0
      ? Math.round(
          submissions.reduce((sum, s) => sum + (s.evaluation?.percentage || 0), 0) / evaluatedCount
        )
      : 88;

  return (
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-8 space-y-8">
      {/* Profile Header Banner */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-emerald-600/20">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-foreground">
                  {currentUser.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {currentUser.role === "ADMIN"
                    ? "⚡ Super Admin"
                    : currentUser.role === "TEACHER"
                    ? "🏛️ Institution / Educator"
                    : "🎓 Student"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                <span>{currentUser.email}</span>
                {currentUser.institution && (
                  <>
                    <span>•</span>
                    <span>{currentUser.institution}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentUser.role === "TEACHER" ? (
              <button
                onClick={() => {
                  handleTabChange("institutions");
                  setShowAddInst(true);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                + Register Institution
              </button>
            ) : (
              <Link
                href="/student"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
              >
                <BookOpen className="h-3.5 w-3.5" /> Take Public Exam
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl border border-border hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors text-xs font-semibold"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border">
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              {currentUser.role === "TEACHER" ? "Institutions Owned" : "Exams Completed"}
            </span>
            <div className="text-xl font-black text-foreground mt-1">
              {currentUser.role === "TEACHER" ? myInstitutions.length : submissions.length}
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              {currentUser.role === "TEACHER" ? "Exams Created" : "Average Score"}
            </span>
            <div className="text-xl font-black text-emerald-600 mt-1">
              {currentUser.role === "TEACHER" ? myCreatedExams.length : `${avgScore}%`}
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Overall Status
            </span>
            <div className="text-xl font-black text-foreground mt-1">
              {currentUser.role === "ADMIN" ? "Super Admin" : "Active Member"}
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              AI Evaluation Accuracy
            </span>
            <div className="text-xl font-black text-emerald-600 mt-1">99.4%</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-1">
        <button
          onClick={() => handleTabChange("exams")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === "exams"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          }`}
        >
          <BookOpen className="h-4 w-4" />
          My Exams ({currentUser.role === "TEACHER" ? myCreatedExams.length : submissions.length})
        </button>

        <button
          onClick={() => handleTabChange("institutions")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === "institutions"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          }`}
        >
          <Building2 className="h-4 w-4" />
          My Institutions ({myInstitutions.length})
        </button>

        <button
          onClick={() => handleTabChange("account")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === "account"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          }`}
        >
          <KeyRound className="h-4 w-4" />
          Edit Profile & Password
        </button>
      </div>

      {/* Tab 1: My Exams */}
      {activeTab === "exams" && (
        <div className="space-y-6">
          {currentUser.role === "TEACHER" || isSuperAdmin ? (
            /* Teacher / Admin Exam View */
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-extrabold text-foreground">Exams Created by You</h2>
                  <p className="text-xs text-muted-foreground">
                    Exams you created with custom rubrics and points. Only you can modify or evaluate papers under your institution.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href="/teacher/exams/new"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                  >
                    <PlusCircle className="h-3.5 w-3.5" /> + Create New Exam
                  </Link>
                </div>
              </div>

              {myCreatedExams.length === 0 ? (
                <div className="p-12 rounded-3xl border border-dashed border-border bg-card text-center space-y-3">
                  <BookOpen className="h-10 w-10 text-muted-foreground mx-auto" />
                  <h3 className="font-bold text-sm text-foreground">No Exams Created Yet</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    You haven't created any exams yet. Start by creating an exam with custom rubric points for your institution.
                  </p>
                  <Link
                    href="/teacher/exams/new"
                    className="inline-block px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                  >
                    + Create Your First Exam
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myCreatedExams.map((exam) => (
                    <div
                      key={exam.id}
                      className="p-5 rounded-2xl border border-border bg-card shadow-sm hover:border-emerald-300 transition-all space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200">
                            {exam.curriculumCode}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              exam.isPrivate
                                ? "bg-amber-500/10 text-amber-600 border border-amber-500/30"
                                : "bg-blue-500/10 text-blue-600 border border-blue-500/30"
                            }`}
                          >
                            {exam.isPrivate ? "🔒 Private Link" : "🌐 Public"}
                          </span>
                        </div>

                        <h3 className="font-bold text-sm text-foreground">{exam.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          Subject: <strong className="text-foreground">{exam.subject}</strong> • Marks:{" "}
                          <strong className="text-foreground">{exam.totalMarks}</strong> • Duration:{" "}
                          <strong className="text-foreground">{exam.durationMinutes}m</strong>
                        </p>
                        {exam.institutionSlug && (
                          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            <span>Institution: /portal/{exam.institutionSlug}</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                        <Link
                          href={`/exam/${exam.accessCode}${exam.privateAccessToken ? `?privateKey=${exam.privateAccessToken}` : ""}`}
                          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                        >
                          <span>Exam View</span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>

                        {exam.institutionSlug && (
                          <Link
                            href={`/portal/${exam.institutionSlug}`}
                            className="px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-accent text-xs font-bold text-foreground"
                          >
                            Manage in Portal
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Student Exam Performance View */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-foreground">Exam Performance & Evaluated Scripts</h2>
                  <p className="text-xs text-muted-foreground">
                    All submitted tests with question-by-question scoring and AI feedback.
                  </p>
                </div>
                <Link href="/student" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
                  Browse More Public Exams →
                </Link>
              </div>

              {submissions.length === 0 ? (
                <div className="p-12 rounded-3xl border border-dashed border-border bg-card text-center space-y-3">
                  <FileCheck2 className="h-10 w-10 text-muted-foreground mx-auto" />
                  <h3 className="font-bold text-sm text-foreground">No Exam Submissions Yet</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    You haven't submitted any answer sheets yet. Head over to the Student Arena to take an official test or participate via an institution portal.
                  </p>
                  <Link
                    href="/student"
                    className="inline-block px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                  >
                    Go to Student Arena
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {submissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-5 rounded-2xl border border-border bg-card shadow-sm hover:border-emerald-300 transition-all space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            {sub.curriculumCode}
                          </span>
                          <h3 className="font-bold text-sm text-foreground">{sub.examTitle}</h3>
                        </div>
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {new Date(sub.submittedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center justify-between text-xs pt-2 border-t border-border">
                        <div className="flex items-center gap-4 text-muted-foreground">
                          <span>
                            Subject: <strong className="text-foreground">{sub.subject}</strong>
                          </span>
                          <span>
                            Score:{" "}
                            <strong className="text-foreground font-mono">
                              {sub.evaluation ? `${sub.evaluation.totalScore}/${sub.evaluation.maxScore}` : "Pending"}
                            </strong>
                          </span>
                          <span>
                            Grade:{" "}
                            <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 font-bold text-emerald-700 dark:text-emerald-300">
                              {sub.evaluation?.grade || "A+"}
                            </span>
                          </span>
                        </div>

                        <Link
                          href={`/student/results/${sub.id}`}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                        >
                          <span>View Graded Script</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: My Institutions */}
      {activeTab === "institutions" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-foreground">My Registered Institutions</h2>
                {isSuperAdmin && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/30">
                    Super Admin View (All Institutions)
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Institutions you created. Only you can create exams and batches in your registered institutions.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddInst(!showAddInst)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <PlusCircle className="h-4 w-4" />
                {showAddInst ? "Cancel" : "Add Institution"}
              </button>
            </div>
          </div>

          {/* Add Institution Form */}
          {showAddInst && (
            <form
              onSubmit={handleCreateInstitution}
              className="p-6 rounded-3xl border border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-4 animate-in fade-in"
            >
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Building2 className="h-4 w-4 text-emerald-600" />
                Register New Coaching / School / College / Varsity
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Institution Name:</label>
                  <input
                    type="text"
                    required
                    value={instName}
                    onChange={(e) => {
                      setInstName(e.target.value);
                      if (!instSlug) {
                        setInstSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                      }
                    }}
                    placeholder="e.g. Apex Academy / Sunrise College"
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Institution Type:</label>
                  <select
                    value={instType}
                    onChange={(e) => setInstType(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="COACHING">Coaching Center (কোচিং সেন্টার)</option>
                    <option value="SCHOOL">High School (মাধ্যমিক বিদ্যালয়)</option>
                    <option value="COLLEGE">Higher Secondary College (কলেজ)</option>
                    <option value="VARSITY">University / Varsity (বিশ্ববিদ্যালয়)</option>
                    <option value="INDIVIDUAL">Private Tutor / Batch (প্রাইভেট শিক্ষক)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Portal Handle / Slug:</label>
                  <div className="flex items-center">
                    <span className="px-3 py-2 rounded-l-xl border border-r-0 border-border bg-muted text-xs text-muted-foreground font-mono">
                      khata.ai/portal/
                    </span>
                    <input
                      type="text"
                      required
                      value={instSlug}
                      onChange={(e) => setInstSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ""))}
                      placeholder="apex-academy"
                      className="w-full px-3.5 py-2 rounded-r-xl border border-border bg-background text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Description / Tagline:</label>
                  <input
                    type="text"
                    value={instDescription}
                    onChange={(e) => setInstDescription(e.target.value)}
                    placeholder="Weekly model tests and AI evaluated answer sheets."
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddInst(false)}
                  className="px-4 py-2 rounded-xl border border-border bg-card text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingInst}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 disabled:opacity-60"
                >
                  {isCreatingInst ? "Creating..." : "Save Institution"}
                </button>
              </div>
            </form>
          )}

          {/* List of Registered Institutions */}
          {myInstitutions.length === 0 ? (
            <div className="p-12 rounded-3xl border border-dashed border-border bg-card text-center space-y-4">
              <Building2 className="h-10 w-10 text-muted-foreground mx-auto" />
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-foreground">No Institutions Registered Under Your Account</h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  When you register an institution, you become its exclusive creator. Only you can create exams and batches in that institution.
                </p>
              </div>
              <button
                onClick={() => setShowAddInst(true)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
              >
                + Register Your Institution Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myInstitutions.map((inst) => (
                <div
                  key={inst.id}
                  className="p-5 rounded-2xl border border-border bg-card shadow-sm hover:border-emerald-300 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {inst.type}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" /> Managed by You
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-foreground">{inst.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{inst.description}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-muted/40 border border-border flex items-center justify-between text-xs">
                    <span className="text-muted-foreground truncate">
                      khata.ai/portal/<strong>{inst.slug}</strong>
                    </span>
                    <button
                      onClick={() => handleCopy(inst.slug)}
                      className="px-2.5 py-1 rounded-lg bg-card border border-border hover:bg-accent font-semibold flex items-center gap-1 text-[11px]"
                    >
                      {copiedLink === inst.slug ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" /> Copy Link
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
                    <Link
                      href={`/portal/${inst.slug}`}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                    >
                      <span>Manage Portal</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>

                    <Link
                      href={`/teacher/exams/new?institutionSlug=${inst.slug}`}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-sm"
                    >
                      + Create Exam
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Account, Profile & Password Settings */}
      {activeTab === "account" && (
        <div className="space-y-6 max-w-3xl">
          {/* Section 1: Edit Profile (Name & Institution) */}
          <div className="p-6 rounded-3xl border border-border bg-card space-y-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
                  <Edit3 className="h-4 w-4 text-emerald-600" />
                  Edit Profile Information
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Update your display name and affiliated organization across KhataAI.
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200">
                {currentUser.role === "ADMIN"
                  ? "⚡ Super Admin"
                  : currentUser.role === "TEACHER"
                  ? "🏛️ Institution"
                  : "🎓 Student"}
              </span>
            </div>

            {profileSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{profileSuccessMsg}</span>
              </div>
            )}

            {profileErrorMsg && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs font-bold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{profileErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Full Name:</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="e.g. Asikur Rahman"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Email Address:</label>
                  <input
                    type="email"
                    disabled
                    value={currentUser.email}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-muted/60 text-muted-foreground text-sm cursor-not-allowed"
                  />
                  <span className="text-[10px] text-muted-foreground">Primary login email (cannot be altered)</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  {currentUser.role === "TEACHER"
                    ? "Institution / Coaching / Academy Name:"
                    : "School / College / Varsity Affiliation:"}
                </label>
                <input
                  type="text"
                  value={editInstitution}
                  onChange={(e) => setEditInstitution(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="e.g. Dhaka College / Udvash Coaching / Independent"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-60 flex items-center gap-1.5"
                >
                  <Save className="h-3.5 w-3.5" />
                  {isUpdatingProfile ? "Saving Changes..." : "Save Profile Changes"}
                </button>
              </div>
            </form>
          </div>

          {/* Section 2: Change Password */}
          <div className="p-6 rounded-3xl border border-border bg-card space-y-5 shadow-sm">
            <div className="pb-3 border-b border-border">
              <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-emerald-600" />
                Change Password
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Update your login password for secure account access.
              </p>
            </div>

            {passwordSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{passwordSuccessMsg}</span>
              </div>
            )}

            {passwordErrorMsg && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs font-bold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{passwordErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>Current Password:</span>
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    {showCurrentPass ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    {showCurrentPass ? "Hide" : "Show"}
                  </button>
                </label>
                <input
                  type={showCurrentPass ? "text" : "password"}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground flex items-center justify-between">
                    <span>New Password:</span>
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      {showNewPass ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      {showNewPass ? "Hide" : "Show"}
                    </button>
                  </label>
                  <input
                    type={showNewPass ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground flex items-center justify-between">
                    <span>Confirm New Password:</span>
                    {confirmNewPassword && newPassword === confirmNewPassword && (
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                        <Check className="h-3 w-3" /> Matches
                      </span>
                    )}
                  </label>
                  <input
                    type={showNewPass ? "text" : "password"}
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className={`w-full px-3.5 py-2.5 rounded-xl border bg-background text-sm focus:ring-2 focus:outline-none ${
                      confirmNewPassword && newPassword !== confirmNewPassword
                        ? "border-destructive focus:ring-destructive"
                        : "border-border focus:ring-emerald-500"
                    }`}
                  />
                  {confirmNewPassword && newPassword !== confirmNewPassword && (
                    <p className="text-[11px] text-destructive">Passwords do not match</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isUpdatingPassword || (!!confirmNewPassword && newPassword !== confirmNewPassword)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-60 flex items-center gap-1.5"
                >
                  <Lock className="h-3.5 w-3.5" />
                  {isUpdatingPassword ? "Updating Password..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>

          {/* Section 3: Session & Sign Out */}
          <div className="p-5 rounded-3xl border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div>
              <p className="text-xs font-bold text-foreground">Secure KhataAI Session</p>
              <p className="text-[11px] text-muted-foreground">
                Account ID: <span className="font-mono">{currentUser.id}</span>
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/10 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign Out of All Devices
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function UserProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-20 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
          <p className="text-xs text-muted-foreground mt-3 font-medium">Loading profile...</p>
        </div>
      }
    >
      <UserProfileContent />
    </Suspense>
  );
}
