"use client";
import { useState } from "react";
import Image from "next/image";
import { useJobStore } from "@/store/useJobStore";
import Badge, {
  getJobTypeBadge,
  getStatusBadge,
  formatJobType,
} from "@/components/ui/Badge";
import { Check, X, Star, Trash2, Building2 } from "lucide-react";
import type { Job } from "@/types";

interface Props {
  jobs: Job[];
  onRefresh: () => void;
}

export default function JobsTable({ jobs, onRefresh }: Props) {
  const { isDark } = useJobStore();
  const [loading, setLoading] = useState<string | null>(null);

  // Generic function to update a job's status or featured flag
  const updateJob = async (id: string, data: object) => {
    setLoading(id);
    try {
      await fetch(`/api/jobs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      onRefresh(); // tell parent to re-fetch data
    } finally {
      setLoading(null);
    }
  };

  const deleteJob = async (id: string) => {
    if (!confirm("Delete this job permanently?")) return;
    setLoading(id);
    try {
      await fetch(`/api/jobs/${id}`, { method: "DELETE" });
      onRefresh();
    } finally {
      setLoading(null);
    }
  };

  const rowStyle = {
    borderBottom: `1px solid ${isDark ? "#252540" : "#e0e0f0"}`,
  };

  const cellStyle = {
    color: isDark ? "#e0e0f4" : "#1a1a2e",
  };

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: isDark ? "#0f0f20" : "#ffffff",
        border: `1px solid ${isDark ? "#252540" : "#e0e0f0"}`,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: `1px solid ${isDark ? "#252540" : "#e0e0f0"}` }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-1 h-4 rounded-full"
            style={{ background: "#4d9fff" }}
          />
          <h2
            className="text-xs font-display font-bold tracking-widest uppercase"
            style={{ color: isDark ? "#ffffff" : "#1a1a2e" }}
          >
            All Jobs
          </h2>
        </div>
        <span className="text-xs font-mono" style={{ color: "#5a5a8a" }}>
          {jobs.length} total
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs min-w-[700px]">
          <thead>
            <tr
              style={{
                borderBottom: `1px solid ${isDark ? "#252540" : "#e0e0f0"}`,
              }}
            >
              {["Job", "Company", "Type", "Status", "Posted", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 font-mono font-normal"
                    style={{ color: "#5a5a8a" }}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr
                key={job.id}
                className="transition-colors"
                style={rowStyle}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = isDark
                    ? "#161628"
                    : "#f8f8fc";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "transparent";
                }}
              >
                {/* Job title */}
                <td className="px-4 py-3" style={cellStyle}>
                  <div className="max-w-[180px]">
                    <p className="font-semibold truncate">{job.title}</p>
                    <p
                      className="text-[10px] font-mono mt-0.5"
                      style={{ color: "#5a5a8a" }}
                    >
                      {job.category}
                    </p>
                  </div>
                </td>

                {/* Company */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-lg overflow-hidden flex items-center justify-center shrink-0"
                      style={{ background: isDark ? "#1a1a30" : "#f0f0f8" }}
                    >
                      {job.company?.logo ? (
                        <Image
                          src={job.company.logo}
                          alt={job.company.name}
                          width={24}
                          height={24}
                          unoptimized
                        />
                      ) : (
                        <Building2 size={12} style={{ color: "#5a5a8a" }} />
                      )}
                    </div>
                    <span
                      className="font-mono truncate max-w-[100px]"
                      style={{ color: "#5a5a8a" }}
                    >
                      {job.company?.name ?? "—"}
                    </span>
                  </div>
                </td>

                {/* Type */}
                <td className="px-4 py-3">
                  <Badge
                    label={formatJobType(job.type)}
                    variant={getJobTypeBadge(job.type)}
                  />
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <Badge
                    label={job.status}
                    variant={getStatusBadge(job.status)}
                  />
                </td>

                {/* Posted date */}
                <td
                  className="px-4 py-3 font-mono"
                  style={{ color: "#5a5a8a" }}
                >
                  {new Date(job.created_at).toLocaleDateString()}
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {/* Approve */}
                    {job.status === "PENDING" && (
                      <button
                        onClick={() => updateJob(job.id, { status: "ACTIVE" })}
                        disabled={loading === job.id}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{
                          background: "rgba(0,212,170,0.1)",
                          color: "#00d4aa",
                        }}
                        title="Approve"
                      >
                        <Check size={11} />
                      </button>
                    )}

                    {/* Reject */}
                    {job.status === "PENDING" && (
                      <button
                        onClick={() =>
                          updateJob(job.id, { status: "REJECTED" })
                        }
                        disabled={loading === job.id}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{
                          background: "rgba(255,77,109,0.1)",
                          color: "#ff4d6d",
                        }}
                        title="Reject"
                      >
                        <X size={11} />
                      </button>
                    )}

                    {/* Feature toggle */}
                    <button
                      onClick={() =>
                        updateJob(job.id, { featured: !job.featured })
                      }
                      disabled={loading === job.id}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{
                        background: job.featured
                          ? "rgba(240,192,64,0.15)"
                          : isDark
                            ? "#1e1e38"
                            : "#f0f0f8",
                        color: job.featured ? "#f0c040" : "#5a5a8a",
                      }}
                      title={job.featured ? "Unfeature" : "Feature"}
                    >
                      <Star
                        size={11}
                        fill={job.featured ? "currentColor" : "none"}
                      />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => deleteJob(job.id)}
                      disabled={loading === job.id}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{
                        background: "rgba(255,77,109,0.1)",
                        color: "#ff4d6d",
                      }}
                      title="Delete"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
