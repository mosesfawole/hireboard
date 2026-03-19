"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Badge, {
  formatJobType,
  getJobTypeBadge,
  getStatusBadge,
} from "@/components/ui/Badge";
import { Briefcase, Plus, Trash2 } from "lucide-react";
import type { Job } from "@/types";

function CompanyDashboardContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const justPosted = searchParams.get("posted") === "true";
  const companyId = session?.user?.companyId;

  const fetchJobs = useCallback(async () => {
    if (!companyId) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/jobs?companyId=${companyId}`);
      const data = await response.json();
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
    <div className="min-h-screen flex flex-col" style={{ background: "transparent" }}>
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-display font-bold" style={{ color: "var(--text)" }}>
              Your Job Listings
            </h1>
            <p className="text-xs font-medium mt-0.5 text-muted">
              Manage your posted positions
            </p>
          </div>
          <Link
            href="/company/post"
            className="ui-button flex items-center gap-2 px-4 py-2.5 text-xs font-bold"
          >
            <Plus size={13} />
            Post a Job
          </Link>
        </div>

        {justPosted && (
          <div className="ui-alert ui-alert-success text-xs font-medium">
            Job submitted successfully. It will go live once approved by our team.
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="surface-card h-20 animate-pulse" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="surface-card flex flex-col items-center justify-center py-16 gap-3">
            <Briefcase size={24} style={{ color: "var(--text-soft)" }} />
            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
              No jobs posted yet
            </p>
            <Link
              href="/company/post"
              className="ui-button px-4 py-2.5 text-xs font-bold"
            >
              Post your first job
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div key={job.id} className="surface-card flex items-center gap-4 p-5">
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-display font-bold truncate"
                    style={{ color: "var(--text)" }}
                  >
                    {job.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge
                      label={formatJobType(job.type)}
                      variant={getJobTypeBadge(job.type)}
                    />
                    <Badge label={job.status} variant={getStatusBadge(job.status)} />
                    <span className="text-[11px] font-medium text-muted">
                      {job.location}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => deleteJob(job.id)}
                  className="ui-button-danger p-2.5 shrink-0"
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

export default function CompanyDashboardPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen" style={{ background: "transparent" }} />}
    >
      <CompanyDashboardContent />
    </Suspense>
  );
}
