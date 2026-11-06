// src/lib/firebase.ts
// Firebase CLIENT-SIDE initialization
// Used in browser/frontend components only

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
  type User,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Prevent duplicate app initialization during Next.js hot-reloads
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// ── Auth helpers ──────────────────────────────────────────────────────────────

/** Register with email + password */
export const registerWithEmail = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

/** Login with email + password */
export const loginWithEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

/** Login with Google popup */
export const loginWithGoogle = () =>
  signInWithPopup(auth, googleProvider);

/** Sign out */
export const logout = () => signOut(auth);

/** Send password reset email */
export const resetPassword = (email: string) =>
  sendPasswordResetEmail(auth, email);

/** Send email verification to logged-in user */
export const verifyEmail = (user: User) =>
  sendEmailVerification(user);

/** Get a fresh Firebase ID token for API calls */
export const getIdToken = async (forceRefresh = false): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken(forceRefresh);
};

/** Subscribe to auth state changes */
export const onAuthChange = (callback: (user: User | null) => void) =>
  onAuthStateChanged(auth, callback);

export default app;

