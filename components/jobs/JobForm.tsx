"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useJobStore } from "@/store/useJobStore";
import { Send, Loader2 } from "lucide-react";
import { getErrorMessage } from "@/lib/errors";
import type { CreateJobInput, JobType } from "@/types";

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

const JOB_TYPES: { label: string; value: JobType }[] = [
  { label: "Full Time", value: "FULL_TIME" },
  { label: "Part Time", value: "PART_TIME" },
  { label: "Contract", value: "CONTRACT" },
  { label: "Remote", value: "REMOTE" },
  { label: "Internship", value: "INTERNSHIP" },
];

type JobFormState = Omit<CreateJobInput, "company_id"> & {
  salary: string;
};

export default function JobForm() {
  const router = useRouter();
  const { isDark } = useJobStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<JobFormState>({
    title: "",
    description: "",
    location: "",
    salary: "",
    type: "FULL_TIME",
    category: "Engineering",
    apply_url: "",
  });

  const update = <K extends keyof JobFormState>(key: K, value: JobFormState[K]) =>
    setForm((previous) => ({ ...previous, [key]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to post job");

      router.push("/company/dashboard?posted=true");
    } catch (error) {
      setError(getErrorMessage(error, "Failed to post job"));
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-colors font-mono";
  const inputStyle = {
    background: isDark ? "#0f0f20" : "#ffffff",
    border: `1px solid ${isDark ? "#252540" : "#e0e0f0"}`,
    color: isDark ? "#ffffff" : "#1a1a2e",
  };
  const labelStyle = {
    color: isDark ? "#e0e0f4" : "#1a1a2e",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div
          className="px-4 py-3 rounded-xl text-sm font-mono"
          style={{
            background: "rgba(255,77,109,0.1)",
            border: "1px solid rgba(255,77,109,0.2)",
            color: "#ff4d6d",
          }}
        >
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-xs font-mono font-semibold" style={labelStyle}>
          Job Title *
        </label>
        <input
          type="text"
          placeholder="e.g. Senior Frontend Developer"
          value={form.title}
          onChange={(event) => update("title", event.target.value)}
          className={inputClass}
          style={inputStyle}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-semibold" style={labelStyle}>
            Job Type *
          </label>
          <select
            value={form.type}
            onChange={(event) => update("type", event.target.value as JobType)}
            className={inputClass}
            style={inputStyle}
            required
          >
            {JOB_TYPES.map((jobType) => (
              <option key={jobType.value} value={jobType.value}>
                {jobType.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono font-semibold" style={labelStyle}>
            Category *
          </label>
          <select
            value={form.category}
            onChange={(event) => update("category", event.target.value)}
            className={inputClass}
            style={inputStyle}
            required
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-semibold" style={labelStyle}>
            Location *
          </label>
          <input
            type="text"
            placeholder="e.g. Lagos, Nigeria or Remote"
            value={form.location}
            onChange={(event) => update("location", event.target.value)}
            className={inputClass}
            style={inputStyle}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono font-semibold" style={labelStyle}>
            Salary <span style={{ color: "#5a5a8a" }}>(optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. $80,000 - $100,000"
            value={form.salary}
            onChange={(event) => update("salary", event.target.value)}
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-mono font-semibold" style={labelStyle}>
          Job Description *
        </label>
        <textarea
          placeholder="Describe the role, responsibilities and requirements..."
          value={form.description}
          onChange={(event) => update("description", event.target.value)}
          rows={6}
          className={inputClass}
          style={{ ...inputStyle, resize: "vertical" }}
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-mono font-semibold" style={labelStyle}>
          Application URL *
        </label>
        <input
          type="url"
          placeholder="https://yourcompany.com/careers/apply"
          value={form.apply_url}
          onChange={(event) => update("apply_url", event.target.value)}
          className={inputClass}
          style={inputStyle}
          required
        />
        <p className="text-[11px] font-mono" style={{ color: "#5a5a8a" }}>
          Where candidates will be redirected to apply
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all"
        style={{
          background: isLoading ? "#1e1e38" : "#4d9fff",
          color: isLoading ? "#5a5a8a" : "#ffffff",
          cursor: isLoading ? "not-allowed" : "pointer",
        }}
      >
        {isLoading ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Submitting for review...
          </>
        ) : (
          <>
            <Send size={14} />
            Submit Job for Review
          </>
        )}
      </button>

      <p className="text-[11px] font-mono text-center" style={{ color: "#5a5a8a" }}>
        Your job will be reviewed by our team before going live
      </p>
    </form>
  );
}
