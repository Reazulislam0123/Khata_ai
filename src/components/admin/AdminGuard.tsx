"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, Lock, User, KeyRound, ArrowLeft, LogOut, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { firebaseUser, mongoUser } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkAuth = async () => {
    // 1. Check logged-in user via AuthContext
    const activeEmail = (mongoUser?.email || firebaseUser?.email || "").toLowerCase().trim();
    if (
      activeEmail === "admin@khata.ai" ||
      activeEmail === "admin" ||
      activeEmail.startsWith("admin@") ||
      mongoUser?.role === "SUPER_ADMIN" ||
      mongoUser?.role === "ADMIN"
    ) {
      setIsAuthenticated(true);
      return;
    }

    // 2. Check localStorage session
    try {
      const stored = localStorage.getItem("khata_user");
      if (stored) {
        const u = JSON.parse(stored);
        const storedEmail = (u?.email || "").toLowerCase().trim();
        if (
          storedEmail === "admin@khata.ai" ||
          storedEmail === "admin" ||
          storedEmail.startsWith("admin@") ||
          u?.role === "ADMIN" ||
          u?.role === "SUPER_ADMIN"
        ) {
          setIsAuthenticated(true);
          return;
        }
      }
    } catch {}

    // 3. Check browser session cookie directly
    if (
      typeof document !== "undefined" &&
      (document.cookie.includes("khata_admin_session=authenticated_admin") ||
        document.cookie.includes("khata_user_session=usr_admin_01"))
    ) {
      setIsAuthenticated(true);
      return;
    }

    // 4. Fallback to API check
    try {
      const res = await fetch("/api/admin/check");
      const data = await res.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
        return;
      }
    } catch {
      // ignore
    }

    setIsAuthenticated(false);
  };

  useEffect(() => {
    checkAuth();
  }, [firebaseUser, mongoUser]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId, password }),
      });
      const data = await res.json();

      if (data.success) {
        try {
          localStorage.setItem(
            "khata_user",
            JSON.stringify({
              id: data.user?.id || "usr_admin_01",
              name: "Super Admin",
              email: "admin@khata.ai",
              role: "ADMIN",
            })
          );
          document.cookie = "khata_admin_session=authenticated_admin; path=/; max-age=604800";
        } catch {}
        setIsAuthenticated(true);
      } else {
        setError(data.error || "Invalid Admin ID or Password");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    try {
      localStorage.removeItem("khata_user");
      document.cookie = "khata_admin_session=; path=/; max-age=0";
    } catch {}
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  const handleFillDemo = () => {
    setAdminId("admin");
    setPassword("admin123");
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="h-8 w-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
        <p className="text-xs font-semibold text-muted-foreground">Verifying admin credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="h-14 w-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 shadow-inner">
              <Lock className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-black text-foreground">Admin Protected Area</h2>
            <p className="text-xs text-muted-foreground">
              This section is restricted to platform administrators. Please enter your Admin ID and Password to continue.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl border border-destructive/40 bg-destructive/10 text-destructive text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                Admin ID or Email:
              </label>
              <input
                type="text"
                required
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="e.g. admin or admin@khata.ai"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
                Admin Password:
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-emerald-600 font-bold text-sm text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Authenticating..." : "Unlock Admin Dashboard"}
            </button>
          </form>

          {/* Quick Demo Fill Helper */}
          <div className="pt-2 border-t border-border text-center space-y-2">
            <button
              onClick={handleFillDemo}
              type="button"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 py-1.5 px-3 rounded-lg border border-emerald-200 transition-colors"
            >
              Fill Demo Credentials (`admin` / `admin123`)
            </button>
            <div>
              <Link
                href="/"
                className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              >
                <ArrowLeft className="h-3 w-3" /> Back to Main Site
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
