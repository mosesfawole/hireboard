import { getActiveJobs } from "@/lib/db";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import JobList from "@/components/jobs/JobList";
import JobFilters from "@/components/jobs/JobFilters";
import Link from "next/link";
import { ArrowRight, Briefcase, Sparkles, TrendingUp } from "lucide-react";

// This page runs on the server — data is fetched before the page is sent to the browser
// This is called Server Side Rendering (SSR) — faster initial load, better SEO
export default async function JobsPage() {
  const jobs = await getActiveJobs();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="page-shell flex-1 space-y-6">
        <section className="surface-card-strong hero-panel p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.6fr_0.9fr] lg:items-end">
            <div className="space-y-5">
              <span className="section-kicker">
                <Sparkles size={12} />
                Curated job board
              </span>
              <div className="space-y-3">
                <h1
                  className="font-display text-balance text-3xl font-bold tracking-tight md:text-5xl"
                  style={{ color: "var(--text)" }}
                >
                  Find roles that look as premium as the teams behind them.
                </h1>
                <p className="max-w-2xl text-sm leading-7 md:text-base" style={{ color: "var(--text-soft)" }}>
                  Explore approved listings from ambitious companies, with a cleaner
                  browse experience for candidates and better presentation for employers.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link href="/auth/register" className="ui-button px-5 py-3 text-sm font-bold">
                  Post a Job
                  <ArrowRight size={14} />
                </Link>
                <div className="ui-button-secondary px-4 py-3 text-sm font-semibold">
                  <Briefcase size={14} />
                  {jobs.length} live opportunities
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="metric-card">
                <div className="mb-3 flex items-center justify-between">
                  <span className="section-kicker">
                    <TrendingUp size={12} />
                    Momentum
                  </span>
                  <span className="text-xs font-semibold text-muted">Updated daily</span>
                </div>
                <p className="font-display text-4xl font-bold" style={{ color: "var(--text)" }}>
                  {jobs.length}
                </p>
                <p className="mt-2 text-sm text-muted">
                  approved openings across design, engineering, operations, and more.
                </p>
              </div>

              <div className="metric-card">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  Why this feels better
                </p>
                <p className="mt-3 text-sm leading-7" style={{ color: "var(--text)" }}>
                  Featured jobs stand out, filters are faster to scan, and company
                  context is surfaced earlier.
                </p>
              </div>
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
