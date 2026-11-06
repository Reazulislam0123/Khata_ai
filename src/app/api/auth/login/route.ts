import { NextResponse } from "next/server";
import { encodeSessionUser } from "@/lib/server-auth";
import { store } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const { emailOrId, password } = await req.json();

    if (!emailOrId || !password) {
      return NextResponse.json(
        { success: false, error: "Email/ID and password are required" },
        { status: 400 }
      );
    }

    const user = store.loginUser(emailOrId, password);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials. Please check your email and password." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
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

    if (user.role === "ADMIN") {
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
      { success: false, error: err.message || "Login failed" },
      { status: 500 }
    );
  }
}
