import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function POST() {
  // Revert persona back to TEACHER
  store.setCurrentUser("TEACHER");

  const response = NextResponse.json({
    success: true,
    message: "Admin logged out successfully",
  });

  // Expire the admin session cookie
  response.cookies.set("khata_admin_session", "", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
