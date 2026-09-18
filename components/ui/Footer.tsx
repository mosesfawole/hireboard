"use client";

import Link from "next/link";
import { Briefcase } from "lucide-react";

export default function Footer() {
  return (
    <footer className="px-4 pb-8 pt-6 md:px-6">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 md:grid-cols-[1.4fr_0.8fr_0.8fr_1fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-2xl"
                style={{
                  background: "var(--brand-soft)",
                  border: "1px solid var(--panel-border)",
                }}
              >
                <Briefcase size={18} style={{ color: "var(--brand)" }} />
              </div>
              <div>
                <p
                  className="font-display text-base font-bold"
                  style={{ color: "var(--text)" }}
                >
                  HireBoard
                </p>
                <p className="text-sm text-muted">
                  Better work starts with better listings.
                </p>
              </div>
            </div>

            <p className="max-w-sm text-sm leading-6 text-muted">
              HireBoard keeps the search focused: useful details, thoughtful companies,
              and less noise between you and the next good role.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
              Explore
            </p>
            <div className="mt-4 space-y-3 text-sm text-muted">
              <Link
                href="/jobs"
                className="block transition-colors hover:text-[var(--text)]"
              >
                Browse Jobs
              </Link>
              <Link
                href="/jobs"
                className="block transition-colors hover:text-[var(--text)]"
              >
                Featured Roles
              </Link>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
              Employers
            </p>
            <div className="mt-4 space-y-3 text-sm text-muted">
              <Link
                href="/auth/register"
                className="block transition-colors hover:text-[var(--text)]"
              >
                Create Account
              </Link>
              <Link
                href="/auth/login"
                className="block transition-colors hover:text-[var(--text)]"
              >
                Sign In
              </Link>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
              Company
            </p>
            <div className="mt-4 space-y-3 text-sm text-muted">
              <Link
                href="https://github.com/mosesfawole"
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-colors hover:text-[var(--text)]"
              >
                GitHub
              </Link>
              <p>Made for the next right move.</p>
            </div>
          </div>
        </div>

        <div
          className="mt-8 flex flex-col gap-3 border-t pt-4 text-sm text-muted md:flex-row md:items-center md:justify-between"
          style={{ borderColor: "var(--panel-border)" }}
        >
          <p>Copyright 2026 HireBoard. All rights reserved.</p>
          <p>
            Designed and built by{" "}
            <Link
              href="https://github.com/mosesfawole"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--brand)" }}
            >
              Moses Fawole
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
