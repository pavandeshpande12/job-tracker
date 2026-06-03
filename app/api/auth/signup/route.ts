import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { hash } from "bcryptjs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { ok: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const trimmedName = String(name).trim().slice(0, 100);
    const normalizedEmail = String(email).trim().toLowerCase();

    if (!EMAIL_RE.test(normalizedEmail)) {
      return NextResponse.json(
        { ok: false, message: "Invalid email address" },
        { status: 400 }
      );
    }

    if (String(password).length < 6) {
      return NextResponse.json(
        { ok: false, message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json(
        { ok: false, message: "Email already registered" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(String(password), 12);

    await User.create({
      name: trimmedName,
      email: normalizedEmail,
      password: hashedPassword,
    });

    return NextResponse.json(
      { ok: true, message: "User created successfully" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}
