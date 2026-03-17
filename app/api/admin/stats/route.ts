import { NextResponse } from "next/server";
import { getAdminStats, getAllJobs, getAllCompanies } from "@/lib/db";
import { auth } from "@/auth";
import { getErrorMessage } from "@/lib/errors";

// GET /api/admin/stats — returns all stats for admin dashboard
export async function GET() {
  try {
    const session = await auth();

    // Double check — only admins can access this
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [stats, jobs, companies] = await Promise.all([
      getAdminStats(),
      getAllJobs(),
      getAllCompanies(),
    ]);

    return NextResponse.json({ stats, jobs, companies });
  } catch (error) {
    console.error("[GET /api/admin/stats]", getErrorMessage(error));
    return NextResponse.json(
      { error: "Failed to fetch admin data" },
      { status: 500 },
    );
  }
}
