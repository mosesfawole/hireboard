"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Loader2 } from "lucide-react";
import { getErrorMessage } from "@/lib/errors";
import { JOB_CATEGORIES, JOB_TYPE_OPTIONS } from "@/lib/job-ui";
import type { CreateJobInput, JobType } from "@/types";

type JobFormState = Omit<CreateJobInput, "company_id"> & {
  salary: string;
};

export default function JobForm() {
  const router = useRouter();
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
      const payload = {
        ...form,
        salary: form.salary.trim() || undefined,
      };

      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

  const inputClass = "ui-input w-full px-4 py-3 text-sm outline-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="ui-alert ui-alert-error text-sm font-medium" aria-live="polite">
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-xs font-semibold tracking-wide" style={{ color: "var(--text)" }}>
          Job Title *
        </label>
        <input
          type="text"
          placeholder="e.g. Senior Frontend Developer"
          value={form.title}
          onChange={(event) => update("title", event.target.value)}
          className={inputClass}
          autoComplete="organization-title"
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold tracking-wide" style={{ color: "var(--text)" }}>
            Job Type *
          </label>
          <select
            value={form.type}
            onChange={(event) => update("type", event.target.value as JobType)}
            className={inputClass}
            required
          >
            {JOB_TYPE_OPTIONS.map((jobType) => (
              <option key={jobType.value} value={jobType.value}>
                {jobType.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold tracking-wide" style={{ color: "var(--text)" }}>
            Category *
          </label>
          <select
            value={form.category}
            onChange={(event) => update("category", event.target.value)}
            className={inputClass}
            required
          >
            {JOB_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold tracking-wide" style={{ color: "var(--text)" }}>
            Location *
          </label>
          <input
            type="text"
            placeholder="e.g. Lagos, Nigeria or Remote"
            value={form.location}
            onChange={(event) => update("location", event.target.value)}
            className={inputClass}
            autoComplete="address-level2"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold tracking-wide" style={{ color: "var(--text)" }}>
            Salary <span className="text-muted">(optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. $80,000 - $100,000"
            value={form.salary}
            onChange={(event) => update("salary", event.target.value)}
            className={inputClass}
            inputMode="text"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold tracking-wide" style={{ color: "var(--text)" }}>
          Job Description *
        </label>
        <textarea
          placeholder="Describe the role, responsibilities and requirements..."
          value={form.description}
          onChange={(event) => update("description", event.target.value)}
          rows={6}
          className={inputClass}
          style={{ resize: "vertical" }}
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold tracking-wide" style={{ color: "var(--text)" }}>
          Application URL *
        </label>
        <input
          type="url"
          placeholder="https://yourcompany.com/careers/apply"
          value={form.apply_url}
          onChange={(event) => update("apply_url", event.target.value)}
          className={inputClass}
          inputMode="url"
          required
        />
        <p className="text-[11px] font-medium text-muted">
          Where candidates will be redirected to apply
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="ui-button flex w-full items-center justify-center gap-2 py-3.5 text-sm font-bold transition-all"
        style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
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

      <p className="text-center text-[11px] font-medium text-muted">
        Your job will be reviewed by our team before going live
      </p>
    </form>
  );
}
