import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Job from "@/models/Job";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const email = req.nextUrl.searchParams.get("email");
    if (!email) {
      return NextResponse.json(
        { ok: false, message: "Email required" },
        { status: 400 }
      );
    }

    const total = await Job.countDocuments({ userEmail: email });
    const test = await Job.countDocuments({
      userEmail: email,
      status: "Online Test",
    });
    const interview = await Job.countDocuments({
      userEmail: email,
      status: "Interview",
    });
    const offer = await Job.countDocuments({
      userEmail: email,
      status: "Offer",
    });
    const reject = await Job.countDocuments({
      userEmail: email,
      status: "Rejected",
    });

    return NextResponse.json({
      ok: true,
      stats: { total, test, interview, offer, reject },
    });
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}
