import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/server-auth";
import { store } from "@/lib/store";

export async function GET() {
  const currentUser = await getAuthenticatedUser();
  const allUsers = store.getAllUsers();
  return NextResponse.json({ success: true, currentUser, allUsers });
}

export async function POST(req: Request) {
  try {
    const { role } = await req.json();
    store.setCurrentUser(role);
    const updatedUser = store.getCurrentUser();
    return NextResponse.json({ success: true, currentUser: updatedUser });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
