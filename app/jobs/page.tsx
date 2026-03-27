import { getActiveJobs } from "@/lib/db";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import JobList from "@/components/jobs/JobList";
import JobFilters from "@/components/jobs/JobFilters";
import Link from "next/link";
import { ArrowRight, Briefcase, Sparkles } from "lucide-react";

export default async function JobsPage() {
  const jobs = await getActiveJobs();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="page-shell flex-1 space-y-6">
        <section className="surface-card-strong p-6 md:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <span className="section-kicker">
                <Sparkles size={12} />
                Job results
              </span>
              <div>
                <h1
                  className="font-display text-3xl font-bold tracking-tight md:text-4xl"
                  style={{ color: "var(--text)" }}
                >
                  Browse open roles
                </h1>
                <p
                  className="mt-2 max-w-2xl text-sm leading-7"
                  style={{ color: "var(--text-soft)" }}
                >
                  Search approved listings, compare teams quickly, and jump straight into
                  the roles that fit.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="metric-card min-w-[180px]">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  Open roles
                </p>
                <p
                  className="mt-2 font-display text-3xl font-bold"
                  style={{ color: "var(--text)" }}
                >
                  {jobs.length}
                </p>
              </div>
              <Link href="/auth/register" className="ui-button px-5 py-3 text-sm font-bold">
                <Briefcase size={14} />
                Post a Job
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        <section className="surface-card p-4 md:p-5">
          <JobFilters />
        </section>

        <JobList jobs={jobs} />
      </main>

      <Footer />
    </div>
  );
}
