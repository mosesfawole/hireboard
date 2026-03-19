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
} from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const { isDark, toggleTheme } = useJobStore();
  const role = session?.user?.role;

  // Apply saved theme on mount
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <nav
      className="surface-subtle h-16 flex items-center px-4 md:px-8 gap-4 sticky top-0 z-30"
      style={{
        borderBottom: "1px solid var(--panel-border)",
      }}
    >
      {/* Logo */}
      <Link href="/jobs" className="flex items-center gap-2 shrink-0">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{
            background: "rgba(77,159,255,0.1)",
            border: "1px solid rgba(77,159,255,0.25)",
          }}
        >
          <Briefcase size={14} style={{ color: "#4d9fff" }} />
        </div>
        <span
          className="font-display font-bold tracking-tight text-sm"
          style={{ color: "var(--text)" }}
        >
          Hire<span style={{ color: "var(--brand)" }}>Board</span>
        </span>
      </Link>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-3">
        {/* Admin link */}
        {role === "ADMIN" && (
          <Link
            href="/admin"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold transition-colors"
            style={{ color: "#a78bfa" }}
          >
            <Shield size={12} />
            Admin
          </Link>
        )}

        {/* Company dashboard link */}
        {role === "COMPANY" && (
          <Link
            href="/company/dashboard"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold transition-colors"
            style={{ color: "var(--brand)" }}
          >
            <LayoutDashboard size={12} />
            Dashboard
          </Link>
        )}

        {/* Post a job button */}
        {role === "COMPANY" && (
          <Link
            href="/company/post"
            className="ui-button hidden sm:flex items-center gap-1.5 px-4 py-2 text-xs font-bold transition-all"
          >
            Post a Job
          </Link>
        )}

        {/* Login / logout */}
        {session ? (
          <button
            onClick={() => signOut({ callbackUrl: "/jobs" })}
            className="flex items-center gap-1.5 text-xs font-semibold transition-colors text-muted"
          >
            <LogOut size={12} />
            <span className="hidden sm:block">Sign out</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/auth/login"
              className="text-xs font-semibold transition-colors"
              style={{ color: "var(--text)" }}
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="ui-button px-4 py-2 text-xs font-bold"
            >
              Post a Job
            </Link>
          </div>
        )}

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="ui-button-secondary p-2.5 transition-all"
        >
          {isDark ? (
            <Sun size={13} style={{ color: "var(--warning)" }} />
          ) : (
            <Moon size={13} style={{ color: "var(--brand)" }} />
          )}
        </button>
      </div>
    </nav>
  );
}
