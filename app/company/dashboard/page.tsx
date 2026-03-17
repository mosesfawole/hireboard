"use client";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Badge, {
  getJobTypeBadge,
  getStatusBadge,
  formatJobType,
} from "@/components/ui/Badge";
import { useJobStore } from "@/store/useJobStore";
import { Plus, Trash2, Briefcase } from "lucide-react";
import type { Job } from "@/types";

export default function CompanyDashboardPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const { isDark } = useJobStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const justPosted = searchParams.get("posted") === "true";
  const companyId = session?.user?.companyId;

  const fetchJobs = useCallback(async () => {
    if (!companyId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/jobs?companyId=${companyId}`);
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const deleteJob = async (id: string) => {
    if (!confirm("Delete this job?")) return;
    await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    fetchJobs();
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: isDark ? "#08080f" : "#f4f4f8" }}
    >
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-xl font-display font-bold"
              style={{ color: isDark ? "#ffffff" : "#1a1a2e" }}
            >
              Your Job Listings
            </h1>
            <p
              className="text-xs font-mono mt-0.5"
              style={{ color: "#5a5a8a" }}
            >
              Manage your posted positions
            </p>
          </div>
          <Link
            href="/company/post"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold"
            style={{ background: "#4d9fff", color: "#ffffff" }}
          >
            <Plus size={13} />
            Post a Job
          </Link>
        </div>

        {/* Success message */}
        {justPosted && (
          <div
            className="px-4 py-3 rounded-xl text-xs font-mono"
            style={{
              background: "rgba(0,212,170,0.1)",
              border: "1px solid rgba(0,212,170,0.2)",
              color: "#00d4aa",
            }}
          >
            Job submitted successfully — it will go live once approved by our
            team
          </div>
        )}

        {/* Jobs list */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-20 rounded-xl animate-pulse"
                style={{ background: isDark ? "#0f0f20" : "#ffffff" }}
              />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 gap-3 rounded-xl"
            style={{
              background: isDark ? "#0f0f20" : "#ffffff",
              border: `1px solid ${isDark ? "#252540" : "#e0e0f0"}`,
            }}
          >
            <Briefcase size={24} style={{ color: "#5a5a8a" }} />
            <p
              className="text-sm font-semibold"
              style={{ color: isDark ? "#ffffff" : "#1a1a2e" }}
            >
              No jobs posted yet
            </p>
            <Link
              href="/company/post"
              className="px-4 py-2 rounded-xl text-xs font-bold"
              style={{ background: "#4d9fff", color: "#ffffff" }}
            >
              Post your first job
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="flex items-center gap-4 p-4 rounded-xl"
                style={{
                  background: isDark ? "#0f0f20" : "#ffffff",
                  border: `1px solid ${isDark ? "#252540" : "#e0e0f0"}`,
                }}
              >
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-display font-bold truncate"
                    style={{ color: isDark ? "#ffffff" : "#1a1a2e" }}
                  >
                    {job.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge
                      label={formatJobType(job.type)}
                      variant={getJobTypeBadge(job.type)}
                    />
                    <Badge
                      label={job.status}
                      variant={getStatusBadge(job.status)}
                    />
                    <span
                      className="text-[11px] font-mono"
                      style={{ color: "#5a5a8a" }}
                    >
                      {job.location}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => deleteJob(job.id)}
                  className="p-2 rounded-lg shrink-0"
                  style={{
                    background: "rgba(255,77,109,0.1)",
                    color: "#ff4d6d",
                  }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
