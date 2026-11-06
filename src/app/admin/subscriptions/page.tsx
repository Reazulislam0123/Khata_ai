"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Users,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  Zap,
  Building2,
  UserCheck,
  Award,
  Plus,
  Edit3,
  Trash2,
  Search,
  Filter,
  RefreshCw,
  UserPlus,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  GraduationCap,
  Clock,
} from "lucide-react";
import { AdminGuard } from "@/components/admin/AdminGuard";

interface PlanItem {
  id: string;
  name: string;
  priceBdt: number;
  priceUsd: number;
  description: string;
  maxStudents: number;
  maxEvaluations: number;
  features: string[];
  popular?: boolean;
}

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  institution?: string;
  batchName?: string;
  phone?: string;
  rollNo?: string;
  isActive: boolean;
  plan?: string;
  subscriptionStatus?: string;
  createdAt: string;
}

interface SubscriptionRequestItem {
  _id: string;
  userName: string;
  userEmail: string;
  userRole: "STUDENT" | "ADMIN" | "TEACHER";
  institutionName?: string;
  planId: string;
  planName: string;
  amount: number;
  currency: "BDT" | "USD";
  billingCycle: string;
  paymentMethod: "bkash" | "nagad" | "card" | "bank" | "direct";
  paymentPhone?: string;
  transactionId?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminNotes?: string;
  approvedAt?: string;
  approvedBy?: string;
  createdAt: string;
}

export default function UserAndSubscriptionManagementPage() {
  const [activeTab, setActiveTab] = useState<"plans" | "users" | "requests">("requests");

  // Requests state
  const [requests, setRequests] = useState<SubscriptionRequestItem[]>([]);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [requestStatusFilter, setRequestStatusFilter] = useState("ALL");
  const [requestSearch, setRequestSearch] = useState("");

  // Plans state
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [currency, setCurrency] = useState<"BDT" | "USD">("BDT");
  const [loadingPlans, setLoadingPlans] = useState(true);

  // Plan Modals state
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanItem | null>(null);
  const [planForm, setPlanForm] = useState({
    name: "",
    priceBdt: 0,
    priceUsd: 0,
    maxStudents: 100,
    maxEvaluations: 500,
    description: "",
    featuresStr: "",
  });

  // Users state
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userRoleFilter, setUserRoleFilter] = useState("ALL");
  const [userSearch, setUserSearch] = useState("");

  // User Modals state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    role: "STUDENT",
    phone: "",
    rollNo: "",
    institution: "",
  });

  const [notification, setNotification] = useState("");

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 4000);
  };

  // Sync tab from URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam && ["plans", "users", "requests"].includes(tabParam)) {
        setActiveTab(tabParam as any);
      }
    }
  }, []);

  // Load Requests
  const loadRequests = async () => {
    setLoadingRequests(true);
    try {
      const url = requestStatusFilter !== "ALL"
        ? `/api/subscription/request?status=${requestStatusFilter}`
        : `/api/subscription/request`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setRequests(data.requests || []);
        setPendingRequestsCount(data.pendingCount || 0);
      }
    } catch (err) {
      console.error("Requests load error:", err);
    } finally {
      setLoadingRequests(false);
    }
  };

  // Load Plans
  const loadPlans = async () => {
    setLoadingPlans(true);
    try {
      const res = await fetch("/api/admin/plans");
      const data = await res.json();
      if (data.success) {
        setPlans(data.plans || []);
        setInstitutions(data.institutions || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPlans(false);
    }
  };

  // Load Users
  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const url = userRoleFilter !== "ALL"
        ? `/api/admin/users?role=${userRoleFilter}&search=${encodeURIComponent(userSearch)}`
        : `/api/admin/users?search=${encodeURIComponent(userSearch)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.users) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadRequests();
    loadPlans();
  }, [requestStatusFilter]);

  useEffect(() => {
    loadUsers();
  }, [userRoleFilter, userSearch]);

  // ─── SUBSCRIPTION REQUEST ACTIVATION ACTIONS ─────────────────────────────────
  const handleApproveRequest = async (requestId: string, userName: string, planName: string) => {
    try {
      const res = await fetch("/api/subscription/request", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId,
          action: "APPROVE",
          approvedBy: "admin@khata.ai",
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Plan ${planName} activated for ${userName}! Full access granted.`);
        loadRequests();
        loadUsers();
        loadPlans();
      } else {
        alert(data.error || "Failed to activate plan");
      }
    } catch (err: any) {
      alert("Error activating plan: " + err.message);
    }
  };

  const handleRejectRequest = async (requestId: string, userName: string) => {
    const reason = prompt(`Enter rejection reason for ${userName}:`, "Payment verification failed or invalid TrxID");
    if (reason === null) return;

    try {
      const res = await fetch("/api/subscription/request", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId,
          action: "REJECT",
          adminNotes: reason,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Subscription request for ${userName} rejected.`);
        loadRequests();
        loadUsers();
      } else {
        alert(data.error || "Failed to reject request");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  // ─── PLAN CRUD ACTIONS ────────────────────────────────────────────────────────
  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const features = planForm.featuresStr
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean);

      const res = await fetch("/api/admin/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: planForm.name,
          priceBdt: planForm.priceBdt,
          priceUsd: planForm.priceUsd,
          maxStudents: planForm.maxStudents,
          maxEvaluations: planForm.maxEvaluations,
          description: planForm.description,
          features,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(data.message || "New plan created successfully!");
        setShowAddPlanModal(false);
        setPlanForm({
          name: "",
          priceBdt: 0,
          priceUsd: 0,
          maxStudents: 100,
          maxEvaluations: 500,
          description: "",
          featuresStr: "",
        });
        loadPlans();
      } else {
        alert(data.error || "Failed to create plan");
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdatePlan = async (e: React.FormEvent) => {
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
        showToast(`Plan ${editingPlan.name} updated successfully!`);
        setEditingPlan(null);
        loadPlans();
      } else {
        alert(data.error || "Failed to update plan");
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeletePlan = async (planId: string, planName: string) => {
    if (!confirm(`Are you sure you want to delete the "${planName}" subscription plan?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/plans?planId=${planId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Plan ${planName} deleted.`);
        loadPlans();
      } else {
        alert(data.error || "Failed to delete plan");
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

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
        showToast(`Institution plan reassigned to ${newPlan}.`);
        loadPlans();
      } else {
        alert(data.error || "Failed to assign plan");
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  // ─── USER CRUD ACTIONS ────────────────────────────────────────────────────────
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userForm),
      });

      const data = await res.json();
      if (data.success) {
        showToast(data.message || "User created successfully!");
        setShowAddUserModal(false);
        setUserForm({
          name: "",
          email: "",
          role: "STUDENT",
          phone: "",
          rollNo: "",
          institution: "",
        });
        loadUsers();
      } else {
        alert(data.error || "Failed to create user");
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: editingUser.id,
          name: editingUser.name,
          role: editingUser.role,
          phone: editingUser.phone,
          rollNo: editingUser.rollNo,
          isActive: editingUser.isActive,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast("User updated successfully!");
        setEditingUser(null);
        loadUsers();
      } else {
        alert(data.error || "Failed to update user");
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to permanently delete user "${userName}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showToast(`User ${userName} deleted.`);
        loadUsers();
      } else {
        alert(data.error || "Failed to delete user");
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <AdminGuard>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="p-2 rounded-xl border border-border hover:bg-accent transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-emerald-600" />
                User & Subscription Management
              </h1>
              <p className="text-xs text-muted-foreground">
                Super Admin editorial center: Create, edit, and delete subscription plans, student & faculty accounts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("requests")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "requests"
                  ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>Subscription Requests</span>
              {pendingRequestsCount > 0 ? (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 animate-pulse">
                  {pendingRequestsCount} Pending
                </span>
              ) : (
                <span className="opacity-70">({requests.length})</span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("plans")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "plans"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              Subscription Plans ({plans.length})
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "users"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              Platform Users ({users.length})
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {notification && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{notification}</span>
          </div>
        )}

        {/* ─── TAB 0: SUBSCRIPTION REQUESTS & SUPER ADMIN ACTIVATION ─────────── */}
        {activeTab === "requests" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="h-4 w-4 absolute left-3.5 top-3 text-muted-foreground" />
                <input
                  type="text"
                  value={requestSearch}
                  onChange={(e) => setRequestSearch(e.target.value)}
                  placeholder="Search requests by user, email, phone or transaction ID..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={requestStatusFilter}
                  onChange={(e) => setRequestStatusFilter(e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-border bg-card font-bold text-xs text-foreground focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="ALL">All Statuses ({requests.length})</option>
                  <option value="PENDING">Pending Super Admin Activation</option>
                  <option value="APPROVED">Active / Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>

                <button
                  onClick={loadRequests}
                  className="p-2.5 rounded-xl border border-border bg-card hover:bg-accent text-xs font-bold text-foreground"
                  title="Refresh requests"
                >
                  <RefreshCw className={`h-4 w-4 ${loadingRequests ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>

            {/* Subscription Requests Table */}
            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 border-b border-border text-muted-foreground uppercase text-[10px] font-bold">
                    <tr>
                      <th className="px-5 py-3.5">Applicant / User</th>
                      <th className="px-5 py-3.5">Role</th>
                      <th className="px-5 py-3.5">Requested Plan</th>
                      <th className="px-5 py-3.5">Amount</th>
                      <th className="px-5 py-3.5">Payment Details & TrxID</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Super Admin Activation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {requests
                      .filter(
                        (r) =>
                          r.userName?.toLowerCase().includes(requestSearch.toLowerCase()) ||
                          r.userEmail?.toLowerCase().includes(requestSearch.toLowerCase()) ||
                          r.transactionId?.toLowerCase().includes(requestSearch.toLowerCase()) ||
                          r.paymentPhone?.includes(requestSearch)
                      )
                      .map((req) => (
                        <tr key={req._id} className="hover:bg-muted/20">
                          <td className="px-5 py-4 font-bold text-foreground">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold">
                                {req.userName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="text-foreground">{req.userName}</div>
                                <div className="font-mono text-[11px] text-muted-foreground font-normal">
                                  {req.userEmail}
                                </div>
                                {req.institutionName && (
                                  <div className="text-[10px] text-muted-foreground/80 font-normal">
                                    {req.institutionName}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                                req.userRole === "STUDENT"
                                  ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              }`}
                            >
                              {req.userRole === "STUDENT" ? "🎓 Student" : "👨‍🏫 Teacher"}
                            </span>
                          </td>

                          <td className="px-5 py-4 font-bold text-foreground">
                            <div className="flex items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded-md bg-muted text-foreground font-extrabold text-[11px]">
                                {req.planName}
                              </span>
                            </div>
                          </td>

                          <td className="px-5 py-4 font-bold text-foreground">
                            <span>
                              {req.currency === "BDT" ? `৳ ${req.amount.toLocaleString()}` : `$ ${req.amount}`}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-normal block">
                              /{req.billingCycle || "month"}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    req.paymentMethod === "bkash"
                                      ? "bg-pink-100 text-pink-700 border border-pink-200"
                                      : req.paymentMethod === "nagad"
                                      ? "bg-orange-100 text-orange-700 border border-orange-200"
                                      : "bg-blue-100 text-blue-700 border border-blue-200"
                                  }`}
                                >
                                  {req.paymentMethod}
                                </span>
                                <span className="font-mono text-xs font-bold text-foreground">
                                  {req.paymentPhone || "—"}
                                </span>
                              </div>
                              <div className="font-mono text-[11px] text-emerald-600 font-bold">
                                TrxID: {req.transactionId || "N/A"}
                              </div>
                              <div className="text-[10px] text-muted-foreground font-mono">
                                {new Date(req.createdAt).toLocaleString()}
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            {req.status === "PENDING" && (
                              <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1.5 w-fit">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                                ⏳ Pending Activation
                              </span>
                            )}
                            {req.status === "APPROVED" && (
                              <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 w-fit">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                Active / Full Access
                              </span>
                            )}
                            {req.status === "REJECTED" && (
                              <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30 w-fit">
                                ✕ Rejected
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {req.status === "PENDING" ? (
                                <>
                                  <button
                                    onClick={() => handleApproveRequest(req._id, req.userName, req.planName)}
                                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1 transition-all"
                                    title="Activate plan and grant full access to this user"
                                  >
                                    <CheckCircle2 className="h-3.5 w-3.5" /> Activate Plan
                                  </button>
                                  <button
                                    onClick={() => handleRejectRequest(req._id, req.userName)}
                                    className="px-2.5 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 font-bold text-xs transition-colors"
                                    title="Reject request"
                                  >
                                    Reject
                                  </button>
                                </>
                              ) : req.status === "APPROVED" ? (
                                <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1">
                                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Activated
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleApproveRequest(req._id, req.userName, req.planName)}
                                  className="text-xs font-bold text-emerald-600 hover:underline"
                                >
                                  Re-activate
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    {requests.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-muted-foreground">
                          <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                          No subscription requests found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 1: SUBSCRIPTION PLANS CRUD ─────────────────────────────────── */}
        {activeTab === "plans" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Currency Selector */}
              <div className="flex items-center gap-2 p-1 rounded-xl bg-card border border-border">
                <button
                  onClick={() => setCurrency("BDT")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    currency === "BDT"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  ৳ BDT
                </button>
                <button
                  onClick={() => setCurrency("USD")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    currency === "USD"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  $ USD
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadPlans}
                  className="p-2.5 rounded-xl border border-border bg-card hover:bg-accent text-xs font-bold text-foreground"
                  title="Refresh plans"
                >
                  <RefreshCw className={`h-4 w-4 ${loadingPlans ? "animate-spin" : ""}`} />
                </button>

                <button
                  onClick={() => setShowAddPlanModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
                >
                  <Plus className="h-4 w-4" /> Add Subscription Plan
                </button>
              </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((p) => {
                const priceFormatted =
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
                        Popular
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-black text-foreground">{p.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{p.description}</p>
                      </div>

                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-foreground">{priceFormatted}</span>
                        <span className="text-xs text-muted-foreground">/ month</span>
                      </div>

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
                            AI Scripts
                          </div>
                          <div className="font-extrabold text-foreground">
                            {p.maxEvaluations > 5000 ? "Unlimited" : p.maxEvaluations} / mo
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-border space-y-2">
                        <div className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider">
                          Features:
                        </div>
                        <ul className="space-y-1.5 text-xs text-foreground/90">
                          {p.features.map((f, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Actions: Edit & Delete */}
                    <div className="flex items-center gap-2 pt-2 border-t border-border">
                      <button
                        onClick={() => setEditingPlan(p)}
                        className="flex-1 py-2 rounded-xl border border-border bg-card hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-500 font-bold text-xs text-foreground hover:text-emerald-700 flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Edit3 className="h-3.5 w-3.5 text-emerald-600" /> Edit
                      </button>

                      {p.id !== "FREE" && p.id !== "PRO" && (
                        <button
                          onClick={() => handleDeletePlan(p.id, p.name)}
                          className="p-2 rounded-xl border border-destructive/30 hover:bg-destructive/10 text-destructive text-xs font-bold transition-colors"
                          title="Delete plan"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Institutions Plan Assignment Roster */}
            <div className="rounded-2xl border border-border bg-card shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-emerald-600" />
                  Institutions Plan Assignment
                </h3>
                <span className="text-xs text-muted-foreground">Assign or switch institution plans</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 border-b border-border text-muted-foreground uppercase text-[10px] font-bold">
                    <tr>
                      <th className="px-4 py-3">Institution Name</th>
                      <th className="px-4 py-3">Slug</th>
                      <th className="px-4 py-3">Active Tier</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Change Plan</th>
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
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {inst.currentPlan || "PRO"}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-emerald-600 font-bold">
                          Active
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <select
                            value={inst.currentPlan || "PRO"}
                            onChange={(e) => handleAssignPlan(inst.id, e.target.value)}
                            className="px-3 py-1.5 rounded-xl border border-border bg-background text-xs font-bold text-foreground focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          >
                            {plans.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name}
                              </option>
                            ))}
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

        {/* ─── TAB 2: USER MANAGEMENT CRUD ───────────────────────────────────── */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Search & Role Filter */}
              <div className="flex flex-wrap items-center gap-2 flex-1">
                <div className="relative flex-1 min-w-[220px]">
                  <Search className="h-4 w-4 absolute left-3.5 top-3 text-muted-foreground" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search users by name, email, or roll..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-border bg-card text-xs font-bold text-foreground focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="ALL">All Roles</option>
                  <option value="SUPER_ADMIN">Super Admins</option>
                  <option value="ADMIN">Institution Admins</option>
                  <option value="STUDENT">Students</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadUsers}
                  className="p-2.5 rounded-xl border border-border bg-card hover:bg-accent text-xs font-bold text-foreground"
                  title="Refresh users"
                >
                  <RefreshCw className={`h-4 w-4 ${loadingUsers ? "animate-spin" : ""}`} />
                </button>

                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
                >
                  <UserPlus className="h-4 w-4" /> Create User
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              {loadingUsers ? (
                <div className="p-12 text-center text-xs text-muted-foreground">
                  Loading user directory...
                </div>
              ) : users.length === 0 ? (
                <div className="p-12 text-center text-xs text-muted-foreground space-y-2">
                  <Users className="h-8 w-8 text-muted-foreground mx-auto" />
                  <p className="font-bold">No users found matching your search.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted/40 border-b border-border text-muted-foreground uppercase text-[10px] font-bold">
                      <tr>
                        <th className="px-5 py-3.5">User</th>
                        <th className="px-5 py-3.5">Email</th>
                        <th className="px-5 py-3.5">Role</th>
                        <th className="px-5 py-3.5">Assigned Plan</th>
                        <th className="px-5 py-3.5">Institution / Batch</th>
                        <th className="px-5 py-3.5">Status</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-muted/20">
                          <td className="px-5 py-4 font-bold text-foreground">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                                  u.role === "SUPER_ADMIN"
                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                    : u.role === "ADMIN"
                                    ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
                                    : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                }`}
                              >
                                {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                              </div>
                              <div>
                                <div>{u.name}</div>
                                {u.rollNo && u.rollNo !== "N/A" && (
                                  <div className="text-[10px] text-muted-foreground font-normal">
                                    Roll: {u.rollNo}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 font-mono text-muted-foreground">
                            {u.email}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                                u.role === "SUPER_ADMIN"
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : u.role === "ADMIN"
                                  ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-muted text-foreground border border-border">
                              {u.plan || "FREE"}
                            </span>
                            {u.subscriptionStatus === "PENDING_APPROVAL" && (
                              <span className="block text-[10px] font-bold text-amber-600 animate-pulse mt-0.5">
                                ⏳ Pending Review
                              </span>
                            )}
                            {u.subscriptionStatus === "ACTIVE" && u.plan && u.plan !== "FREE" && (
                              <span className="block text-[10px] font-bold text-emerald-600 mt-0.5">
                                ✓ Verified Active
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-muted-foreground">
                            {u.institution || u.batchName || "Direct Examinee"}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                                u.isActive ? "text-emerald-600" : "text-destructive"
                              }`}
                            >
                              {u.isActive ? (
                                <>
                                  <CheckCircle2 className="h-3.5 w-3.5" /> Active
                                </>
                              ) : (
                                "Suspended"
                              )}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setEditingUser(u)}
                                className="p-1.5 rounded-lg border border-border hover:bg-accent text-foreground"
                                title="Edit user"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u.id, u.name)}
                                className="p-1.5 rounded-lg border border-destructive/30 hover:bg-destructive/10 text-destructive"
                                title="Delete user"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
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

        {/* ─── MODAL: ADD NEW SUBSCRIPTION PLAN ───────────────────────────────── */}
        {showAddPlanModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-emerald-600" />
                  Add New Subscription Plan
                </h3>
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
                    value={planForm.name}
                    onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                    placeholder="e.g. Coaching Special Batch Plan"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-foreground">Price in BDT (৳):</label>
                    <input
                      type="number"
                      required
                      value={planForm.priceBdt}
                      onChange={(e) =>
                        setPlanForm({ ...planForm, priceBdt: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-foreground">Price in USD ($):</label>
                    <input
                      type="number"
                      required
                      value={planForm.priceUsd}
                      onChange={(e) =>
                        setPlanForm({ ...planForm, priceUsd: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-foreground">Student Limit:</label>
                    <input
                      type="number"
                      required
                      value={planForm.maxStudents}
                      onChange={(e) =>
                        setPlanForm({ ...planForm, maxStudents: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-foreground">Monthly Script Quota:</label>
                    <input
                      type="number"
                      required
                      value={planForm.maxEvaluations}
                      onChange={(e) =>
                        setPlanForm({ ...planForm, maxEvaluations: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Description:</label>
                  <input
                    type="text"
                    value={planForm.description}
                    onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                    placeholder="Short description for this tier"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Features (one per line):</label>
                  <textarea
                    rows={3}
                    value={planForm.featuresStr}
                    onChange={(e) => setPlanForm({ ...planForm, featuresStr: e.target.value })}
                    placeholder={"Up to 300 Examinees\nPriority Gemini Vision OCR\nAutomated Rubrics"}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono text-[11px]"
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
                    Save & Publish Plan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── MODAL: EDIT PLAN ──────────────────────────────────────────────── */}
        {editingPlan && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
                  <Edit3 className="h-4 w-4 text-emerald-600" />
                  Edit Plan — {editingPlan.name}
                </h3>
                <button
                  onClick={() => setEditingPlan(null)}
                  className="text-xs text-muted-foreground hover:text-foreground font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdatePlan} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Plan Name:</label>
                  <input
                    type="text"
                    required
                    value={editingPlan.name}
                    onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
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
                        setEditingPlan({ ...editingPlan, priceBdt: Number(e.target.value) })
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
                        setEditingPlan({ ...editingPlan, priceUsd: Number(e.target.value) })
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
                        setEditingPlan({ ...editingPlan, maxStudents: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-foreground">Monthly Scripts Limit:</label>
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
                  <label className="font-bold text-foreground">Description:</label>
                  <input
                    type="text"
                    value={editingPlan.description}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, description: e.target.value })
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
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── MODAL: CREATE USER ────────────────────────────────────────────── */}
        {showAddUserModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-emerald-600" />
                  Create Platform User
                </h3>
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="text-xs text-muted-foreground hover:text-foreground font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Full Name:</label>
                  <input
                    type="text"
                    required
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    placeholder="e.g. Professor Kamal Hossain"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Email Address:</label>
                  <input
                    type="email"
                    required
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    placeholder="user@example.com"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Platform Role:</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="STUDENT">STUDENT (Takes exams & gets evaluated)</option>
                    <option value="ADMIN">ADMIN / TEACHER (Creates exams & manages batches)</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN (Full platform governance)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-foreground">Roll / ID (Optional):</label>
                    <input
                      type="text"
                      value={userForm.rollNo}
                      onChange={(e) => setUserForm({ ...userForm, rollNo: e.target.value })}
                      placeholder="e.g. 2026-PHY-01"
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-foreground">Phone Number:</label>
                    <input
                      type="text"
                      value={userForm.phone}
                      onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                      placeholder="017XXXXXXXX"
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowAddUserModal(false)}
                    className="px-4 py-2 rounded-xl border border-border hover:bg-accent font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20"
                  >
                    Create User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── MODAL: EDIT USER ──────────────────────────────────────────────── */}
        {editingUser && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
                  <Edit3 className="h-4 w-4 text-emerald-600" />
                  Edit User — {editingUser.name}
                </h3>
                <button
                  onClick={() => setEditingUser(null)}
                  className="text-xs text-muted-foreground hover:text-foreground font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdateUser} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Full Name:</label>
                  <input
                    type="text"
                    required
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Platform Role:</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="STUDENT">STUDENT</option>
                    <option value="ADMIN">ADMIN / TEACHER</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-foreground">Roll / ID:</label>
                    <input
                      type="text"
                      value={editingUser.rollNo || ""}
                      onChange={(e) => setEditingUser({ ...editingUser, rollNo: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-foreground">Phone:</label>
                    <input
                      type="text"
                      value={editingUser.phone || ""}
                      onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Account Status:</label>
                  <select
                    value={editingUser.isActive ? "ACTIVE" : "SUSPENDED"}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        isActive: e.target.value === "ACTIVE",
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="ACTIVE">ACTIVE (Can log in & access portal)</option>
                    <option value="SUSPENDED">SUSPENDED (Access blocked)</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
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
      </div>
    </AdminGuard>
  );
}
