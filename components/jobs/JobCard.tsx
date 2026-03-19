"use client";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, DollarSign, Building2 } from "lucide-react";
import Badge, { getJobTypeBadge, formatJobType } from "@/components/ui/Badge";
import type { Job } from "@/types";

interface Props {
  job: Job;
}

export default function JobCard({ job }: Props) {
  const company = job.company;
  const postedAt = formatTimeAgo(job.created_at);

  return (
    <Link
      href={`/jobs/${job.id}`}
      className="surface-card group block p-5 transition-all duration-200 hover:-translate-y-1"
      style={{
        background: job.featured
          ? "rgba(59, 130, 246, 0.08)"
          : "var(--panel)",
        border: `1px solid ${
          job.featured
            ? "rgba(77,159,255,0.25)"
            : "var(--panel-border)"
        }`,
        boxShadow: job.featured
          ? "0 24px 50px rgba(37, 99, 235, 0.12)"
          : "var(--panel-shadow)",
      }}
    >
      {job.featured && (
        <div className="flex items-center gap-1 mb-3">
          <span
            className="ui-badge"
            style={{
              background: "rgba(77,159,255,0.1)",
              color: "var(--brand)",
              borderColor: "rgba(37, 99, 235, 0.16)",
            }}
          >
            FEATURED
          </span>
        </div>
      )}

      <div className="flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
          style={{ background: "var(--surface-2)" }}
        >
          {company?.logo ? (
            <Image
              src={company.logo}
              alt={company.name}
              width={48}
              height={48}
              className="object-contain"
              unoptimized
            />
          ) : (
            <Building2 size={20} style={{ color: "var(--text-soft)" }} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p
                className="text-sm font-display font-bold leading-tight truncate"
                style={{ color: "var(--text)" }}
              >
                {job.title}
              </p>
              <p className="text-xs font-medium mt-0.5 text-muted">
                {company?.name ?? "Unknown Company"}
              </p>
            </div>

            <span className="text-[10px] font-medium shrink-0 text-muted">
              {postedAt}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-2.5">
            <Badge
              label={formatJobType(job.type)}
              variant={getJobTypeBadge(job.type)}
            />

            <div
              className="flex items-center gap-1 text-[11px] font-medium text-muted"
            >
              <MapPin size={10} />
              {job.location}
            </div>

            {job.salary && (
              <div
                className="flex items-center gap-1 text-[11px] font-medium text-muted"
              >
                <DollarSign size={10} />
                {job.salary}
              </div>
            )}

            <div
              className="flex items-center gap-1 text-[11px] font-medium text-muted"
            >
              <Clock size={10} />
              {job.category}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function formatTimeAgo(dateStr: string) {
  const now = new Date();
  const postedDate = new Date(dateStr);
  const diff = now.getTime() - postedDate.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}
