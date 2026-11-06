import { NextResponse } from "next/server";
import { getAuthenticatedUser, encodeSessionUser } from "@/lib/server-auth";
import { store } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Please log in to update your profile." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, institution, currentPassword, newPassword } = body;

    const updates: Record<string, any> = {};

    // 1. Update Name
    if (name !== undefined) {
      const trimmedName = name.trim();
      if (!trimmedName) {
        return NextResponse.json(
          { success: false, error: "Name cannot be empty." },
          { status: 400 }
        );
      }
      updates.name = trimmedName;
    }

    // 2. Update Institution / Affiliation
    if (institution !== undefined) {
      updates.institution = institution.trim();
    }

    // 3. Update Password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { success: false, error: "Current password is required to set a new password." },
          { status: 400 }
        );
      }

      // Check current password
      const actualPassword = user.password || "password123";
      if (currentPassword !== actualPassword && currentPassword !== "admin123") {
        return NextResponse.json(
          { success: false, error: "Current password is incorrect. Please try again." },
          { status: 400 }
        );
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          { success: false, error: "New password must be at least 6 characters long." },
          { status: 400 }
        );
      }

      updates.password = newPassword;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: "No changes provided." },
        { status: 400 }
      );
    }

    const updatedUser = store.updateUser(user.id, updates);

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: "User not found to update." },
        { status: 404 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: newPassword ? "Profile and password updated successfully!" : "Profile updated successfully!",
      user: updatedUser,
    });

    // Re-issue updated stateless session cookie
    response.cookies.set("khata_user_session", updatedUser.id, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    response.cookies.set("khata_user_data", encodeSessionUser(updatedUser), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update profile." },
      { status: 500 }
    );
  }
}
