import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { token, userId } = await req.json();

  const cookieStore = await cookies();
  
  const cookieData = [
    { name: "authToken", value: token },
    { name: "userId", value: userId},
  ];

  cookieData.forEach(({ name, value }) => {
    cookieStore.set({
      name,
      value,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60, // 1 ngày
      path: "/",
    });
  });

  return NextResponse.json({ message: "Login successful" });
}
