// src/lib/server-auth.ts
// ⚠️  DEPRECATED — Replaced by Firebase Auth + src/middleware/firebaseAuth.ts
// Stub exports kept here so existing old routes compile without errors.
// These will be removed route-by-route as we migrate each API route to Firebase Auth.

/** @deprecated Use Firebase Admin SDK token verification instead */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function encodeSessionUser(_user: any): string {
  console.warn("encodeSessionUser is deprecated — use Firebase ID tokens");
  return "";
}

/** @deprecated Use /api/auth/me with Firebase token instead */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getAuthenticatedUser(): Promise<any> {
  console.warn("getAuthenticatedUser is deprecated — use Firebase Admin verifyIdToken");
  return null;
}

/** @deprecated */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function decodeSessionUser(_encoded: string): any {
  return null;
}
