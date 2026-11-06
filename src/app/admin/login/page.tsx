"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, User, ArrowLeft, KeyRound, CheckCircle2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          document.cookie = "khata_user_session=usr_admin_01; path=/; max-age=604800";
        } catch {}
        window.location.href = "/admin";
      } else {
        setError(data.error || "Invalid Admin ID or Password");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setAdminId("admin");
    setPassword("admin123");
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 shadow-inner">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-black text-foreground">Super Admin Access</h1>
          <p className="text-xs text-muted-foreground">
            Sign in with your Admin ID and Password to configure AI models, BYOK API keys, and platform settings.
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
              <Lock className="h-3.5 w-3.5 text-muted-foreground" />
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
            {isSubmitting ? "Authenticating..." : "Unlock Admin Gateway"}
          </button>
        </form>

        {/* Demo Quick Fill Button */}
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
