import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { compare } from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    await connectDB();

    const user = await User.findOne({ email: normalizedEmail })
      .select("name email password")
      .lean();

    if (!user) {
      return NextResponse.json(
        { ok: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isValid = await compare(
      String(password),
      (user as { password: string }).password
    );
    if (!isValid) {
      return NextResponse.json(
        { ok: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = await signToken({
      email: (user as { email: string }).email,
      name: (user as { name: string }).name,
    });

    const res = NextResponse.json({
      ok: true,
      user: {
        name: (user as { name: string }).name,
        email: (user as { email: string }).email,
      },
      token,
    });

    res.cookies.set("jat_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch {
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}
