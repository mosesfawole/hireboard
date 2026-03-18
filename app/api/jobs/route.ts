import { NextRequest, NextResponse } from "next/server";
import { getActiveJobs, createJob, getJobsByCompany } from "@/lib/db";
import { auth } from "@/auth";
import { getErrorMessage } from "@/lib/errors";
import type { CreateJobInput } from "@/types";

// GET /api/jobs — fetch all active jobs for the public board
// No auth required — anyone can browse jobs
export async function GET(req: NextRequest) {
  try {
    const companyId = req.nextUrl.searchParams.get("companyId");

    if (companyId) {
      // Return jobs for a specific company
      const jobs = await getJobsByCompany(companyId);
      return NextResponse.json(jobs);
    }

    // Return all active jobs for public board
    const jobs = await getActiveJobs();
    return NextResponse.json(jobs);
  } catch {
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
    const { companyId } = session.user;
    if (!companyId) {
      return NextResponse.json(
        { error: "No company profile found" },
        { status: 403 },
      );
    }

    const body = (await req.json()) as Partial<CreateJobInput>;
    const normalizedBody = {
      title: body.title?.trim(),
      description: body.description?.trim(),
      location: body.location?.trim(),
      salary: body.salary?.trim(),
      type: body.type,
      category: body.category?.trim(),
      apply_url: body.apply_url?.trim(),
    };

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
      if (!normalizedBody[field as keyof typeof normalizedBody]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 },
        );
      }
    }

    const job = await createJob({
      ...normalizedBody,
      company_id: companyId,
    } as CreateJobInput);

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    const message = getErrorMessage(error, "Failed to create job");
    console.error("[POST /api/jobs]", message);
    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
