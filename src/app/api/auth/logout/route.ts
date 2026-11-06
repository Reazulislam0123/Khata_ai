import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function POST() {
  // Clear persona on logout
  store.setCurrentUser(null);

  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  // Expire cookies
  response.cookies.set("khata_user_session", "", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  response.cookies.set("khata_user_data", "", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  response.cookies.set("khata_admin_session", "", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
