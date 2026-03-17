"use client";
import { useMemo } from "react";
import { useJobStore } from "@/store/useJobStore";
import JobCard from "./JobCard";
import { SearchX } from "lucide-react";
import type { Job } from "@/types";

interface Props {
  jobs: Job[];
}

export default function JobList({ jobs }: Props) {
  const { filters, isDark } = useJobStore();

  // Apply filters — only recomputes when jobs or filters change
  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      const q = filters.search.toLowerCase();

      // Search matches title, company name or category
      if (
        q &&
        !job.title.toLowerCase().includes(q) &&
        !job.company?.name.toLowerCase().includes(q) &&
        !job.category.toLowerCase().includes(q)
      ) {
        return false;
      }

      if (filters.category && job.category !== filters.category) return false;
      if (filters.type && job.type !== filters.type) return false;

      // Location filter — partial match
      if (
        filters.location &&
        !job.location.toLowerCase().includes(filters.location.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [jobs, filters]);

  if (filtered.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 gap-3 rounded-xl"
        style={{
          background: isDark ? "#0f0f20" : "#ffffff",
          border: `1px solid ${isDark ? "#252540" : "#e0e0f0"}`,
        }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: isDark ? "#1e1e38" : "#f0f0f8" }}
        >
          <SearchX size={20} style={{ color: "#5a5a8a" }} />
        </div>
        <p
          className="text-sm font-semibold"
          style={{ color: isDark ? "#ffffff" : "#1a1a2e" }}
        >
          No jobs found
        </p>
        <p className="text-xs font-mono" style={{ color: "#5a5a8a" }}>
          Try adjusting your filters
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-mono" style={{ color: "#5a5a8a" }}>
        {filtered.length} {filtered.length === 1 ? "job" : "jobs"} found
      </p>
      {filtered.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
