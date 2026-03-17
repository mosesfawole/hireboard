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
  const role = (session?.user as any)?.role;

  // Apply saved theme on mount
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <nav
      className="h-14 flex items-center px-4 md:px-8 gap-4 sticky top-0 z-30"
      style={{
        background: isDark ? "#0a0a18" : "#ffffff",
        borderBottom: `1px solid ${isDark ? "#252540" : "#e0e0f0"}`,
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
          style={{ color: isDark ? "#ffffff" : "#1a1a2e" }}
        >
          Hire<span style={{ color: "#4d9fff" }}>Board</span>
        </span>
      </Link>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-3">
        {/* Admin link */}
        {role === "ADMIN" && (
          <Link
            href="/admin"
            className="hidden sm:flex items-center gap-1.5 text-xs font-mono transition-colors"
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
            className="hidden sm:flex items-center gap-1.5 text-xs font-mono transition-colors"
            style={{ color: "#4d9fff" }}
          >
            <LayoutDashboard size={12} />
            Dashboard
          </Link>
        )}

        {/* Post a job button */}
        {role === "COMPANY" && (
          <Link
            href="/company/post"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={{
              background: "#4d9fff",
              color: "#ffffff",
            }}
          >
            Post a Job
          </Link>
        )}

        {/* Login / logout */}
        {session ? (
          <button
            onClick={() => signOut({ callbackUrl: "/jobs" })}
            className="flex items-center gap-1.5 text-xs font-mono transition-colors"
            style={{ color: "#5a5a8a" }}
          >
            <LogOut size={12} />
            <span className="hidden sm:block">Sign out</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/auth/login"
              className="text-xs font-mono transition-colors"
              style={{ color: isDark ? "#e0e0f4" : "#1a1a2e" }}
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="px-3 py-1.5 rounded-lg text-xs font-bold"
              style={{ background: "#4d9fff", color: "#ffffff" }}
            >
              Post a Job
            </Link>
          </div>
        )}

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg transition-all"
          style={{
            background: isDark ? "#13132a" : "#f0f0f8",
            border: `1px solid ${isDark ? "#252540" : "#e0e0f0"}`,
          }}
        >
          {isDark ? (
            <Sun size={13} style={{ color: "#f0c040" }} />
          ) : (
            <Moon size={13} style={{ color: "#4d9fff" }} />
          )}
        </button>
      </div>
    </nav>
  );
}
