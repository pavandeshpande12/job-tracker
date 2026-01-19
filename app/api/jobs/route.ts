import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Job from "@/models/Job";

// GET /api/jobs?email=...
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { ok: false, message: "email query param required" },
        { status: 400 }
      );
    }

    await connectDB();
    const jobs = await Job.find({ userEmail: email }).sort({ createdAt: -1 });

    return NextResponse.json({ ok: true, jobs });
  } catch (error) {
    console.error("Jobs GET error:", error);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// POST /api/jobs  (create job)
export async function POST(req: Request) {
  try {
    const { userEmail, company, role, status, appliedDate, notes } =
      await req.json();

    if (!userEmail || !company || !role || !appliedDate) {
      return NextResponse.json(
        { ok: false, message: "userEmail, company, role, appliedDate required" },
        { status: 400 }
      );
    }

    await connectDB();

    const job = await Job.create({
      userEmail,
      company,
      role,
      status: status || "Applied",
      appliedDate: new Date(appliedDate),
      notes: notes || "",
    });

    return NextResponse.json({ ok: true, job }, { status: 201 });
  } catch (error) {
    console.error("Jobs POST error:", error);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// PUT /api/jobs  (update by id)
export async function PUT(req: Request) {
  try {
    const { id, company, role, status, appliedDate, notes } = await req.json();

    if (!id) {
      return NextResponse.json(
        { ok: false, message: "id is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const updated = await Job.findByIdAndUpdate(
      id,
      {
        company,
        role,
        status,
        appliedDate: appliedDate ? new Date(appliedDate) : undefined,
        notes,
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
  } catch (error) {
    console.error("Jobs PUT error:", error);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/jobs  (delete by id in body)
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { ok: false, message: "id is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const result = await Job.deleteOne({ _id: id });

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
  } catch (error) {
    console.error("Jobs DELETE error:", error);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}
