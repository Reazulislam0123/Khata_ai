import { NextResponse } from "next/server";
import { encodeSessionUser } from "@/lib/server-auth";
import { store } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const { name, email, password, role, institution } = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required" },
        { status: 400 }
      );
    }

    const assignedRole = role === "TEACHER" || role === "ADMIN" ? role : "STUDENT";

    const user = store.registerUser({
      name,
      email,
      password: password || "password123",
      role: assignedRole,
      institution,
    });

    const response = NextResponse.json({
      success: true,
      message: "Registration successful",
      user,
    });

    // Set auth cookies
    response.cookies.set("khata_user_session", user.id, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    response.cookies.set("khata_user_data", encodeSessionUser(user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    if (assignedRole === "ADMIN") {
      response.cookies.set("khata_admin_session", "authenticated_admin", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
    }

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Registration failed" },
      { status: 400 }
    );
  }
}
