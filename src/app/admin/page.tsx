"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Building2,
  Users,
  Award,
  Cpu,
  BookOpen,
  Activity,
  ArrowRight,
  Sparkles,
  Server,
  CreditCard,
  Sliders,
  CheckCircle2,
  Clock,
  RefreshCw,
  Search,
  Plus,
  ExternalLink,
  Edit3,
  Trash2,
  Check,
  X,
  UserCheck,
  GraduationCap,
  School,
  Lock,
  ChevronRight,
  Zap,
} from "lucide-react";
import { AdminGuard } from "@/components/admin/AdminGuard";

interface PlanConfig {
  id: string;
  name: string;
  priceBdt: number;
  priceUsd: number;
  description: string;
  maxStudents: number;
  maxEvaluations: number;
  features: string[];
  popular: boolean;
}

export default function SuperAdminPortalPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "students" | "teachers" | "plans" | "ai"
  >("overview");

  // Telemetry & metrics state
  const [stats, setStats] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Student portal control state
  const [students, setStudents] = useState<any[]>([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any | null>(null);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [newStudentRoll, setNewStudentRoll] = useState("");
  const [newStudentBatch, setNewStudentBatch] = useState("Batch 2026 Alpha");

  // Teacher & Institution portal control state
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [instSearch, setInstSearch] = useState("");
  const [showAddInstModal, setShowAddInstModal] = useState(false);
  const [editingInstitution, setEditingInstitution] = useState<any | null>(null);
  const [newInstName, setNewInstName] = useState("");
  const [newInstSlug, setNewInstSlug] = useState("");
  const [newInstEmail, setNewInstEmail] = useState("");
  const [newInstPlan, setNewInstPlan] = useState("PRO");

  // Plan & Subscription management state
  const [plans, setPlans] = useState<PlanConfig[]>([]);
  const [currency, setCurrency] = useState<"BDT" | "USD">("BDT");
  const [editingPlan, setEditingPlan] = useState<PlanConfig | null>(null);
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [newPlanName, setNewPlanName] = useState("");
  const [newPlanPriceBdt, setNewPlanPriceBdt] = useState(2500);
  const [newPlanPriceUsd, setNewPlanPriceUsd] = useState(25);
  const [newPlanStudents, setNewPlanStudents] = useState(200);
  const [newPlanEvals, setNewPlanEvals] = useState(1000);
  const [newPlanDesc, setNewPlanDesc] = useState("");
  const [newPlanFeatures, setNewPlanFeatures] = useState("Dedicated OCR Pipeline, Priority Batch Grading");
  const [planSaveMessage, setPlanSaveMessage] = useState("");
  const [pendingReqsCount, setPendingReqsCount] = useState(0);

  // Sync tab from URL if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (
        tabParam &&
        ["overview", "students", "teachers", "plans", "ai"].includes(tabParam)
      ) {
        setActiveTab(tabParam as any);
      }
    }
  }, []);

  const fetchAllAdminData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, studentsRes, instRes, plansRes, reqsRes] = await Promise.all([
        fetch("/api/admin/analytics"),
        fetch("/api/students"),
        fetch("/api/institutions"),
        fetch("/api/admin/plans"),
        fetch("/api/subscription/request"),
      ]);

      const analyticsData = await analyticsRes.json();
      const studentsData = await studentsRes.json();
      const instData = await instRes.json();
      const plansData = await plansRes.json();
      const reqsData = await reqsRes.json();

      if (analyticsData.success) {
        setStats(analyticsData.stats);
        setActivity(analyticsData.recentActivity || []);
      }
      if (studentsData.success && studentsData.students) {
        setStudents(studentsData.students);
      }
      if (instData.success && instData.institutions) {
        setInstitutions(instData.institutions);
      }
      if (plansData.success && plansData.plans) {
        setPlans(plansData.plans);
      }
      if (reqsData.success) {
        setPendingReqsCount(reqsData.pendingCount || 0);
      }
    } catch (err) {
      console.error("Admin data loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAdminData();
  }, []);

  // Update an institution's plan
  const handleAssignPlan = async (institutionId: string, newPlan: string) => {
    try {
      const res = await fetch("/api/admin/plans", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ASSIGN_INSTITUTION_PLAN",
          institutionId,
          newPlan,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPlanSaveMessage(`Updated institution plan to ${newPlan}`);
        setTimeout(() => setPlanSaveMessage(""), 4000);
        fetchAllAdminData();
      } else {
        alert(data.error || "Failed to update plan");
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Save edited plan configuration
  const handleSavePlanConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    try {
      const res = await fetch("/api/admin/plans", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_PLAN_DEFINITION",
          planId: editingPlan.id,
          name: editingPlan.name,
          priceBdt: editingPlan.priceBdt,
          priceUsd: editingPlan.priceUsd,
          maxStudents: editingPlan.maxStudents,
          maxEvaluations: editingPlan.maxEvaluations,
          description: editingPlan.description,
          features: editingPlan.features,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPlanSaveMessage(`Successfully saved ${editingPlan.name} settings!`);
        setTimeout(() => setPlanSaveMessage(""), 4000);
        setEditingPlan(null);
        fetchAllAdminData();
      } else {
        alert(data.error || "Failed to update plan settings");
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Create new institution
  const handleCreateInstitution = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/institutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newInstName,
          slug: newInstSlug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
          contactEmail: newInstEmail,
          subscriptionTier: newInstPlan,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddInstModal(false);
        setNewInstName("");
        setNewInstSlug("");
        setNewInstEmail("");
        fetchAllAdminData();
      } else {
        alert(data.error || "Failed to register institution");
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Create new student
  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: newStudentName,
          studentEmail: newStudentEmail,
          studentRoll: newStudentRoll,
          batchName: newStudentBatch,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddStudentModal(false);
        setNewStudentName("");
        setNewStudentEmail("");
        setNewStudentRoll("");
        setPlanSaveMessage(`Student ${newStudentName} successfully enrolled!`);
        setTimeout(() => setPlanSaveMessage(""), 4000);
        fetchAllAdminData();
      } else {
        alert(data.error || "Failed to enroll student");
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Update existing student
  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    try {
      const res = await fetch("/api/students", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingStudent._id || editingStudent.id,
          name: editingStudent.name,
          email: editingStudent.email,
          rollNumber: editingStudent.rollNumber || editingStudent.rollNo,
          batchName: editingStudent.batchName,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPlanSaveMessage(`Student ${editingStudent.name} updated successfully!`);
        setTimeout(() => setPlanSaveMessage(""), 4000);
        setEditingStudent(null);
        fetchAllAdminData();
      } else {
        alert(data.error || "Failed to update student");
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Delete student
  const handleDeleteStudent = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete student "${name}"?`)) return;
    try {
      const res = await fetch(`/api/students?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setPlanSaveMessage(`Student ${name} deleted successfully.`);
        setTimeout(() => setPlanSaveMessage(""), 4000);
        fetchAllAdminData();
      } else {
        alert(data.error || "Failed to delete student");
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Update existing institution
  const handleUpdateInstitution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInstitution) return;
    try {
      const res = await fetch("/api/institutions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingInstitution._id || editingInstitution.id,
          name: editingInstitution.name,
          slug: editingInstitution.slug,
          contactEmail: editingInstitution.contactEmail,
          subscriptionPlan: editingInstitution.subscriptionTier || editingInstitution.subscriptionPlan,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPlanSaveMessage(`Institution ${editingInstitution.name} updated successfully!`);
        setTimeout(() => setPlanSaveMessage(""), 4000);
        setEditingInstitution(null);
        fetchAllAdminData();
      } else {
        alert(data.error || "Failed to update institution");
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Delete institution
  const handleDeleteInstitution = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete institution "${name}"? This removes their portal configuration.`)) return;
    try {
      const res = await fetch(`/api/institutions?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setPlanSaveMessage(`Institution ${name} removed.`);
        setTimeout(() => setPlanSaveMessage(""), 4000);
        fetchAllAdminData();
      } else {
        alert(data.error || "Failed to delete institution");
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Create custom subscription plan
  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newPlanName,
          priceBdt: Number(newPlanPriceBdt),
          priceUsd: Number(newPlanPriceUsd),
          maxStudents: Number(newPlanStudents),
          maxEvaluations: Number(newPlanEvals),
          description: newPlanDesc,
          features: newPlanFeatures.split(",").map((f) => f.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPlanSaveMessage(`Subscription plan "${newPlanName}" created successfully!`);
        setTimeout(() => setPlanSaveMessage(""), 4000);
        setShowAddPlanModal(false);
        setNewPlanName("");
        fetchAllAdminData();
      } else {
        alert(data.error || "Failed to create plan");
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Delete custom subscription plan
  const handleDeletePlan = async (planId: string, planName: string) => {
    if (!confirm(`Are you sure you want to delete custom plan "${planName}"?`)) return;
    try {
      const res = await fetch(`/api/admin/plans?planId=${planId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setPlanSaveMessage(`Plan ${planName} deleted.`);
        setTimeout(() => setPlanSaveMessage(""), 4000);
        fetchAllAdminData();
      } else {
        alert(data.error || "Failed to delete plan");
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Filtered queries
  const filteredStudents = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email?.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.rollNumber?.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const filteredInstitutions = institutions.filter(
    (i) =>
      i.name?.toLowerCase().includes(instSearch.toLowerCase()) ||
      i.slug?.toLowerCase().includes(instSearch.toLowerCase())
  );

  return (
    <AdminGuard>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-8">
        {/* Super Admin Top Command Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              KhataAI Platform • Super Administrator Command Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Platform Control Center & Subscription Governance
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Full control over student and teacher portals, real-time quota overrides, custom plan pricing, and AI evaluation engine parameters.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-between gap-3 relative z-10 border-t border-white/10 mt-4">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              MongoDB Atlas: Connected • Gemini 2.0 Flash: Operational
            </div>

            <button
              onClick={fetchAllAdminData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors border border-white/20"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Data
            </button>
          </div>
        </div>

        {/* Pending Subscription Request Alert Banner */}
        {pendingReqsCount > 0 && (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/15 border-2 border-amber-500/40 text-amber-900 dark:text-amber-200 text-xs font-bold flex flex-wrap items-center justify-between gap-4 shadow-lg animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <div className="font-black text-sm sm:text-base flex items-center gap-2">
                  <span>
                    {pendingReqsCount} Pending Subscription Request{pendingReqsCount > 1 ? "s" : ""}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950">
                    Action Required
                  </span>
                </div>
                <p className="text-xs font-normal opacity-90 mt-0.5">
                  Teachers or students have submitted new plan requests with bKash/Nagad verification awaiting Super Admin activation.
                </p>
              </div>
            </div>

            <Link
              href="/admin/subscriptions?tab=requests"
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 flex items-center gap-2 transition-all"
            >
              Review & Activate ({pendingReqsCount}) <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* Success Alert Banner */}
        {planSaveMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{planSaveMessage}</span>
          </div>
        )}

        {/* Global KPI Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-bold uppercase">
              <span>Institutions</span>
              <Building2 className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-foreground">
              {stats?.totalInstitutions ?? institutions.length ?? "..."}
            </div>
            <p className="text-[11px] text-muted-foreground">Schools, Colleges & Chains</p>
          </div>

          <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-bold uppercase">
              <span>Active Students</span>
              <Users className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-foreground">
              {stats?.totalStudents ?? students.length ?? "..."}
            </div>
            <p className="text-[11px] text-muted-foreground">Enrolled in Batches</p>
          </div>

          <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-bold uppercase">
              <span>Subscription Plans</span>
              <CreditCard className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-foreground">
              {plans.length > 0 ? plans.length : 3} Tiers
            </div>
            <p className="text-[11px] text-muted-foreground">Free, Pro, Enterprise</p>
          </div>

          <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-bold uppercase">
              <span>AI Evaluations</span>
              <Cpu className="h-4 w-4 text-rose-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-foreground">
              {stats?.totalEvaluations ?? "..."}
            </div>
            <p className="text-[11px] text-muted-foreground">Scripts Graded with OCR</p>
          </div>
        </div>

        {/* Main Portal Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "overview"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <Activity className="h-4 w-4" />
            Overview & Telemetry
          </button>

          <button
            onClick={() => setActiveTab("teachers")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "teachers"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <Building2 className="h-4 w-4" />
            Teacher & Institution Portal ({institutions.length})
          </button>

          <button
            onClick={() => setActiveTab("students")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "students"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            Student Portal Control ({students.length})
          </button>

          <button
            onClick={() => setActiveTab("plans")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "plans"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <CreditCard className="h-4 w-4" />
            Plan & Subscription Manager
          </button>

          <Link
            href="/admin/ai-settings"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-card border border-border text-muted-foreground hover:text-foreground hover:border-emerald-500 whitespace-nowrap transition-all"
          >
            <Sliders className="h-4 w-4 text-emerald-600" />
            AI Engine Settings →
          </Link>
        </div>

        {/* ─── TAB 1: OVERVIEW & TELEMETRY ───────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div
                onClick={() => setActiveTab("teachers")}
                className="p-6 rounded-3xl border border-border bg-card hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center border border-emerald-200 dark:border-emerald-800 group-hover:scale-105 transition-transform">
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-base text-foreground mt-4">
                  Teacher & Institution Management
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Control all institutions, assign cohorts, manage teacher faculties, and launch live portals.
                </p>
                <div className="mt-4 flex items-center justify-between text-xs font-bold text-emerald-600">
                  <span>Open Teacher Control</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              <div
                onClick={() => setActiveTab("students")}
                className="p-6 rounded-3xl border border-border bg-card hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center border border-indigo-200 dark:border-indigo-800 group-hover:scale-105 transition-transform">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-base text-foreground mt-4">
                  Student Portal & Submissions Control
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Inspect examinee profiles, monitor handwritten paper uploads, and review AI graded scripts.
                </p>
                <div className="mt-4 flex items-center justify-between text-xs font-bold text-indigo-600">
                  <span>Open Student Control</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              <div
                onClick={() => setActiveTab("plans")}
                className="p-6 rounded-3xl border border-border bg-card hover:border-amber-500 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="h-12 w-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center border border-amber-200 dark:border-amber-800 group-hover:scale-105 transition-transform">
                  <CreditCard className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-base text-foreground mt-4">
                  Plan & Subscription Manager
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Set prices in BDT/USD, update student quotas, edit features, and reassign institution tiers.
                </p>
                <div className="mt-4 flex items-center justify-between text-xs font-bold text-amber-600">
                  <span>Configure Plans</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Live Audit Log */}
            <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-600" />
                  Live Platform Audit Feed
                </h3>
                <span className="text-xs text-muted-foreground">Real-time MongoDB logs</span>
              </div>

              <div className="space-y-2">
                {activity.map((act) => (
                  <div
                    key={act.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {act.type}
                      </span>
                      <span className="text-foreground">{act.message}</span>
                    </div>
                    <span className="text-muted-foreground font-mono text-[11px]">
                      {new Date(act.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 2: TEACHER & INSTITUTION PORTAL CONTROL ───────────────────── */}
        {activeTab === "teachers" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="h-4 w-4 absolute left-3.5 top-3 text-muted-foreground" />
                <input
                  type="text"
                  value={instSearch}
                  onChange={(e) => setInstSearch(e.target.value)}
                  placeholder="Search institutions by name or slug..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/teacher"
                  className="px-3.5 py-2.5 rounded-xl border border-border bg-card hover:bg-accent text-xs font-bold text-foreground inline-flex items-center gap-1.5"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-emerald-600" /> Launch Teacher Portal
                </Link>

                <button
                  onClick={() => setShowAddInstModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                >
                  <Plus className="h-4 w-4" /> Add Institution
                </button>
              </div>
            </div>

            {/* Institutions Table with Quick Plan Controls */}
            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 border-b border-border text-muted-foreground uppercase text-[10px] font-bold">
                    <tr>
                      <th className="px-5 py-3.5">Institution</th>
                      <th className="px-5 py-3.5">Slug ID</th>
                      <th className="px-5 py-3.5">Contact Email</th>
                      <th className="px-5 py-3.5">Assigned Subscription Plan</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Teacher Portal Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredInstitutions.map((inst) => (
                      <tr key={inst.id} className="hover:bg-muted/20">
                        <td className="px-5 py-4 font-bold text-foreground">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold">
                              {inst.name.charAt(0)}
                            </div>
                            <span>{inst.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-mono text-muted-foreground">
                          @{inst.slug}
                        </td>
                        <td className="px-5 py-4 text-muted-foreground">
                          {inst.contactEmail || `admin@${inst.slug}.edu.bd`}
                        </td>
                        <td className="px-5 py-4">
                          <select
                            value={inst.subscriptionTier || "PRO"}
                            onChange={(e) => handleAssignPlan(inst.id, e.target.value)}
                            className="px-2.5 py-1 rounded-lg border border-border bg-background font-bold text-xs text-foreground focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          >
                            <option value="FREE">FREE / PILOT (50 students)</option>
                            <option value="PRO">PRO PLAN (500 students)</option>
                            <option value="ENTERPRISE">ENTERPRISE (Unlimited)</option>
                          </select>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Active
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingInstitution(inst)}
                              className="p-1.5 rounded-lg border border-border bg-card hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 text-muted-foreground transition-colors"
                              title="Edit Institution"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteInstitution(inst._id || inst.id, inst.name)}
                              className="p-1.5 rounded-lg border border-border bg-card hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 text-muted-foreground transition-colors"
                              title="Delete Institution"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <Link
                              href="/teacher"
                              className="px-2.5 py-1.5 rounded-lg border border-border bg-card hover:bg-accent text-[11px] font-bold text-foreground inline-flex items-center gap-1"
                            >
                              Launch <ExternalLink className="h-3 w-3" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 3: STUDENT PORTAL CONTROL ─────────────────────────────────── */}
        {activeTab === "students" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="h-4 w-4 absolute left-3.5 top-3 text-muted-foreground" />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Search students by name, email, or roll..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/student"
                  className="px-3.5 py-2.5 rounded-xl border border-border bg-card hover:bg-accent text-xs font-bold text-foreground inline-flex items-center gap-1.5"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-emerald-600" /> Enter Student Arena
                </Link>

                <button
                  onClick={() => setShowAddStudentModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                >
                  <Plus className="h-4 w-4" /> Enroll Student
                </button>
              </div>
            </div>

            {/* Students Directory Table */}
            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 border-b border-border text-muted-foreground uppercase text-[10px] font-bold">
                    <tr>
                      <th className="px-5 py-3.5">Student Name</th>
                      <th className="px-5 py-3.5">Email Address</th>
                      <th className="px-5 py-3.5">Roll Number</th>
                      <th className="px-5 py-3.5">Assigned Cohort / Batch</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Control Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredStudents.map((st) => (
                      <tr key={st.id} className="hover:bg-muted/20">
                        <td className="px-5 py-4 font-bold text-foreground">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold">
                              {st.name.charAt(0)}
                            </div>
                            <span>{st.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-mono text-muted-foreground">
                          {st.email}
                        </td>
                        <td className="px-5 py-4 font-bold text-foreground">
                          {st.rollNumber || "Roll 101"}
                        </td>
                        <td className="px-5 py-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {st.batchName || "HSC 2026 Alpha"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Active
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingStudent(st)}
                              className="p-1.5 rounded-lg border border-border bg-card hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 text-muted-foreground transition-colors"
                              title="Edit Student Profile"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(st._id || st.id, st.name)}
                              className="p-1.5 rounded-lg border border-border bg-card hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 text-muted-foreground transition-colors"
                              title="Delete Student"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <Link
                              href="/student"
                              className="px-2.5 py-1.5 rounded-lg border border-border bg-card hover:bg-accent text-[11px] font-bold text-foreground inline-flex items-center gap-1"
                            >
                              Arena <ChevronRight className="h-3 w-3" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 4: PLAN & SUBSCRIPTION MANAGER (SET, UPDATE & MANAGE) ─────── */}
        {activeTab === "plans" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-emerald-600" />
                  Subscription Plans & Quota Management
                </h2>
                <p className="text-xs text-muted-foreground">
                  Set prices, student quota limits, evaluation caps, and modify plan features in real time.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowAddPlanModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                >
                  <Plus className="h-3.5 w-3.5" /> Add New Plan
                </button>

                <Link
                  href="/admin/subscriptions"
                  className="px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-accent text-xs font-bold text-foreground inline-flex items-center gap-1.5"
                >
                  <Users className="h-3.5 w-3.5 text-emerald-600" /> User & Subscription Manager →
                </Link>

                {/* Currency Toggle */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-card border border-border">
                  <button
                    onClick={() => setCurrency("BDT")}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      currency === "BDT"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    ৳ BDT
                  </button>
                  <button
                    onClick={() => setCurrency("USD")}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      currency === "USD"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    $ USD
                  </button>
                </div>
              </div>
            </div>

            {/* 3 Interactive Plan Pricing & Config Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((p) => {
                const price =
                  currency === "BDT"
                    ? `৳ ${p.priceBdt.toLocaleString()}`
                    : `$ ${p.priceUsd}`;

                return (
                  <div
                    key={p.id}
                    className={`rounded-3xl border bg-card p-6 shadow-sm flex flex-col justify-between space-y-6 relative overflow-hidden ${
                      p.popular
                        ? "border-emerald-500 shadow-emerald-500/10"
                        : "border-border"
                    }`}
                  >
                    {p.popular && (
                      <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow-sm">
                        Recommended
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-black text-foreground">{p.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{p.description}</p>
                      </div>

                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-foreground">{price}</span>
                        <span className="text-xs text-muted-foreground">/ month</span>
                      </div>

                      {/* Quotas Summary */}
                      <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-muted/40 border border-border text-xs">
                        <div>
                          <div className="text-[10px] text-muted-foreground uppercase font-bold">
                            Max Students
                          </div>
                          <div className="font-extrabold text-foreground">
                            {p.maxStudents > 2000 ? "Unlimited" : p.maxStudents}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-muted-foreground uppercase font-bold">
                            AI Evaluations
                          </div>
                          <div className="font-extrabold text-foreground">
                            {p.maxEvaluations > 5000 ? "Unlimited" : p.maxEvaluations} / mo
                          </div>
                        </div>
                      </div>

                      {/* Features list */}
                      <div className="pt-2 border-t border-border space-y-2">
                        <div className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider">
                          Included Features:
                        </div>
                        <ul className="space-y-1.5 text-xs text-foreground/90">
                          {p.features.map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => setEditingPlan(p)}
                        className="flex-1 py-2.5 rounded-xl border border-border bg-card hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-500 font-bold text-xs text-foreground hover:text-emerald-700 flex items-center justify-center gap-1.5 transition-all shadow-sm"
                      >
                        <Edit3 className="h-3.5 w-3.5 text-emerald-600" />
                        Edit Plan
                      </button>
                      {!["FREE", "PRO", "ENTERPRISE"].includes(p.id) && (
                        <button
                          onClick={() => handleDeletePlan(p.id, p.name)}
                          className="p-2.5 rounded-xl border border-border bg-card hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:border-rose-400 text-muted-foreground hover:text-rose-600 transition-all shadow-sm"
                          title="Delete Plan"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Institution Plan Roster & Quick Assignment */}
            <div className="rounded-2xl border border-border bg-card shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-emerald-600" />
                  Institutions Subscription Roster
                </h3>
                <span className="text-xs text-muted-foreground">Single-click tier assignment</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 border-b border-border text-muted-foreground uppercase text-[10px] font-bold">
                    <tr>
                      <th className="px-4 py-3">Institution</th>
                      <th className="px-4 py-3">Slug</th>
                      <th className="px-4 py-3">Assigned Plan</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Set / Change Plan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {institutions.map((inst) => (
                      <tr key={inst.id} className="hover:bg-muted/20">
                        <td className="px-4 py-3.5 font-bold text-foreground">
                          {inst.name}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-muted-foreground">
                          @{inst.slug}
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              inst.subscriptionTier === "ENTERPRISE"
                                ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                                : inst.subscriptionTier === "PRO"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-muted text-foreground border border-border"
                            }`}
                          >
                            {inst.subscriptionTier || "PRO"}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-emerald-600 font-bold">Active</span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <select
                            value={inst.subscriptionTier || "PRO"}
                            onChange={(e) => handleAssignPlan(inst.id, e.target.value)}
                            className="px-3 py-1.5 rounded-xl border border-border bg-background text-xs font-bold text-foreground focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          >
                            <option value="FREE">Assign FREE / PILOT</option>
                            <option value="PRO">Assign PRO TIER</option>
                            <option value="ENTERPRISE">Assign ENTERPRISE</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL: EDIT PLAN SETTINGS ─────────────────────────────────────── */}
        {editingPlan && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-emerald-600" />
                  <h3 className="font-extrabold text-sm text-foreground">
                    Edit Plan Settings — {editingPlan.name}
                  </h3>
                </div>
                <button
                  onClick={() => setEditingPlan(null)}
                  className="text-xs text-muted-foreground hover:text-foreground font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSavePlanConfig} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Plan Display Name:</label>
                  <input
                    type="text"
                    required
                    value={editingPlan.name}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, name: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-foreground">Price in BDT (৳):</label>
                    <input
                      type="number"
                      required
                      value={editingPlan.priceBdt}
                      onChange={(e) =>
                        setEditingPlan({
                          ...editingPlan,
                          priceBdt: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-foreground">Price in USD ($):</label>
                    <input
                      type="number"
                      required
                      value={editingPlan.priceUsd}
                      onChange={(e) =>
                        setEditingPlan({
                          ...editingPlan,
                          priceUsd: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-foreground">Max Students Limit:</label>
                    <input
                      type="number"
                      required
                      value={editingPlan.maxStudents}
                      onChange={(e) =>
                        setEditingPlan({
                          ...editingPlan,
                          maxStudents: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-foreground">Max Monthly Scripts:</label>
                    <input
                      type="number"
                      required
                      value={editingPlan.maxEvaluations}
                      onChange={(e) =>
                        setEditingPlan({
                          ...editingPlan,
                          maxEvaluations: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Plan Description:</label>
                  <input
                    type="text"
                    value={editingPlan.description}
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setEditingPlan(null)}
                    className="px-4 py-2 rounded-xl border border-border hover:bg-accent font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20"
                  >
                    Save Plan Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── MODAL: ADD NEW INSTITUTION ────────────────────────────────────── */}
        {showAddInstModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-emerald-600" />
                  Register New Institution
                </h3>
                <button
                  onClick={() => setShowAddInstModal(false)}
                  className="text-xs text-muted-foreground hover:text-foreground font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateInstitution} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Institution Name:</label>
                  <input
                    type="text"
                    required
                    value={newInstName}
                    onChange={(e) => {
                      setNewInstName(e.target.value);
                      if (!newInstSlug) {
                        setNewInstSlug(
                          e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-")
                        );
                      }
                    }}
                    placeholder="e.g. Notre Dame College, Dhaka"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Slug Identifier:</label>
                  <input
                    type="text"
                    required
                    value={newInstSlug}
                    onChange={(e) => setNewInstSlug(e.target.value)}
                    placeholder="e.g. ndc-dhaka"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Contact Email:</label>
                  <input
                    type="email"
                    required
                    value={newInstEmail}
                    onChange={(e) => setNewInstEmail(e.target.value)}
                    placeholder="admin@ndc.edu.bd"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Initial Subscription Tier:</label>
                  <select
                    value={newInstPlan}
                    onChange={(e) => setNewInstPlan(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="FREE">PILOT / FREE</option>
                    <option value="PRO">PRO PLAN</option>
                    <option value="ENTERPRISE">ENTERPRISE</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowAddInstModal(false)}
                    className="px-4 py-2 rounded-xl border border-border hover:bg-accent font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20"
                  >
                    Register Institution
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── MODAL: ENROLL STUDENT ─────────────────────────────────────────── */}
        {showAddStudentModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-emerald-600" />
                  Enroll New Student
                </h3>
                <button
                  onClick={() => setShowAddStudentModal(false)}
                  className="text-xs text-muted-foreground hover:text-foreground font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateStudent} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Student Full Name:</label>
                  <input
                    type="text"
                    required
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    placeholder="e.g. Farhan Tanvir"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Email Address:</label>
                  <input
                    type="email"
                    required
                    value={newStudentEmail}
                    onChange={(e) => setNewStudentEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Roll / Registration ID:</label>
                  <input
                    type="text"
                    required
                    value={newStudentRoll}
                    onChange={(e) => setNewStudentRoll(e.target.value)}
                    placeholder="e.g. 2026-ENG-44"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Assign Cohort / Batch:</label>
                  <input
                    type="text"
                    required
                    value={newStudentBatch}
                    onChange={(e) => setNewStudentBatch(e.target.value)}
                    placeholder="e.g. HSC 2026 Alpha"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowAddStudentModal(false)}
                    className="px-4 py-2 rounded-xl border border-border hover:bg-accent font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20"
                  >
                    Enroll Student
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* ─── MODAL: EDIT INSTITUTION ──────────────────────────────────────── */}
        {editingInstitution && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-emerald-600" />
                  Edit Institution — {editingInstitution.name}
                </h3>
                <button
                  onClick={() => setEditingInstitution(null)}
                  className="text-xs text-muted-foreground hover:text-foreground font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdateInstitution} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Institution Name:</label>
                  <input
                    type="text"
                    required
                    value={editingInstitution.name}
                    onChange={(e) =>
                      setEditingInstitution({ ...editingInstitution, name: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Slug Identifier:</label>
                  <input
                    type="text"
                    required
                    value={editingInstitution.slug}
                    onChange={(e) =>
                      setEditingInstitution({ ...editingInstitution, slug: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Contact Email:</label>
                  <input
                    type="email"
                    required
                    value={editingInstitution.contactEmail || ""}
                    onChange={(e) =>
                      setEditingInstitution({ ...editingInstitution, contactEmail: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Subscription Tier:</label>
                  <select
                    value={editingInstitution.subscriptionTier || editingInstitution.subscriptionPlan || "PRO"}
                    onChange={(e) =>
                      setEditingInstitution({ ...editingInstitution, subscriptionTier: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="FREE">PILOT / FREE</option>
                    <option value="PRO">PRO PLAN</option>
                    <option value="ENTERPRISE">ENTERPRISE</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setEditingInstitution(null)}
                    className="px-4 py-2 rounded-xl border border-border hover:bg-accent font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── MODAL: EDIT STUDENT ───────────────────────────────────────────── */}
        {editingStudent && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-emerald-600" />
                  Edit Student Profile
                </h3>
                <button
                  onClick={() => setEditingStudent(null)}
                  className="text-xs text-muted-foreground hover:text-foreground font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdateStudent} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Student Full Name:</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.name}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, name: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Email Address:</label>
                  <input
                    type="email"
                    required
                    value={editingStudent.email}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, email: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Roll / Registration ID:</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.rollNumber || editingStudent.rollNo || ""}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, rollNumber: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Cohort / Batch:</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.batchName || ""}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, batchName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setEditingStudent(null)}
                    className="px-4 py-2 rounded-xl border border-border hover:bg-accent font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20"
                  >
                    Save Student Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── MODAL: ADD CUSTOM SUBSCRIPTION PLAN ────────────────────────────── */}
        {showAddPlanModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-emerald-600" />
                  <h3 className="font-extrabold text-sm text-foreground">
                    Create New Subscription Plan
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddPlanModal(false)}
                  className="text-xs text-muted-foreground hover:text-foreground font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreatePlan} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Plan Name:</label>
                  <input
                    type="text"
                    required
                    value={newPlanName}
                    onChange={(e) => setNewPlanName(e.target.value)}
                    placeholder="e.g. ULTIMATE ACADEMY TIER"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-foreground">Price in BDT (৳):</label>
                    <input
                      type="number"
                      required
                      value={newPlanPriceBdt}
                      onChange={(e) => setNewPlanPriceBdt(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-foreground">Price in USD ($):</label>
                    <input
                      type="number"
                      required
                      value={newPlanPriceUsd}
                      onChange={(e) => setNewPlanPriceUsd(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-foreground">Max Students Quota:</label>
                    <input
                      type="number"
                      required
                      value={newPlanStudents}
                      onChange={(e) => setNewPlanStudents(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-foreground">Monthly Evaluation Scripts:</label>
                    <input
                      type="number"
                      required
                      value={newPlanEvals}
                      onChange={(e) => setNewPlanEvals(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Short Description:</label>
                  <input
                    type="text"
                    value={newPlanDesc}
                    onChange={(e) => setNewPlanDesc(e.target.value)}
                    placeholder="Designed for premium colleges & high-volume coaching centers"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Included Features (comma separated):</label>
                  <input
                    type="text"
                    value={newPlanFeatures}
                    onChange={(e) => setNewPlanFeatures(e.target.value)}
                    placeholder="OCR Evaluation, Bengali & English Handwriting, SLA guarantee"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowAddPlanModal(false)}
                    className="px-4 py-2 rounded-xl border border-border hover:bg-accent font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20"
                  >
                    Create Subscription Plan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminGuard>
  );
}
