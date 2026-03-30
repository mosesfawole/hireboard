"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useJobStore } from "@/store/useJobStore";
import { useEffect, useState } from "react";
import {
  Briefcase,
  Sun,
  Moon,
  LogOut,
  LayoutDashboard,
  Shield,
  Sparkles,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const { isDark, toggleTheme } = useJobStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const role = session?.user?.role;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    if (!menuOpen) return;

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      const nav = document.getElementById("site-nav");
      if (nav && !nav.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  return (
    <nav id="site-nav" className="sticky top-0 z-30 px-3 pt-3 md:px-6">
      <div className="surface-card mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-5">
        <Link href="/jobs" className="flex shrink-0 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-(--panel-border) bg-[linear-gradient(135deg,var(--brand-soft),rgba(24,74,69,0.12))]">
            <Briefcase size={18} style={{ color: "var(--brand)" }} />
          </div>
          <div className="leading-none">
            <span className="font-display block text-base font-bold tracking-tight text-(--text)">
              HireBoard
            </span>
            <span className="text-[11px] font-semibold text-muted">
              Premium hiring workflow
            </span>
          </div>
        </Link>

        <button
          onClick={() => setMenuOpen((state) => !state)}
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-(--panel-border) bg-(--control-bg) text-sm text-(--text) shadow-sm transition hover:bg-(--control-hover) md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

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

        <div className="ml-auto hidden items-center gap-2 md:flex">
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

      {menuOpen && (
        <div className="md:hidden mx-auto mt-2 w-full max-w-7xl rounded-2xl border border-(--panel-border) bg-(--panel) p-3 shadow-lg backdrop-blur-xl">
          <div className="flex flex-col gap-2">
            <Link
              href="/jobs"
              onClick={() => setMenuOpen(false)}
              className="ui-button-secondary w-full text-left px-3 py-2 text-sm font-semibold"
            >
              Browse Jobs
            </Link>

            {role === "ADMIN" && (
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="ui-button-secondary w-full text-left px-3 py-2 text-sm font-semibold"
                style={{ color: "#b37bff" }}
              >
                Admin Dashboard
              </Link>
            )}

            {role === "COMPANY" && (
              <>
                <Link
                  href="/company/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="ui-button-secondary w-full text-left px-3 py-2 text-sm font-semibold"
                >
                  Company Dashboard
                </Link>
                <Link
                  href="/company/post"
                  onClick={() => setMenuOpen(false)}
                  className="ui-button w-full text-left px-3 py-2 text-sm font-bold"
                >
                  Post a Job
                </Link>
              </>
            )}

            {!session && (
              <Link
                href="/auth/register"
                onClick={() => setMenuOpen(false)}
                className="ui-button-secondary w-full text-left px-3 py-2 text-sm font-semibold"
              >
                For Employers
              </Link>
            )}

            {session ? (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  signOut({ callbackUrl: "/jobs" });
                }}
                className="ui-button-secondary w-full text-left px-3 py-2 text-sm font-semibold"
              >
                Sign out
              </button>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setMenuOpen(false)}
                  className="ui-button-secondary w-full text-left px-3 py-2 text-sm font-semibold"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMenuOpen(false)}
                  className="ui-button w-full text-left px-3 py-2 text-sm font-bold"
                >
                  Post a Job
                </Link>
              </>
            )}

            <button
              onClick={() => {
                toggleTheme();
                setMenuOpen(false);
              }}
              className="ui-button-secondary w-full px-3 py-2 text-sm font-semibold"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <span className="flex items-center gap-2">
                  <Sun size={13} style={{ color: "var(--warning)" }} />
                  Light mode
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Moon size={13} style={{ color: "var(--brand)" }} />
                  Dark mode
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
