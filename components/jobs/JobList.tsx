"use client";

import { useDeferredValue, useMemo } from "react";
import { SearchX } from "lucide-react";
import { useJobStore } from "@/store/useJobStore";
import JobCard from "./JobCard";
import type { Job } from "@/types";

interface Props {
  jobs: Job[];
}

export default function JobList({ jobs }: Props) {
  const { filters } = useJobStore();
  const deferredFilters = useDeferredValue(filters);

  const filtered = useMemo(() => {
    const searchQuery = deferredFilters.search.trim().toLowerCase();
    const locationQuery = deferredFilters.location.trim().toLowerCase();

    return jobs.filter((job) => {
      const companyName = job.company?.name?.toLowerCase() ?? "";

      if (
        searchQuery &&
        !job.title.toLowerCase().includes(searchQuery) &&
        !companyName.includes(searchQuery) &&
        !job.category.toLowerCase().includes(searchQuery)
      ) {
        return false;
      }

      if (deferredFilters.category && job.category !== deferredFilters.category) {
        return false;
      }

      if (deferredFilters.type && job.type !== deferredFilters.type) {
        return false;
      }

      if (locationQuery && !job.location.toLowerCase().includes(locationQuery)) {
        return false;
      }

      return true;
    });
  }, [deferredFilters, jobs]);

  if (filtered.length === 0) {
    return (
      <div className="surface-card flex flex-col items-center justify-center gap-3 px-10 py-16">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full"
          style={{ background: "var(--surface-2)" }}
        >
          <SearchX size={20} style={{ color: "var(--text-soft)" }} />
        </div>
        <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
          No jobs found
        </p>
        <p className="text-xs font-medium text-muted">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Results
          </p>
          <p className="mt-1 text-sm font-medium" style={{ color: "var(--text)" }}>
            {filtered.length} {filtered.length === 1 ? "job" : "jobs"} matched your
            filters
          </p>
        </div>
        <div className="section-kicker">Best match first</div>
      </div>

      {filtered.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
