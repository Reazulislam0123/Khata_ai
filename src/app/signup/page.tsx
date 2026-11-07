"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  GraduationCap,
  Building2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { UserRole } from "@/lib/types";
import { registerWithEmail, loginWithGoogle } from "@/lib/firebase";

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [institution, setInstitution] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const formatFirebaseError = (errCode: string): string => {
    switch (errCode) {
      case "auth/email-already-in-use":
        return "An account with this email address already exists. Please sign in instead.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/weak-password":
        return "Password is too weak. Please use at least 6 characters.";
      case "auth/network-request-failed":
        return "Network error. Please check your internet connection.";
      default:
        return errCode || "Failed to create account. Please try again.";
    }
  };

  const handleGoogleSignUp = async () => {
    setError("");
    setIsLoading(true);
    try {
      const userCred = await loginWithGoogle();
      const fbUser = userCred.user;

      // Sync to MongoDB
      const res = await fetch("/api/auth/sync-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: fbUser.uid,
          email: fbUser.email,
          name: fbUser.displayName || name || fbUser.email?.split("@")[0] || "Khata User",
          role: role === "TEACHER" ? "TEACHER" : "STUDENT",
          institutionName: role === "TEACHER" ? institution.trim() || "My Institution" : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.user?.role === "TEACHER" || data.user?.role === "ADMIN") {
          router.push("/teacher");
        } else {
          router.push("/student");
        }
        router.refresh();
      } else {
        setError(data.error || "Failed to initialize user in database");
      }
    } catch (err: any) {
      setError(formatFirebaseError(err.code || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation checks
    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (email.trim().toLowerCase() !== confirmEmail.trim().toLowerCase()) {
      setError("Email addresses do not match. Please verify your email.");
      return;
    }

    if (role === "TEACHER" && !institution.trim()) {
      setError("Please provide your institution, coaching, school, or college name.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please ensure both password fields are identical.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Firebase Authentication: Create user
      const userCred = await registerWithEmail(email.trim().toLowerCase(), password);
      const fbUser = userCred.user;

      // 2. Sync user profile into MongoDB Atlas
      const syncRes = await fetch("/api/auth/sync-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: fbUser.uid,
          email: fbUser.email,
          name: name.trim(),
          role: role === "TEACHER" ? "TEACHER" : "STUDENT",
          institutionName: role === "TEACHER" ? institution.trim() : undefined,
        }),
      });

      const syncData = await syncRes.json();

      if (syncData.success) {
        if (role === "TEACHER" || syncData.user?.role === "TEACHER" || syncData.user?.role === "ADMIN") {
          router.push("/teacher");
        } else {
          router.push("/student");
        }
        router.refresh();
      } else {
        setError(syncData.error || "Account created in Firebase, but profile sync failed.");
      }
    } catch (err: any) {
      setError(formatFirebaseError(err.code || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const isEmailMismatch = confirmEmail && email.trim().toLowerCase() !== confirmEmail.trim().toLowerCase();
  const isPasswordMismatch = confirmPassword && password !== confirmPassword;

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-xl rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 shadow-inner">
            <UserPlus className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-black text-foreground">Create Your KhataAI Account</h1>
          <p className="text-xs text-muted-foreground">
            Join Bangladesh's premier AI examination and grading ecosystem.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl border border-destructive/40 bg-destructive/10 text-destructive text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1-Click Google Sign-up */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-xl border border-border bg-background hover:bg-accent font-semibold text-xs text-foreground flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-border"></div>
          <span className="flex-shrink mx-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Or with email
          </span>
          <div className="flex-grow border-t border-border"></div>
        </div>

        {/* Account Role Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">Choose Account Type:</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("STUDENT")}
              className={`p-4 rounded-2xl border text-left transition-all ${
                role === "STUDENT"
                  ? "border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/60 ring-2 ring-emerald-500/20"
                  : "border-border bg-background hover:bg-accent/60"
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs text-foreground">
                <GraduationCap className="h-4 w-4 text-emerald-600" />
                Student
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Take public exams, join coaching portals, and view AI graded scripts.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setRole("TEACHER")}
              className={`p-4 rounded-2xl border text-left transition-all ${
                role === "TEACHER"
                  ? "border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/60 ring-2 ring-emerald-500/20"
                  : "border-border bg-background hover:bg-accent/60"
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs text-foreground">
                <Building2 className="h-4 w-4 text-emerald-600" />
                Institution / Educator
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Add coaching, school, college or varsity, create exams, and share test links.
              </p>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              Full Name:
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={role === "STUDENT" ? "e.g. Tanvir Ahmed / Samiha Rahman" : "e.g. Prof. Rafiqul Islam / Principal Kabir"}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Email Address & Confirm Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                Email Address:
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. you@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  Confirm Email:
                </span>
                {confirmEmail && !isEmailMismatch && (
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                    <CheckCircle2 className="h-3 w-3" /> Matches
                  </span>
                )}
              </label>
              <input
                type="email"
                required
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                placeholder="Re-enter email address"
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-background text-sm focus:ring-2 focus:outline-none ${
                  isEmailMismatch
                    ? "border-destructive focus:ring-destructive"
                    : "border-border focus:ring-emerald-500"
                }`}
              />
              {isEmailMismatch && (
                <p className="text-[11px] text-destructive">Email addresses do not match</p>
              )}
            </div>
          </div>

          {/* Institution Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                {role === "STUDENT" ? "Current College / School / Varsity (Optional):" : "Institution / Coaching Name (Required):"}
              </span>
              {role === "TEACHER" && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-md">
                  Creates Your Portal
                </span>
              )}
            </label>
            <input
              type="text"
              required={role === "TEACHER"}
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder={
                role === "STUDENT"
                  ? "e.g. Dhaka College / Notre Dame / BUET"
                  : "e.g. Apex Coaching Center / Sunrise Model College / Paragon Academy"
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            {role === "TEACHER" && (
              <p className="text-[11px] text-muted-foreground">
                An institution portal will be created exclusively for you where only you can create exams and batches.
              </p>
            )}
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  Password:
                </span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  {showPassword ? "Hide" : "Show"}
                </button>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  Confirm Password:
                </span>
                {confirmPassword && !isPasswordMismatch && (
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                    <CheckCircle2 className="h-3 w-3" /> Matches
                  </span>
                )}
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-background text-sm focus:ring-2 focus:outline-none ${
                  isPasswordMismatch
                    ? "border-destructive focus:ring-destructive"
                    : "border-border focus:ring-emerald-500"
                }`}
              />
              {isPasswordMismatch && (
                <p className="text-[11px] text-destructive">Passwords do not match</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !!isEmailMismatch || !!isPasswordMismatch}
            className="w-full py-3.5 rounded-xl bg-emerald-600 font-bold text-sm text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? "Creating Account..." : "Create Account & Get Started"}
          </button>
        </form>

        <div className="text-center text-xs text-muted-foreground pt-2 border-t border-border">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-emerald-600 hover:text-emerald-700">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
