import { getJobById } from "@/lib/db";
import { notFound } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import {
  MapPin,
  DollarSign,
  Building2,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// These are plain functions — no "use client" needed
function formatType(type: string): string {
  const map: Record<string, string> = {
    FULL_TIME: "Full Time",
    PART_TIME: "Part Time",
    CONTRACT: "Contract",
    REMOTE: "Remote",
    INTERNSHIP: "Internship",
  };
  return map[type] ?? type;
}

function getTypeBadgeColor(type: string): string {
  const map: Record<string, string> = {
    FULL_TIME: "#00d4aa",
    PART_TIME: "#4d9fff",
    CONTRACT: "#a78bfa",
    REMOTE: "#f0c040",
    INTERNSHIP: "#94a3b8",
  };
  return map[type] ?? "#94a3b8";
}

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

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 space-y-6">
        {/* Back button */}
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors text-muted"
        >
          <ArrowLeft size={12} />
          Back to jobs
        </Link>

        {/* Job header card */}
        <div className="surface-card-strong p-6 space-y-4">
          <div className="flex items-start gap-4">
            {/* Company logo */}
            <div
              className="w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center shrink-0"
              style={{ background: "#1a1a30" }}
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

            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-display font-bold" style={{ color: "var(--text)" }}>
                {job.title}
              </h1>
              <p className="text-sm font-medium mt-1 text-muted">
                {company?.name}
              </p>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-3 mt-3">
                {/* Job type badge */}
                <span
                  className="ui-badge"
                  style={{
                    background: `${getTypeBadgeColor(job.type)}18`,
                    color: getTypeBadgeColor(job.type),
                    borderColor: `${getTypeBadgeColor(job.type)}26`,
                  }}
                >
                  {formatType(job.type)}
                </span>

                <div
                  className="flex items-center gap-1 text-xs font-medium text-muted"
                >
                  <MapPin size={11} />
                  {job.location}
                </div>

                {job.salary && (
                  <div
                    className="flex items-center gap-1 text-xs font-medium text-muted"
                  >
                    <DollarSign size={11} />
                    {job.salary}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Apply button */}
          <Link
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="ui-button flex items-center justify-center gap-2 w-full py-3.5 text-sm font-bold transition-all"
          >
            Apply for this Position
            <ExternalLink size={14} />
          </Link>
        </div>

        {/* Job description */}
        <div className="surface-card p-6">
          <h2 className="text-sm font-display font-bold mb-4" style={{ color: "var(--text)" }}>
            Job Description
          </h2>
          <div
            className="text-sm leading-relaxed whitespace-pre-wrap"
            style={{ color: "var(--text-soft)" }}
          >
            {job.description}
          </div>
        </div>

        {/* Company info */}
        {company && (
          <div className="surface-card p-6 space-y-3">
            <h2 className="text-sm font-display font-bold" style={{ color: "var(--text)" }}>
              About {company.name}
            </h2>
            {company.description && (
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-soft)" }}
              >
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
      </main>

      <Footer />
    </div>
  );
}
