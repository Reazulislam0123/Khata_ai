import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { store } from "@/lib/store";
import { decodeSessionUser } from "@/lib/server-auth";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("khata_admin_session");
  const userData = cookieStore.get("khata_user_data");
  const currentUser = store.getCurrentUser();

  let decodedUser = null;
  if (userData?.value) {
    try {
      decodedUser = decodeSessionUser(userData.value);
    } catch {}
  }

  const isAdminSession =
    session?.value === "authenticated_admin" ||
    currentUser?.role === "ADMIN" ||
    (currentUser as any)?.role === "SUPER_ADMIN" ||
    (decodedUser as any)?.role === "ADMIN" ||
    (decodedUser as any)?.role === "SUPER_ADMIN" ||
    (decodedUser as any)?.email === "admin@khata.ai";

  const adminUser = store.getAllUsers().find((u) => u.role === "ADMIN");

  return NextResponse.json({
    authenticated: !!isAdminSession,
    user: isAdminSession ? (decodedUser || currentUser || adminUser || null) : null,
  });
}
