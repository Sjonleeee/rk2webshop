import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json();

  if (password === process.env.SITE_PASSWORD) {
    const res = NextResponse.json({ success: true });

    res.cookies.set("rk2-auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict",
      path: "/",
    });

    return res;
  }

  return NextResponse.json(
    { success: false },
    { status: 401 }
  );
}
