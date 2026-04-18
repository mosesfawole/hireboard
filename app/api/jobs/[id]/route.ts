import { NextRequest, NextResponse } from "next/server";
import { getJobById, updateJob, deleteJob } from "@/lib/db";
import { auth } from "@/auth";
import type { Job, JobType } from "@/types";

function isEditableJobType(value: unknown): value is JobType {
  return (
    value === "FULL_TIME" ||
    value === "PART_TIME" ||
    value === "CONTRACT" ||
    value === "REMOTE" ||
    value === "INTERNSHIP"
  );
}

function pickCompanyJobUpdates(body: Record<string, unknown>): Partial<Job> {
  const updates: Partial<Job> = {};

  if (typeof body.title === "string") updates.title = body.title.trim();
  if (typeof body.description === "string") {
    updates.description = body.description.trim();
  }
  if (typeof body.location === "string") updates.location = body.location.trim();
  if (typeof body.salary === "string") updates.salary = body.salary.trim() || undefined;
  if (typeof body.category === "string") updates.category = body.category.trim();
  if (typeof body.apply_url === "string") updates.apply_url = body.apply_url.trim();
  if (isEditableJobType(body.type)) updates.type = body.type;

  return updates;
}

function pickAdminJobUpdates(body: Record<string, unknown>): Partial<Job> {
  const updates = pickCompanyJobUpdates(body);

  if (
    body.status === "PENDING" ||
    body.status === "ACTIVE" ||
    body.status === "REJECTED" ||
    body.status === "CLOSED"
  ) {
    updates.status = body.status;
  }

  if (typeof body.featured === "boolean") {
    updates.featured = body.featured;
  }

  return updates;
}

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

    if (job.status !== "ACTIVE") {
      const session = await auth();
      const canAccessDraft =
        session?.user.role === "ADMIN" || session?.user.companyId === job.company_id;

      if (!canAccessDraft) {
        return NextResponse.json({ error: "Job not found" }, { status: 404 });
      }
    }

    return NextResponse.json(job);
  } catch {
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}

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
    const existing = await getJobById(id);

    if (!existing) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (role === "COMPANY" && existing.company_id !== companyId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await req.json()) as Record<string, unknown>;
    const updates =
      role === "ADMIN" ? pickAdminJobUpdates(body) : pickCompanyJobUpdates(body);

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid job fields were provided" },
        { status: 400 },
      );
    }

    const updated = await updateJob(id, updates);

    if (!updated) {
      return NextResponse.json(
        { error: "Failed to update job" },
        { status: 500 },
      );
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}

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
    const existing = await getJobById(id);

    if (!existing) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (role === "COMPANY" && existing.company_id !== companyId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}
