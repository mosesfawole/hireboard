import { NextRequest, NextResponse } from "next/server";
import { getActiveJobs, createJob } from "@/lib/db";
import { auth } from "@/auth";

// GET /api/jobs — fetch all active jobs for the public board
// No auth required — anyone can browse jobs
export async function GET(req: NextRequest) {
  try {
    const jobs = await getActiveJobs();
    return NextResponse.json(jobs);
  } catch (err: any) {
    console.error("[GET /api/jobs]", err.message);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 },
    );
  }
}

// POST /api/jobs — create a new job listing
// Requires a company account — checks session before doing anything
export async function POST(req: NextRequest) {
  try {
    // Check the user is logged in
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "You must be logged in to post a job" },
        { status: 401 },
      );
    }

    // Check they have a company account
    const companyId = (session.user as any).companyId;
    if (!companyId) {
      return NextResponse.json(
        { error: "No company profile found" },
        { status: 403 },
      );
    }

    const body = await req.json();

    // Basic validation — make sure required fields are present
    const required = [
      "title",
      "description",
      "location",
      "type",
      "category",
      "apply_url",
    ];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 },
        );
      }
    }

    const job = await createJob({ ...body, company_id: companyId });
    if (!job) {
      return NextResponse.json(
        { error: "Failed to create job" },
        { status: 500 },
      );
    }

    return NextResponse.json(job, { status: 201 });
  } catch (err: any) {
    console.error("[POST /api/jobs]", err.message);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 },
    );
  }
}
