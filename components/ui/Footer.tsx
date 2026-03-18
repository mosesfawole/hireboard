"use client";
import Link from "next/link";
import { useJobStore } from "@/store/useJobStore";
import { Briefcase } from "lucide-react";

export default function Footer() {
  const { isDark } = useJobStore();

  return (
    <footer
      className="py-8 px-4 md:px-8 mt-auto"
      style={{ borderTop: `1px solid ${isDark ? "#252540" : "#e0e0f0"}` }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Briefcase size={14} style={{ color: "#4d9fff" }} />
          <span
            className="font-display font-bold text-sm"
            style={{ color: isDark ? "#ffffff" : "#1a1a2e" }}
          >
            Hire<span style={{ color: "#4d9fff" }}>Board</span>
          </span>
        </div>

        <p className="text-xs font-mono" style={{ color: "#5a5a8a" }}>
          © 2026 HireBoard — Made by {""}
          <Link
            href="https://github.com/mosesfawole"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#4d9fff" }}
          >
            Moses Fawole
          </Link>
        </p>

        <div className="flex items-center gap-4">
          <Link
            href="/jobs"
            className="text-xs font-mono transition-colors"
            style={{ color: "#5a5a8a" }}
          >
            Browse Jobs
          </Link>
          <Link
            href="/auth/register"
            className="text-xs font-mono transition-colors"
            style={{ color: "#5a5a8a" }}
          >
            Post a Job
          </Link>
        </div>
      </div>
    </footer>
  );
}
