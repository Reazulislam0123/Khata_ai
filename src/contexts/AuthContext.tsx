"use client";
// src/contexts/AuthContext.tsx
// Firebase Auth state management for the entire application
// Wraps every page via src/app/layout.tsx

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { User as FirebaseUser } from "firebase/auth";
import {
  auth,
  loginWithEmail,
  loginWithGoogle,
  logout,
  registerWithEmail,
  resetPassword,
  onAuthChange,
  getIdToken,
} from "@/lib/firebase";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MongoUser {
  _id: string;
  firebaseUid: string;
  email: string;
  name: string;
  role: "STUDENT" | "ADMIN" | "SUPER_ADMIN";
  institutionId?: { _id: string; name: string; slug: string; subscriptionPlan: string } | null;
  batchId?: { _id: string; name: string; curriculumCode: string } | null;
  avatarUrl?: string;
  phone?: string;
  rollNo?: string;
  isActive: boolean;
  plan?: string;
  subscriptionStatus?: string;
  planRequested?: string;
  createdAt: string;
}

interface AuthContextValue {
  firebaseUser: FirebaseUser | null;
  mongoUser: MongoUser | null;
  loading: boolean;
  error: string | null;

  // Actions
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

// ── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [mongoUser, setMongoUser] = useState<MongoUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /** Fetch the MongoDB user profile using the Firebase ID token */
  const fetchMongoUser = useCallback(async (fbUser: FirebaseUser) => {
    try {
      const token = await fbUser.getIdToken();
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMongoUser(data.user);
      } else {
        setMongoUser(null);
      }
    } catch {
      setMongoUser(null);
    }
  }, []);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange(async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        await fetchMongoUser(fbUser);
      } else {
        setMongoUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [fetchMongoUser]);

  /** Sign in with email/password */
  const signIn = async (email: string, password: string) => {
    setError(null);
    try {
      const { user } = await loginWithEmail(email, password);
      await fetchMongoUser(user);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login failed";
      setError(msg);
      throw err;
    }
  };

  /** Sign in with Google */
  const signInWithGoogle = async () => {
    setError(null);
    try {
      const { user } = await loginWithGoogle();
      // Sync user to MongoDB on first Google login
      const token = await user.getIdToken();
      await fetch("/api/auth/sync-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: user.uid,
          email: user.email,
          name: user.displayName || user.email?.split("@")[0],
        }),
      });
      await fetchMongoUser(user);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google login failed";
      setError(msg);
      throw err;
    }
  };

  /** Register with email/password, then sync to MongoDB */
  const register = async (email: string, password: string, name: string) => {
    setError(null);
    try {
      const { user } = await registerWithEmail(email, password);

      // Sync to MongoDB
      await fetch("/api/auth/sync-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: user.uid,
          email: user.email,
          name,
          role: "STUDENT",
        }),
      });

      await fetchMongoUser(user);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      setError(msg);
      throw err;
    }
  };

  /** Sign out from Firebase */
  const signOut = async () => {
    await logout();
    setFirebaseUser(null);
    setMongoUser(null);
  };

  /** Send password reset email */
  const forgotPassword = async (email: string) => {
    await resetPassword(email);
  };

  /** Re-fetch the MongoDB user (useful after role changes) */
  const refreshUser = async () => {
    if (firebaseUser) {
      await firebaseUser.getIdToken(true); // force token refresh
      await fetchMongoUser(firebaseUser);
    }
  };

  /** Get current Firebase ID token (for API calls) */
  const getToken = () => getIdToken(false);

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        mongoUser,
        loading,
        error,
        signIn,
        signInWithGoogle,
        register,
        signOut,
        forgotPassword,
        refreshUser,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth() must be used inside <AuthProvider>");
  }
  return ctx;
}

export default AuthContext;

