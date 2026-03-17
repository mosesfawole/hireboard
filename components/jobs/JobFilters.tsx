"use client";
import { Search, X, SlidersHorizontal } from "lucide-react";
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
  const { filters, setFilter, clearFilters, isDark } = useJobStore();

  const hasActiveFilters =
    filters.search || filters.category || filters.type || filters.location;

  const inputStyle = {
    background: isDark ? "#0f0f20" : "#ffffff",
    border: `1px solid ${isDark ? "#252540" : "#e0e0f0"}`,
    color: isDark ? "#ffffff" : "#1a1a2e",
  };

  return (
    <div className="space-y-3">
      {/* Search input */}
      <div className="relative">
        <Search
          size={13}
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "#5a5a8a" }}
        />
        <input
          type="text"
          placeholder="Search jobs, companies..."
          value={filters.search}
          onChange={(e) => setFilter("search", e.target.value)}
          className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none transition-colors"
          style={inputStyle}
        />
        {filters.search && (
          <button
            onClick={() => setFilter("search", "")}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: "#5a5a8a" }}
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
          className="flex-1 min-w-[140px] rounded-xl px-3 py-2 text-xs font-mono outline-none"
          style={inputStyle}
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
          className="flex-1 min-w-[140px] rounded-xl px-3 py-2 text-xs font-mono outline-none"
          style={inputStyle}
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
          className="flex-1 min-w-[140px] rounded-xl px-3 py-2 text-xs font-mono outline-none"
          style={inputStyle}
        />

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono transition-colors"
            style={{
              background: "rgba(255,77,109,0.1)",
              color: "#ff4d6d",
              border: "1px solid rgba(255,77,109,0.2)",
            }}
          >
            <X size={11} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
