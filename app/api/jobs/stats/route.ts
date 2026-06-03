import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import Job from "@/models/Job";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { ok: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const email = user.email;

    const [total, test, interview, offer, reject] = await Promise.all([
      Job.countDocuments({ userEmail: email }),
      Job.countDocuments({ userEmail: email, status: "Online Test" }),
      Job.countDocuments({ userEmail: email, status: "Interview" }),
      Job.countDocuments({ userEmail: email, status: "Offer" }),
      Job.countDocuments({ userEmail: email, status: "Rejected" }),
    ]);

    return NextResponse.json({
      ok: true,
      stats: { total, test, interview, offer, reject },
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}
