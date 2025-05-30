import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore =await cookies();
  const token = cookieStore.get("authToken")?.value || null;
  const userId = cookieStore.get("userId")?.value || null;
  const phone = cookieStore.get("phone")?.value || null;
  return NextResponse.json({ userId, token, phone });
}
