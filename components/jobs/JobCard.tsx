"use client";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, DollarSign, Building2 } from "lucide-react";
import { useJobStore } from "@/store/useJobStore";
import Badge, { getJobTypeBadge, formatJobType } from "@/components/ui/Badge";
import type { Job } from "@/types";

interface Props {
  job: Job;
}

export default function JobCard({ job }: Props) {
  const { isDark } = useJobStore();
  const company = job.company;
  const postedAt = formatTimeAgo(job.created_at);

  return (
    <Link
      href={`/jobs/${job.id}`}
      className="group block rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: job.featured
          ? isDark
            ? "rgba(77,159,255,0.05)"
            : "rgba(77,159,255,0.03)"
          : isDark
            ? "#0f0f20"
            : "#ffffff",
        border: `1px solid ${
          job.featured
            ? "rgba(77,159,255,0.25)"
            : isDark
              ? "#252540"
              : "#e0e0f0"
        }`,
        boxShadow: job.featured ? "0 0 20px rgba(77,159,255,0.06)" : "none",
      }}
    >
      {job.featured && (
        <div className="flex items-center gap-1 mb-3">
          <span
            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(77,159,255,0.1)",
              color: "#4d9fff",
            }}
          >
            FEATURED
          </span>
        </div>
      )}

      <div className="flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
          style={{ background: isDark ? "#1a1a30" : "#f0f0f8" }}
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
            <Building2 size={20} style={{ color: "#5a5a8a" }} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p
                className="text-sm font-display font-bold leading-tight truncate"
                style={{ color: isDark ? "#ffffff" : "#1a1a2e" }}
              >
                {job.title}
              </p>
              <p className="text-xs font-mono mt-0.5" style={{ color: "#5a5a8a" }}>
                {company?.name ?? "Unknown Company"}
              </p>
            </div>

            <span
              className="text-[10px] font-mono shrink-0"
              style={{ color: "#5a5a8a" }}
            >
              {postedAt}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-2.5">
            <Badge
              label={formatJobType(job.type)}
              variant={getJobTypeBadge(job.type)}
            />

            <div
              className="flex items-center gap-1 text-[11px] font-mono"
              style={{ color: "#5a5a8a" }}
            >
              <MapPin size={10} />
              {job.location}
            </div>

            {job.salary && (
              <div
                className="flex items-center gap-1 text-[11px] font-mono"
                style={{ color: "#5a5a8a" }}
              >
                <DollarSign size={10} />
                {job.salary}
              </div>
            )}

            <div
              className="flex items-center gap-1 text-[11px] font-mono"
              style={{ color: "#5a5a8a" }}
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
