import { NextRequest, NextResponse } from "next/server";
import { getJobById, updateJob, deleteJob } from "@/lib/db";
import { auth } from "@/auth";

// GET /api/jobs/[id] — fetch a single job
// No auth required
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const job = await getJobById(id);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    return NextResponse.json(job);
  } catch {
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}

// PATCH /api/jobs/[id] — update a job
// Companies can only update their own jobs
// Admins can update any job (used for approving/rejecting)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, companyId } = session.user;

    // If company, verify they own this job
    if (role === "COMPANY") {
      const existing = await getJobById(id);
      if (!existing || existing.company_id !== companyId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const body = await req.json();
    const updated = await updateJob(id, body);

    if (!updated) {
      return NextResponse.json(
        { error: "Failed to update job" },
        { status: 500 },
      );
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update job" },
      { status: 500 },
    );
  }
}

// DELETE /api/jobs/[id] — delete a job
// Companies can only delete their own jobs
// Admins can delete any job
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, companyId } = session.user;

    if (role === "COMPANY") {
      const existing = await getJobById(id);
      if (!existing || existing.company_id !== companyId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const success = await deleteJob(id);
    if (!success) {
      return NextResponse.json(
        { error: "Failed to delete job" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete job" },
      { status: 500 },
    );
  }
}
