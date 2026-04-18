import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, createUser, createCompany } from "@/lib/db";
import { getErrorMessage } from "@/lib/errors";

export async function POST(req: NextRequest) {
  try {
    const { email, password, companyName, website, location, description } =
      await req.json();

    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const normalizedPassword = typeof password === "string" ? password.trim() : "";
    const normalizedCompanyName =
      typeof companyName === "string" ? companyName.trim() : "";
    const normalizedWebsite = typeof website === "string" ? website.trim() : undefined;
    const normalizedLocation =
      typeof location === "string" ? location.trim() : undefined;
    const normalizedDescription =
      typeof description === "string" ? description.trim() : undefined;

    if (!normalizedEmail || !normalizedPassword || !normalizedCompanyName) {
      return NextResponse.json(
        { error: "Email, password and company name are required" },
        { status: 400 },
      );
    }

    const existing = await getUserByEmail(normalizedEmail);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    if (normalizedPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    const user = await createUser(normalizedEmail, normalizedPassword);

    if (!user) {
      return NextResponse.json(
        { error: "Failed to create account" },
        { status: 500 },
      );
    }

    const company = await createCompany({
      name: normalizedCompanyName,
      website: normalizedWebsite,
      location: normalizedLocation,
      description: normalizedDescription,
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
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
