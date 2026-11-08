"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { User } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import {
  FileCheck2,
  GraduationCap,
  Building2,
  Sparkles,
  User as UserIcon,
  LogOut,
  ChevronDown,
  ShieldCheck,
  History,
  Menu,
  X,
  CreditCard,
  School,
  BookOpen,
  KeyRound,
  LayoutDashboard,
  Activity,
  Sliders,
  FileText,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { firebaseUser, mongoUser, signOut: authSignOut } = useAuth();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync state from Firebase / Mongo Auth context or active Admin session
  useEffect(() => {
    if (firebaseUser || mongoUser) {
      const userEmail = (mongoUser?.email || firebaseUser?.email || "").trim().toLowerCase();
      let localRole: string | null = null;
      let localInst: string | null = null;
      try {
        const s = localStorage.getItem("khata_user");
        if (s) {
          const parsed = JSON.parse(s);
          localRole = parsed.role;
          localInst = parsed.institution;
        }
      } catch {}

      const isAdmin =
        userEmail === "admin@khata.ai" ||
        userEmail === "admin" ||
        userEmail.startsWith("admin@") ||
        mongoUser?.role === "ADMIN" ||
        mongoUser?.role === "SUPER_ADMIN" ||
        localRole === "ADMIN" ||
        localRole === "SUPER_ADMIN";

      const isTeacher =
        !isAdmin &&
        (mongoUser?.role === "TEACHER" ||
          localRole === "TEACHER" ||
          userEmail.includes("teacher") ||
          userEmail.includes("udvash") ||
          Boolean(mongoUser?.institutionId));

      const detectedRole = isAdmin
        ? "ADMIN"
        : isTeacher
        ? "TEACHER"
        : "STUDENT";

      const activeUser: User = {
        id: mongoUser?._id || firebaseUser?.uid || "usr_admin_01",
        name: isAdmin
          ? "admin"
          : isTeacher
          ? mongoUser?.name || firebaseUser?.displayName || "Teacher"
          : mongoUser?.name || firebaseUser?.displayName || userEmail.split("@")[0] || "User",
        email: userEmail,
        role: detectedRole,
        institution: mongoUser?.institutionId?.name || localInst || (isAdmin ? "KhataAI HQ" : isTeacher ? "Institution Portal" : undefined),
        institutionSlug: mongoUser?.institutionId?.slug || undefined,
      };
      setCurrentUser(activeUser);
      try {
        localStorage.setItem("khata_user", JSON.stringify(activeUser));
      } catch { }
    } else {
      // Check if local storage or admin session cookie is active
      try {
        const stored = localStorage.getItem("khata_user");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.email) {
            const userEmail = (parsed.email || "").trim().toLowerCase();
            const isAdmin =
              userEmail === "admin@khata.ai" ||
              userEmail === "admin" ||
              userEmail.startsWith("admin@") ||
              parsed.role === "ADMIN" ||
              parsed.role === "SUPER_ADMIN";

            const isTeacher =
              !isAdmin &&
              (parsed.role === "TEACHER" ||
                userEmail.includes("teacher") ||
                userEmail.includes("udvash"));

            if (isAdmin) {
              parsed.role = "ADMIN";
              parsed.name = "admin";
            } else if (isTeacher) {
              parsed.role = "TEACHER";
            } else {
              parsed.role = "STUDENT";
            }
            setCurrentUser(parsed);
            return;
          }
        }
      } catch { }

      // Check admin session endpoint
      fetch("/api/admin/check")
        .then((r) => r.json())
        .then((data) => {
          if (data.authenticated) {
            const adminUser: User = {
              id: data.user?.id || "usr_admin_01",
              name: "admin",
              email: "admin@khata.ai",
              role: "ADMIN",
            };
            setCurrentUser(adminUser);
            try {
              localStorage.setItem("khata_user", JSON.stringify(adminUser));
            } catch { }
          } else {
            setCurrentUser(null);
          }
        })
        .catch(() => {
          setCurrentUser(null);
        });
    }
  }, [firebaseUser, mongoUser]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      try {
        localStorage.removeItem("khata_user");
      } catch { }
      await authSignOut();
      await fetch("/api/auth/logout", { method: "POST" }).catch(() => { });
      await fetch("/api/admin/logout", { method: "POST" }).catch(() => { });
      setCurrentUser(null);
      setIsUserMenuOpen(false);
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  let navLinks: { label: string; href: string; icon?: any }[] = [];

  if (currentUser?.role === "ADMIN") {
    navLinks = [
      { label: "Home", href: "/" },
      { label: "Super Admin", href: "/admin", icon: ShieldCheck },
      { label: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
      { label: "Institutions", href: "/admin/institutions", icon: Building2 },
    ];
  } else if (currentUser?.role === "TEACHER") {
    navLinks = [
      { label: "Home", href: "/" },
      { label: "Teacher Dashboard", href: "/teacher", icon: LayoutDashboard },
      { label: "Question Cards", href: "/teacher?tab=questions", icon: Sparkles },
      { label: "Evaluate Scripts", href: "/teacher/evaluate", icon: FileCheck2 },
      { label: "Student Arena", href: "/student", icon: GraduationCap },
    ];
  } else if (currentUser?.role === "STUDENT") {
    navLinks = [
      { label: "Home", href: "/" },
      { label: "Student Arena", href: "/student", icon: GraduationCap },
      { label: "My Exam Submissions", href: "/profile?tab=exams", icon: BookOpen },
      { label: "Features & Pricing", href: "/pricing", icon: CreditCard },
    ];
  } else {
    navLinks = [
      { label: "Home", href: "/" },
      { label: "Features & Pricing", href: "/pricing", icon: CreditCard },
      { label: "Student Arena", href: "/student", icon: GraduationCap },
      { label: "Institution Portals", href: "/portal", icon: Building2 },
    ];
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/75 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <FileCheck2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-foreground">
                  Khata<span className="text-emerald-600">AI</span>
                </span>
                <span className="bengali-font rounded-md bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  খাতা AI
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground font-medium -mt-0.5">
                AI Exam Evaluation Platform
              </p>
            </div>
          </Link>

          {/* Clean Primary Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${isActive
                      ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                >
                  {Icon && <Icon className={`h-4 w-4 ${isActive ? "text-emerald-600" : "text-muted-foreground"}`} />}
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Auth & Profile */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            /* User Profile & Account Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl border border-border bg-card hover:bg-accent/60 transition-all shadow-sm"
              >
                <div
                  className={`h-8 w-8 rounded-xl text-white flex items-center justify-center font-black text-xs shadow-inner ${
                    currentUser.role === "ADMIN"
                      ? "bg-emerald-600 text-white font-bold"
                      : "bg-gradient-to-tr from-emerald-600 to-teal-600"
                  }`}
                >
                  {currentUser.role === "ADMIN"
                    ? "A"
                    : currentUser.name
                    ? currentUser.name.charAt(0).toUpperCase()
                    : "U"}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-foreground leading-tight truncate max-w-[130px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] font-semibold text-emerald-600 capitalize">
                    {currentUser.role === "ADMIN"
                      ? "🛡️ Admin"
                      : currentUser.role === "TEACHER"
                      ? "🏛️ Institution"
                      : "🎓 Student"}
                  </div>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-3xl border border-border bg-card p-3 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 space-y-2">
                  {/* Dropdown Header Card (Image 1 Style) */}
                  <div className="px-4 py-3.5 bg-muted/20 border border-border/60 rounded-2xl space-y-1.5">
                    <p className="text-sm sm:text-base font-extrabold text-foreground truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
                    <div className="pt-1">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 inline-flex items-center gap-1.5">
                        {currentUser.role === "ADMIN" ? (
                          <>
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                            <span>Super Admin</span>
                          </>
                        ) : currentUser.role === "TEACHER" ? (
                          <>
                            <Building2 className="h-3.5 w-3.5 text-emerald-600" />
                            <span>Institution</span>
                          </>
                        ) : (
                          <>
                            <GraduationCap className="h-3.5 w-3.5 text-emerald-600" />
                            <span>Student</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {currentUser.role === "ADMIN" ? (
                    /* ── Admin Menu (Image 1 Circular Icon Style with Image 2 Elements) ── */
                    <div className="space-y-1 py-1">
                      {/* 1. Dashboard */}
                      <Link
                        href="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40 transition-colors group"
                      >
                        <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800 group-hover:scale-105 transition-transform">
                          <LayoutDashboard className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-xs sm:text-sm text-foreground group-hover:text-emerald-600 transition-colors">
                            Dashboard
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            Platform overview & core metrics
                          </div>
                        </div>
                      </Link>

                      {/* 2. Institutions */}
                      <Link
                        href="/admin/institutions"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40 transition-colors group"
                      >
                        <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800 group-hover:scale-105 transition-transform">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-xs sm:text-sm text-foreground group-hover:text-emerald-600 transition-colors">
                            Institutions
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            Manage portals, batches & codes
                          </div>
                        </div>
                      </Link>

                      {/* 3. Subscriptions */}
                      <Link
                        href="/admin/subscriptions"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40 transition-colors group"
                      >
                        <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800 group-hover:scale-105 transition-transform">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-xs sm:text-sm text-foreground group-hover:text-emerald-600 transition-colors">
                            Subscriptions
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            Set, update & manage pricing plans
                          </div>
                        </div>
                      </Link>

                      {/* 4. AI Settings */}
                      <Link
                        href="/admin/ai-settings"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40 transition-colors group"
                      >
                        <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800 group-hover:scale-105 transition-transform">
                          <Sliders className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-xs sm:text-sm text-foreground group-hover:text-emerald-600 transition-colors">
                            AI Settings
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            Tune Gemini OCR models & API keys
                          </div>
                        </div>
                      </Link>

                      {/* 5. Analytics */}
                      <Link
                        href="/admin/analytics"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40 transition-colors group"
                      >
                        <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800 group-hover:scale-105 transition-transform">
                          <Activity className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-xs sm:text-sm text-foreground group-hover:text-emerald-600 transition-colors">
                            Analytics
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            System logs, uptime & telemetry
                          </div>
                        </div>
                      </Link>
                    </div>
                  ) : currentUser.role === "TEACHER" ? (
                    /* ── Teacher Service Dedicated Menu ── */
                    <div className="space-y-1 py-1">
                      <Link
                        href="/teacher"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40 transition-colors group"
                      >
                        <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800 group-hover:scale-105 transition-transform">
                          <LayoutDashboard className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-xs sm:text-sm text-foreground group-hover:text-emerald-600 transition-colors">
                            Teacher Dashboard
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            Academic overview & students
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/teacher?tab=questions"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40 transition-colors group"
                      >
                        <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800 group-hover:scale-105 transition-transform">
                          <Sparkles className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-xs sm:text-sm text-foreground group-hover:text-emerald-600 transition-colors">
                            Question Bank (Cards)
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            Create & manage CQ/MCQ cards
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/teacher/exams/new"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40 transition-colors group"
                      >
                        <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800 group-hover:scale-105 transition-transform">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-xs sm:text-sm text-foreground group-hover:text-emerald-600 transition-colors">
                            Create New Exam
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            Assemble rubrics & publish
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/teacher/evaluate"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40 transition-colors group"
                      >
                        <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800 group-hover:scale-105 transition-transform">
                          <FileCheck2 className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-xs sm:text-sm text-foreground group-hover:text-emerald-600 transition-colors">
                            Evaluate Scripts
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            Review handwritten answer sheets
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/teacher?tab=batches"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40 transition-colors group"
                      >
                        <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800 group-hover:scale-105 transition-transform">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-xs sm:text-sm text-foreground group-hover:text-emerald-600 transition-colors">
                            Batches & Cohorts
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            Manage codes & enrolled students
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/profile?tab=account"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40 transition-colors group"
                      >
                        <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800 group-hover:scale-105 transition-transform">
                          <KeyRound className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-xs sm:text-sm text-foreground group-hover:text-emerald-600 transition-colors">
                            Change Name & Password
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            Edit full name & update password
                          </div>
                        </div>
                      </Link>
                    </div>
                  ) : (
                    /* ── Student Service Exclusive Menu ── */
                    <div className="space-y-1 py-1">
                      <Link
                        href="/student"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40 transition-colors group"
                      >
                        <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800 group-hover:scale-105 transition-transform">
                          <GraduationCap className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-xs sm:text-sm text-foreground group-hover:text-emerald-600 transition-colors">
                            Student Exam Arena
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            Take scheduled & public exams
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/student/my-exams"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40 transition-colors group"
                      >
                        <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800 group-hover:scale-105 transition-transform">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-xs sm:text-sm text-foreground group-hover:text-emerald-600 transition-colors">
                            My Graded Khata & Results
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            View evaluated answer sheets & GPA
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/profile?tab=account"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40 transition-colors group"
                      >
                        <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800 group-hover:scale-105 transition-transform">
                          <KeyRound className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-xs sm:text-sm text-foreground group-hover:text-emerald-600 transition-colors">
                            Change Name & Password
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            Edit full name & update password
                          </div>
                        </div>
                      </Link>
                    </div>
                  )}

                  {/* Bottom Footer Section */}
                  <div className="pt-2 border-t border-border mt-1 space-y-1">
                    <Link
                      href="/portal"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    >
                      <School className="h-4 w-4" />
                      <span>Browse All Institutions</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged Out Actions: Sign In & Sign Up */
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-xs font-bold text-foreground hover:text-emerald-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all"
              >
                Create Account
              </Link>
            </div>
          )}

          {/* Quick Live AI Demo CTA */}
          <Link
            href="/#demo"
            className="hidden lg:inline-flex items-center gap-1.5 rounded-xl bg-muted/80 hover:bg-muted border border-border px-3 py-1.5 text-xs font-bold text-foreground transition-all"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            Live Demo
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-border hover:bg-accent text-foreground"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-card p-4 space-y-3 animate-in fade-in">
          {currentUser && (
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-foreground truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{currentUser.email}</p>
                </div>
              </div>
              {currentUser.role === "ADMIN" ? (
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-xl bg-card border border-border text-center text-[11px] font-bold text-foreground hover:border-emerald-500 shadow-sm"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/admin/institutions"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-xl bg-card border border-border text-center text-[11px] font-bold text-foreground hover:border-emerald-500 shadow-sm"
                  >
                    Institutions
                  </Link>
                  <Link
                    href="/admin/subscriptions"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-xl bg-card border border-border text-center text-[11px] font-bold text-foreground hover:border-emerald-500 shadow-sm"
                  >
                    Subscriptions
                  </Link>
                  <Link
                    href="/admin/ai-settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-xl bg-card border border-border text-center text-[11px] font-bold text-foreground hover:border-emerald-500 shadow-sm"
                  >
                    AI Settings
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  <Link
                    href="/profile?tab=exams"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-xl bg-card border border-border text-center text-[11px] font-bold text-foreground hover:border-emerald-500 shadow-sm"
                  >
                    My Exams
                  </Link>
                  <Link
                    href="/profile?tab=institutions"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-xl bg-card border border-border text-center text-[11px] font-bold text-foreground hover:border-emerald-500 shadow-sm"
                  >
                    Institutions
                  </Link>
                  <Link
                    href="/profile?tab=account"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-xl bg-card border border-border text-center text-[11px] font-bold text-foreground hover:border-emerald-500 shadow-sm"
                  >
                    Password
                  </Link>
                </div>
              )}
            </div>
          )}

          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-xl text-sm font-semibold ${pathname === link.href
                    ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700"
                    : "text-foreground hover:bg-accent"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {currentUser ? (
            <div className="pt-2 border-t border-border">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full py-2 px-3 rounded-xl text-left text-xs font-bold text-destructive hover:bg-destructive/10 flex items-center gap-2 transition-colors"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-border flex gap-2">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 py-2 text-center rounded-xl border border-border text-xs font-bold"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 py-2 text-center rounded-xl bg-emerald-600 text-white text-xs font-bold"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
