"use client";
import { Search, X } from "lucide-react";
import { useJobStore } from "@/store/useJobStore";

const CATEGORIES = [
  "Engineering",
  "Design",
  "Marketing",
  "Sales",
  "Finance",
  "HR",
  "Operations",
  "Legal",
  "Other",
];

const JOB_TYPES = [
  { label: "Full Time", value: "FULL_TIME" },
  { label: "Part Time", value: "PART_TIME" },
  { label: "Contract", value: "CONTRACT" },
  { label: "Remote", value: "REMOTE" },
  { label: "Internship", value: "INTERNSHIP" },
];

export default function JobFilters() {
  const { filters, setFilter, clearFilters } = useJobStore();

  const hasActiveFilters =
    filters.search || filters.category || filters.type || filters.location;

  return (
    <div className="space-y-3">
      {/* Search input */}
      <div className="relative">
        <Search
          size={13}
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "var(--text-soft)" }}
        />
        <input
          type="text"
          placeholder="Search jobs, companies..."
          value={filters.search}
          onChange={(e) => setFilter("search", e.target.value)}
          className="ui-input w-full pl-10 pr-10 py-3 text-sm"
        />
        {filters.search && (
          <button
            onClick={() => setFilter("search", "")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap gap-2">
        {/* Category select */}
        <select
          value={filters.category}
          onChange={(e) => setFilter("category", e.target.value)}
          className="ui-input flex-1 min-w-[140px] px-4 py-3 text-sm font-medium outline-none"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Job type select */}
        <select
          value={filters.type}
          onChange={(e) => setFilter("type", e.target.value)}
          className="ui-input flex-1 min-w-[140px] px-4 py-3 text-sm font-medium outline-none"
        >
          <option value="">All Types</option>
          {JOB_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        {/* Location input */}
        <input
          type="text"
          placeholder="Location..."
          value={filters.location}
          onChange={(e) => setFilter("location", e.target.value)}
          className="ui-input flex-1 min-w-[140px] px-4 py-3 text-sm"
        />

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="ui-button-danger flex items-center gap-1.5 px-4 py-3 text-xs font-semibold transition-colors"
          >
            <X size={11} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
