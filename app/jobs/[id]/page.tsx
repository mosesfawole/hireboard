import { getJobById } from "@/lib/db";
import { formatJobType, getJobTypeBadge } from "@/lib/job-ui";
import { notFound } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Badge from "@/components/ui/Badge";
import {
  MapPin,
  DollarSign,
  Building2,
  ExternalLink,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJobById(id);

  if (!job || job.status !== "ACTIVE") notFound();

  const company = job.company;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="page-shell flex-1 space-y-6">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors text-muted"
        >
          <ArrowLeft size={12} />
          Back to jobs
        </Link>

        <section className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
          <div className="surface-card-strong hero-panel space-y-6 p-6 md:p-7">
            <div className="flex flex-wrap items-center gap-2">
              <span className="section-kicker">
                <Sparkles size={12} />
                Approved listing
              </span>
              <Badge label={formatJobType(job.type)} variant={getJobTypeBadge(job.type)} />
            </div>

            <div className="flex items-start gap-4">
              <div
                className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl"
                style={{ background: "var(--surface-2)" }}
              >
                {company?.logo ? (
                  <Image
                    src={company.logo}
                    alt={company.name ?? ""}
                    width={64}
                    height={64}
                    className="object-contain"
                    unoptimized
                  />
                ) : (
                  <Building2 size={24} style={{ color: "var(--text-soft)" }} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h1
                  className="font-display text-3xl font-bold tracking-tight md:text-4xl"
                  style={{ color: "var(--text)" }}
                >
                  {job.title}
                </h1>
                <p className="mt-2 text-base font-medium text-muted">{company?.name}</p>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1 text-xs font-medium text-muted">
                    <MapPin size={11} />
                    {job.location}
                  </div>

                  {job.salary && (
                    <div className="flex items-center gap-1 text-xs font-medium text-muted">
                      <DollarSign size={11} />
                      {job.salary}
                    </div>
                  )}

                  <div className="section-kicker">{job.category}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={job.apply_url}
                target="_blank"
                rel="noopener noreferrer"
                className="ui-button flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-bold transition-all"
              >
                Apply for this Position
                <ExternalLink size={14} />
              </Link>
              <p className="text-sm text-muted">
                Redirects to the company application page.
              </p>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="surface-card p-6 space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  Quick Snapshot
                </p>
                <p className="mt-2 text-sm leading-7" style={{ color: "var(--text)" }}>
                  A clean view of the essentials before candidates click through.
                </p>
              </div>

              <div className="space-y-3">
                <div className="metric-card">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                    Team
                  </p>
                  <p className="mt-2 text-sm font-semibold" style={{ color: "var(--text)" }}>
                    {company?.name ?? "Unknown Company"}
                  </p>
                </div>

                <div className="metric-card">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                    Workplace
                  </p>
                  <p className="mt-2 text-sm font-semibold" style={{ color: "var(--text)" }}>
                    {job.location}
                  </p>
                </div>

                {company?.website && (
                  <Link
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ui-button-secondary flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold"
                  >
                    Visit company website
                    <ExternalLink size={13} />
                  </Link>
                )}
              </div>
            </div>
          </aside>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
          <div className="surface-card p-6">
            <h2 className="mb-4 text-sm font-display font-bold" style={{ color: "var(--text)" }}>
              Job Description
            </h2>
            <div
              className="whitespace-pre-wrap text-sm leading-8"
              style={{ color: "var(--text-soft)" }}
            >
              {job.description}
            </div>
          </div>

          {company && (
            <div className="surface-card p-6 space-y-3">
              <h2 className="text-sm font-display font-bold" style={{ color: "var(--text)" }}>
                About {company.name}
              </h2>
              {company.description && (
                <p className="text-sm leading-7" style={{ color: "var(--text-soft)" }}>
                  {company.description}
                </p>
              )}
              <div className="flex flex-wrap gap-4">
                {company.location && (
                  <div
                    className="flex items-center gap-1.5 text-xs font-medium"
                    style={{ color: "var(--text-soft)" }}
                  >
                    <MapPin size={11} />
                    {company.location}
                  </div>
                )}
                {company.website && (
                  <Link
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-semibold"
                    style={{ color: "var(--brand)" }}
                  >
                    <ExternalLink size={11} />
                    {company.website}
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
