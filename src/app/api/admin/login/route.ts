import { NextResponse } from "next/server";
import { encodeSessionUser } from "@/lib/server-auth";
import { store } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const { adminId, password } = await req.json();

    if (!adminId || !password) {
      return NextResponse.json(
        { success: false, error: "Admin ID and Password are required" },
        { status: 400 }
      );
    }

    const isValid = store.validateAdmin(adminId, password);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid Admin ID or Password" },
        { status: 401 }
      );
    }

    // Set persona to ADMIN in store
    store.setCurrentUser("ADMIN");
    const adminUser = store.getCurrentUser();

    const response = NextResponse.json({
      success: true,
      message: "Admin authentication successful",
      user: adminUser,
    });

    if (adminUser) {
      response.cookies.set("khata_user_session", adminUser.id, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      response.cookies.set("khata_user_data", encodeSessionUser(adminUser), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
    }

    // Set cookie for admin session
    response.cookies.set("khata_admin_session", "authenticated_admin", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
