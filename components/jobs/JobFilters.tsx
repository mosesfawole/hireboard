"use client";

import { MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import { useJobStore } from "@/store/useJobStore";
import { JOB_CATEGORIES, JOB_TYPE_OPTIONS } from "@/lib/job-ui";

export default function JobFilters() {
  const { filters, setFilter, clearFilters } = useJobStore();

  const hasActiveFilters =
    filters.search || filters.category || filters.type || filters.location;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Refine results
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--text)" }}>
            Search by role, category, type, or location.
          </p>
        </div>
        <div className="section-kicker">
          <SlidersHorizontal size={12} />
          Smart filters
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
        <div className="relative lg:col-span-1">
          <Search
            size={14}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: "var(--text-soft)" }}
          />
          <input
            type="text"
            placeholder="Search jobs, companies..."
            value={filters.search}
            onChange={(event) => setFilter("search", event.target.value)}
            className="ui-input w-full py-3 pl-11 pr-10 text-sm"
            aria-label="Search jobs"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => setFilter("search", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <select
          value={filters.category}
          onChange={(event) => setFilter("category", event.target.value)}
          className="ui-input min-w-[140px] px-4 py-3 text-sm font-medium outline-none"
        >
          <option value="">All Categories</option>
          {JOB_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={filters.type}
          onChange={(event) => setFilter("type", event.target.value)}
          className="ui-input min-w-[140px] px-4 py-3 text-sm font-medium outline-none"
        >
          <option value="">All Types</option>
          {JOB_TYPE_OPTIONS.map((jobType) => (
            <option key={jobType.value} value={jobType.value}>
              {jobType.label}
            </option>
          ))}
        </select>

        <div className="relative">
          <MapPin
            size={14}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: "var(--text-soft)" }}
          />
          <input
            type="text"
            placeholder="Location..."
            value={filters.location}
            onChange={(event) => setFilter("location", event.target.value)}
            className="ui-input min-w-[140px] py-3 pl-11 pr-4 text-sm"
            aria-label="Filter by location"
          />
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="ui-button-danger flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-semibold transition-colors"
          >
            <X size={11} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
