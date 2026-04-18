"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, X, Star, Trash2, Building2 } from "lucide-react";
import Badge, {
  getJobTypeBadge,
  getStatusBadge,
  formatJobType,
} from "@/components/ui/Badge";
import type { Job } from "@/types";

interface Props {
  jobs: Job[];
  onRefresh: () => void;
}

export default function JobsTable({ jobs, onRefresh }: Props) {
  const [loading, setLoading] = useState<string | null>(null);

  const updateJob = async (id: string, data: object) => {
    setLoading(id);
    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update job");
      }

      onRefresh();
    } finally {
      setLoading(null);
    }
  };

  const deleteJob = async (id: string) => {
    if (!confirm("Delete this job permanently?")) return;
    setLoading(id);

    try {
      const response = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to delete job");
      }

      onRefresh();
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="surface-card overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid var(--panel-border)" }}
      >
        <div className="flex items-center gap-2">
          <div className="h-4 w-1 rounded-full" style={{ background: "var(--brand)" }} />
          <h2
            className="font-display text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--text)" }}
          >
            All Jobs
          </h2>
        </div>
        <span className="text-xs font-medium text-muted">{jobs.length} total</span>
      </div>

      <div className="overflow-x-auto">
        <table className="data-table min-w-[700px] w-full text-xs">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--panel-border)" }}>
              {["Job", "Company", "Type", "Status", "Posted", "Actions"].map((heading) => (
                <th key={heading} className="px-4 py-3 text-left font-medium text-muted">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} style={{ borderBottom: "1px solid var(--panel-border)" }}>
                <td className="px-4 py-3" style={{ color: "var(--text)" }}>
                  <div className="max-w-[180px]">
                    <p className="truncate font-semibold">{job.title}</p>
                    <p className="mt-0.5 text-[10px] font-medium text-muted">
                      {job.category}
                    </p>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-lg"
                      style={{ background: "var(--surface-2)" }}
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
                        <Building2 size={12} style={{ color: "var(--text-soft)" }} />
                      )}
                    </div>
                    <span className="max-w-[100px] truncate font-medium text-muted">
                      {job.company?.name ?? "-"}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <Badge
                    label={formatJobType(job.type)}
                    variant={getJobTypeBadge(job.type)}
                  />
                </td>

                <td className="px-4 py-3">
                  <Badge label={job.status} variant={getStatusBadge(job.status)} />
                </td>

                <td className="px-4 py-3 font-medium text-muted">
                  {new Date(job.created_at).toLocaleDateString()}
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {job.status === "PENDING" && (
                      <button
                        type="button"
                        onClick={() => updateJob(job.id, { status: "ACTIVE" })}
                        disabled={loading === job.id}
                        className="ui-button-secondary p-1.5 transition-colors"
                        style={{
                          background: "var(--success-soft)",
                          color: "var(--success)",
                        }}
                        title="Approve"
                        aria-label={`Approve ${job.title}`}
                      >
                        <Check size={11} />
                      </button>
                    )}

                    {job.status === "PENDING" && (
                      <button
                        type="button"
                        onClick={() => updateJob(job.id, { status: "REJECTED" })}
                        disabled={loading === job.id}
                        className="ui-button-danger p-1.5 transition-colors"
                        title="Reject"
                        aria-label={`Reject ${job.title}`}
                      >
                        <X size={11} />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => updateJob(job.id, { featured: !job.featured })}
                      disabled={loading === job.id}
                      className="ui-button-secondary p-1.5 transition-colors"
                      style={{
                        background: job.featured
                          ? "var(--warning-soft)"
                          : "var(--surface-2)",
                        color: job.featured ? "var(--warning)" : "var(--text-soft)",
                      }}
                      title={job.featured ? "Unfeature" : "Feature"}
                      aria-label={`${job.featured ? "Unfeature" : "Feature"} ${job.title}`}
                    >
                      <Star size={11} fill={job.featured ? "currentColor" : "none"} />
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteJob(job.id)}
                      disabled={loading === job.id}
                      className="ui-button-danger p-1.5 transition-colors"
                      title="Delete"
                      aria-label={`Delete ${job.title}`}
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
