"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useJobStore } from "@/store/useJobStore";
import { useEffect } from "react";
import {
  Briefcase,
  Sun,
  Moon,
  LogOut,
  LayoutDashboard,
  Shield,
  Sparkles,
} from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const { isDark, toggleTheme } = useJobStore();
  const role = session?.user?.role;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <nav className="sticky top-0 z-30 px-3 pt-3 md:px-6">
      <div className="surface-card mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 md:px-5">
        <Link href="/jobs" className="flex shrink-0 items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-2xl"
            style={{
              background:
                "linear-gradient(135deg, var(--brand-soft), rgba(24, 74, 69, 0.12))",
              border: "1px solid var(--panel-border)",
            }}
          >
            <Briefcase size={18} style={{ color: "var(--brand)" }} />
          </div>
          <div className="leading-none">
            <span
              className="font-display block text-base font-bold tracking-tight"
              style={{ color: "var(--text)" }}
            >
              HireBoard
            </span>
            <span className="text-[11px] font-semibold text-muted">
              Premium hiring workflow
            </span>
          </div>
        </Link>

        <div className="ml-4 hidden items-center gap-2 md:flex">
          <Link
            href="/jobs"
            className="ui-button-secondary px-4 py-2 text-xs font-semibold"
          >
            Browse Jobs
          </Link>

          {role === "ADMIN" && (
            <Link
              href="/admin"
              className="ui-button-secondary flex items-center gap-1.5 px-4 py-2 text-xs font-semibold"
              style={{ color: "#b37bff" }}
            >
              <Shield size={12} />
              Admin
            </Link>
          )}

          {role === "COMPANY" && (
            <Link
              href="/company/dashboard"
              className="ui-button-secondary flex items-center gap-1.5 px-4 py-2 text-xs font-semibold"
              style={{ color: "var(--hero-accent)" }}
            >
              <LayoutDashboard size={12} />
              Dashboard
            </Link>
          )}

          {!session && (
            <Link
              href="/auth/register"
              className="ui-button-secondary flex items-center gap-1.5 px-4 py-2 text-xs font-semibold"
            >
              <Sparkles size={12} />
              For Employers
            </Link>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {role === "COMPANY" && (
            <Link
              href="/company/post"
              className="ui-button hidden items-center gap-1.5 px-4 py-2.5 text-xs font-bold sm:flex"
            >
              Post a Job
            </Link>
          )}

          {session ? (
            <button
              onClick={() => signOut({ callbackUrl: "/jobs" })}
              className="ui-button-secondary flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold"
            >
              <LogOut size={12} />
              <span className="hidden sm:block">Sign out</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="ui-button-secondary px-3.5 py-2.5 text-xs font-semibold"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="ui-button px-4 py-2.5 text-xs font-bold"
              >
                Post a Job
              </Link>
            </div>
          )}

          <button
            onClick={toggleTheme}
            className="ui-button-secondary p-2.5 transition-all"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun size={13} style={{ color: "var(--warning)" }} />
            ) : (
              <Moon size={13} style={{ color: "var(--brand)" }} />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
