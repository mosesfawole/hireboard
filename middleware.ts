import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Pages that require a company account
  const companyRoutes = ["/company/dashboard", "/company/post"];

  // Pages that require admin access
  const adminRoutes = ["/admin"];

  // Check company routes
  if (companyRoutes.some((route) => pathname.startsWith(route))) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  // Check admin routes
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  return NextResponse.next();
});

// Tell Next.js which routes this middleware runs on
// Don't run on static files, images or the NextAuth API routes
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
