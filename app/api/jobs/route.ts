import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import Job from "@/models/Job";

// GET /api/jobs — list jobs for the authenticated user
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
    const jobs = await Job.find({ userEmail: user.email })
      .sort({ createdAt: -1 });

    return NextResponse.json({ ok: true, jobs });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// POST /api/jobs — create job for the authenticated user
export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { ok: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      company, role, status, appliedDate, rejectedDate,
      notes, interviewExperience, feedback,
    } = await req.json();

    if (!company || !role) {
      return NextResponse.json(
        { ok: false, message: "company and role are required" },
        { status: 400 }
      );
    }

    const validStatuses = ["Applied", "Online Test", "Interview", "Offer", "Rejected"];
    const safeStatus = validStatuses.includes(status) ? status : "Applied";

    await connectDB();

    const job = await Job.create({
      userEmail: user.email,
      company: String(company).trim().slice(0, 200),
      role: String(role).trim().slice(0, 200),
      status: safeStatus,
      appliedDate: appliedDate ? new Date(appliedDate) : undefined,
      rejectedDate: rejectedDate ? new Date(rejectedDate) : undefined,
      notes: notes ? String(notes).slice(0, 2000) : "",
      interviewExperience: interviewExperience ? String(interviewExperience).slice(0, 5000) : "",
      feedback: {
        whatWentWell: feedback?.whatWentWell ? String(feedback.whatWentWell).slice(0, 2000) : "",
        whatDidntGoWell: feedback?.whatDidntGoWell ? String(feedback.whatDidntGoWell).slice(0, 2000) : "",
        lessonsLearned: feedback?.lessonsLearned ? String(feedback.lessonsLearned).slice(0, 2000) : "",
      },
    });

    return NextResponse.json({ ok: true, job }, { status: 201 });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// PUT /api/jobs — update a job owned by the authenticated user
export async function PUT(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { ok: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      id, company, role, status, appliedDate, rejectedDate,
      notes, interviewExperience, feedback,
    } = await req.json();

    if (!id) {
      return NextResponse.json(
        { ok: false, message: "id is required" },
        { status: 400 }
      );
    }

    const validStatuses = ["Applied", "Online Test", "Interview", "Offer", "Rejected"];
    const safeStatus = validStatuses.includes(status) ? status : undefined;

    await connectDB();

    const updated = await Job.findOneAndUpdate(
      { _id: id, userEmail: user.email },
      {
        company: company ? String(company).trim().slice(0, 200) : undefined,
        role: role ? String(role).trim().slice(0, 200) : undefined,
        status: safeStatus,
        notes: notes != null ? String(notes).slice(0, 2000) : undefined,
        appliedDate: appliedDate ? new Date(appliedDate) : null,
        rejectedDate: rejectedDate ? new Date(rejectedDate) : null,
        interviewExperience: interviewExperience != null ? String(interviewExperience).slice(0, 5000) : "",
        feedback: feedback ? {
          whatWentWell: feedback.whatWentWell ? String(feedback.whatWentWell).slice(0, 2000) : "",
          whatDidntGoWell: feedback.whatDidntGoWell ? String(feedback.whatDidntGoWell).slice(0, 2000) : "",
          lessonsLearned: feedback.lessonsLearned ? String(feedback.lessonsLearned).slice(0, 2000) : "",
        } : {},
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { ok: false, message: "Job not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, job: updated });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/jobs — delete a job owned by the authenticated user
export async function DELETE(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { ok: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { ok: false, message: "id is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const result = await Job.deleteOne({ _id: id, userEmail: user.email });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { ok: false, message: "Job not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Job deleted",
      deletedId: id,
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}
