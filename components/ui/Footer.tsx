"use client";
import Link from "next/link";
import { ArrowRight, Briefcase } from "lucide-react";

export default function Footer() {
  return (
    <footer className="px-4 pb-8 pt-4 md:px-6">
      <div className="surface-card mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
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
            <div>
              <p className="font-display text-base font-bold" style={{ color: "var(--text)" }}>
                HireBoard
              </p>
              <p className="text-sm text-muted">A sharper home for modern job discovery.</p>
            </div>
          </div>

          <p className="max-w-md text-sm leading-6 text-muted">
            Built for companies that want better-looking listings and candidates who
            want cleaner, faster browsing.
          </p>
        </div>

        <div className="flex flex-col gap-3 md:items-end">
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/jobs" className="ui-button-secondary px-4 py-2 text-xs font-semibold">
              Browse Jobs
            </Link>
            <Link href="/auth/register" className="ui-button px-4 py-2 text-xs font-bold">
              Post a Job
              <ArrowRight size={12} />
            </Link>
          </div>
          <p className="text-xs font-medium text-muted">
            © 2026 HireBoard. Made by{" "}
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
