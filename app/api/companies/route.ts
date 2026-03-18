import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, createUser, createCompany } from "@/lib/db";
import { getErrorMessage } from "@/lib/errors";

// POST /api/companies — register a new company account
// Creates a user + company profile together
export async function POST(req: NextRequest) {
  try {
    const { email, password, companyName, website, location, description } =
      await req.json();

    // Validate required fields
    if (!email || !password || !companyName) {
      return NextResponse.json(
        { error: "Email, password and company name are required" },
        { status: 400 },
      );
    }

    // Check email isn't already registered
    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    // Password strength check
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    // Create the user account first
    const user = await createUser(email, password);

    if (!user) {
      return NextResponse.json(
        { error: "Failed to create account" },
        { status: 500 },
      );
    }

    // Then create their company profile
    const company = await createCompany({
      name: companyName,
      website,
      location,
      description,
      user_id: user.id,
    });

    if (!company) {
      return NextResponse.json(
        { error: "Failed to create company profile" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { user: { id: user.id, email: user.email }, company },
      { status: 201 },
    );
  } catch (error) {
    const message = getErrorMessage(error, "Registration failed");
    console.error("[POST /api/companies]", message);

    return NextResponse.json(
      {
        error: message.includes("row-level security")
          ? "Registration is blocked by Supabase permissions. Add SUPABASE_SERVICE_ROLE_KEY to your server env or allow inserts for registration."
          : message,
      },
      { status: 500 },
    );
  }
}
