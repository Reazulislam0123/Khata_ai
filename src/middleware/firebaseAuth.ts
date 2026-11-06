// src/middleware/firebaseAuth.ts
// Server-side Firebase ID Token verification middleware for Next.js API Routes

import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

export interface AuthUser {
  uid: string;
  email: string;
  role: "STUDENT" | "ADMIN" | "SUPER_ADMIN";
  institutionId?: string;
  mongoUserId?: string;
}

/**
 * Extracts and verifies the Firebase ID Token from the Authorization header.
 * Returns the decoded user or throws a NextResponse with 401.
 */
export async function verifyAuth(req: NextRequest): Promise<AuthUser> {
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    throw NextResponse.json(
      { success: false, error: "Missing or invalid Authorization header" },
      { status: 401 }
    );
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return {
      uid: decoded.uid,
      email: decoded.email || "",
      role: (decoded.role as AuthUser["role"]) || "STUDENT",
      institutionId: decoded.institutionId as string | undefined,
      mongoUserId: decoded.mongoUserId as string | undefined,
    };
  } catch {
    throw NextResponse.json(
      { success: false, error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}

/**
 * Higher-order handler that wraps a Next.js API route with Firebase Auth.
 * Usage:
 *   export const GET = withAuth(async (req, user) => { ... });
 *   export const POST = withAuth(async (req, user) => { ... }, ["ADMIN"]);
 */
export function withAuth(
  handler: (req: NextRequest, user: AuthUser) => Promise<NextResponse>,
  allowedRoles?: Array<"STUDENT" | "ADMIN" | "SUPER_ADMIN">
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    let user: AuthUser;

    try {
      user = await verifyAuth(req);
    } catch (err) {
      return err as NextResponse;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { success: false, error: "Forbidden: insufficient permissions" },
        { status: 403 }
      );
    }

    return handler(req, user);
  };
}

/** Convenience wrappers */
export const withAdminAuth = (
  handler: (req: NextRequest, user: AuthUser) => Promise<NextResponse>
) => withAuth(handler, ["ADMIN", "SUPER_ADMIN"]);

export const withSuperAdminAuth = (
  handler: (req: NextRequest, user: AuthUser) => Promise<NextResponse>
) => withAuth(handler, ["SUPER_ADMIN"]);

