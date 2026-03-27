"use client";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  MapPin,
  Clock3,
  DollarSign,
  Building2,
} from "lucide-react";
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
      className="surface-card group block p-5 transition-all duration-200 hover:-translate-y-1 mx-4"
      style={{
        background: job.featured
          ? "linear-gradient(135deg, var(--brand-soft), rgba(24, 74, 69, 0.06))"
          : "var(--panel)",
        border: `1px solid ${
          job.featured ? "rgba(217, 108, 63, 0.22)" : "var(--panel-border)"
        }`,
        boxShadow: job.featured
          ? "0 24px 50px rgba(185, 74, 34, 0.12)"
          : "var(--panel-shadow)",
      }}
    >
      {job.featured && (
        <div className="mb-4 flex items-center gap-1">
          <span
            className="ui-badge"
            style={{
              background: "var(--brand-soft)",
              color: "var(--brand)",
              borderColor: "rgba(185, 74, 34, 0.16)",
            }}
          >
            FEATURED
          </span>
        </div>
      )}

      <div className="flex items-start gap-4">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl"
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
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p
                className="font-display truncate text-base font-bold leading-tight"
                style={{ color: "var(--text)" }}
              >
                {job.title}
              </p>
              <p className="mt-1 text-sm font-medium text-muted">
                {company?.name ?? "Unknown Company"}
              </p>
            </div>

            <div
              className="hidden items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold text-muted md:flex"
              style={{ background: "var(--bg-soft)" }}
            >
              <Clock3 size={11} />
              {postedAt}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2.5">
            <Badge
              label={formatJobType(job.type)}
              variant={getJobTypeBadge(job.type)}
            />

            <div className="flex items-center gap-1 text-[11px] font-medium text-muted">
              <MapPin size={10} />
              {job.location}
            </div>

            {job.salary && (
              <div className="flex items-center gap-1 text-[11px] font-medium text-muted">
                <DollarSign size={10} />
                {job.salary}
              </div>
            )}

            <div className="flex items-center gap-1 text-[11px] font-medium text-muted">
              <Clock3 size={10} />
              {job.category}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-medium text-muted md:hidden">
              {postedAt}
            </span>
            <span
              className="inline-flex items-center gap-1 text-xs font-semibold"
              style={{ color: "var(--brand)" }}
            >
              View role
              <ArrowUpRight size={12} />
            </span>
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
