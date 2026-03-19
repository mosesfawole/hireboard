"use client";
import Link from "next/link";
import { Briefcase } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="py-8 px-4 md:px-8 mt-auto"
      style={{ borderTop: "1px solid var(--panel-border)" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Briefcase size={14} style={{ color: "var(--brand)" }} />
          <span className="font-display font-bold text-sm" style={{ color: "var(--text)" }}>
            Hire<span style={{ color: "var(--brand)" }}>Board</span>
          </span>
        </div>

        <p className="text-xs font-medium text-muted">
          © 2026 HireBoard - Made by{" "}
          <Link
            href="https://github.com/mosesfawole"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--brand)" }}
          >
            Moses Fawole
          </Link>
        </p>

        <div className="flex items-center gap-4">
          <Link href="/jobs" className="text-xs font-medium transition-colors text-muted">
            Browse Jobs
          </Link>
          <Link
            href="/auth/register"
            className="text-xs font-medium transition-colors text-muted"
          >
            Post a Job
          </Link>
        </div>
      </div>
    </footer>
  );
}
