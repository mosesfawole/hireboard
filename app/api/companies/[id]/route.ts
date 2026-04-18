import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { deleteCompanyById } from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const deleted = await deleteCompanyById(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Failed to delete company" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete company" },
      { status: 500 },
    );
  }
}
