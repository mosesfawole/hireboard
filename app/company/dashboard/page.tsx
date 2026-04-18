"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Briefcase, Plus, Sparkles, Trash2 } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Badge, {
  formatJobType,
  getJobTypeBadge,
  getStatusBadge,
} from "@/components/ui/Badge";
import type { Job } from "@/types";

function CompanyDashboardContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const justPosted = searchParams.get("posted") === "true";
  const companyId = session?.user?.companyId;

  const fetchJobs = useCallback(async () => {
    if (!companyId) {
      setJobs([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/jobs?companyId=${companyId}`);
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Failed to load jobs");
      }

      const data = await response.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load jobs");
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const deleteJob = async (id: string) => {
    if (!confirm("Delete this job?")) return;

    try {
      const response = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Failed to delete job");
      }

      await fetchJobs();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to delete job");
    }
  };

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "transparent" }}>
      <Navbar />

      <main className="page-shell flex-1 space-y-6">
        <section className="surface-card-strong hero-panel p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <span className="section-kicker">
                <Sparkles size={12} />
                Company dashboard
              </span>
              <div>
                <h1
                  className="font-display text-3xl font-bold tracking-tight"
                  style={{ color: "var(--text)" }}
                >
                  Your job listings
                </h1>
                <p className="mt-2 text-sm leading-7 text-muted">
                  Track active, pending, and rejected roles from one polished workspace.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="metric-card min-w-[180px]">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  Total roles
                </p>
                <p
                  className="mt-2 font-display text-3xl font-bold"
                  style={{ color: "var(--text)" }}
                >
                  {jobs.length}
                </p>
              </div>
              <Link
                href="/company/post"
                className="ui-button flex items-center gap-2 px-4 py-3 text-xs font-bold"
              >
                <Plus size={13} />
                Post a Job
              </Link>
            </div>
          </div>
        </section>

        {justPosted && (
          <div className="ui-alert ui-alert-success text-xs font-medium">
            Job submitted successfully. It will go live once approved by our team.
          </div>
        )}

        {error && (
          <div className="ui-alert ui-alert-error text-xs font-medium" aria-live="polite">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="surface-card h-20 animate-pulse" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="surface-card flex flex-col items-center justify-center gap-3 py-16">
            <Briefcase size={24} style={{ color: "var(--text-soft)" }} />
            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
              No jobs posted yet
            </p>
            <Link href="/company/post" className="ui-button px-4 py-2.5 text-xs font-bold">
              Post your first job
            </Link>
          </div>
        ) : (
          <div className="grid gap-3">
            {jobs.map((job) => (
              <div key={job.id} className="surface-card flex items-center gap-4 p-5">
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate font-display text-base font-bold"
                    style={{ color: "var(--text)" }}
                  >
                    {job.title}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge
                      label={formatJobType(job.type)}
                      variant={getJobTypeBadge(job.type)}
                    />
                    <Badge label={job.status} variant={getStatusBadge(job.status)} />
                    <span className="text-[11px] font-medium text-muted">{job.location}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => deleteJob(job.id)}
                  className="ui-button-danger shrink-0 p-2.5"
                  aria-label={`Delete ${job.title}`}
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
