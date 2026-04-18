"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Briefcase, Loader2, Sparkles } from "lucide-react";
import { getErrorMessage } from "@/lib/errors";

type RegisterForm = {
  email: string;
  password: string;
  companyName: string;
  website: string;
  location: string;
  description: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<RegisterForm>({
    email: "",
    password: "",
    companyName: "",
    website: "",
    location: "",
    description: "",
  });

  const update = <K extends keyof RegisterForm>(key: K, value: RegisterForm[K]) =>
    setForm((previous) => ({ ...previous, [key]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Registration failed");

      router.push("/auth/login?registered=true");
    } catch (error) {
      setError(getErrorMessage(error, "Registration failed"));
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "ui-input w-full px-4 py-3 text-sm outline-none";
  const labelStyle = { color: "var(--text)" };

  return (
    <div className="min-h-screen px-4 py-8" style={{ background: "transparent" }}>
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="surface-card-strong hero-panel hidden h-full min-h-[620px] p-8 lg:flex lg:flex-col lg:justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Briefcase size={20} style={{ color: "var(--brand)" }} />
              <span className="font-display text-lg font-bold" style={{ color: "var(--text)" }}>
                HireBoard
              </span>
            </div>
            <span className="section-kicker">
              <Sparkles size={12} />
              Company onboarding
            </span>
            <h1 className="font-display text-4xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
              Create a company profile that feels more premium from day one.
            </h1>
            <p className="max-w-md text-sm leading-7 text-muted">
              Register once, then publish openings, manage approvals, and bring your
              brand into every listing.
            </p>
          </div>

          <div className="grid gap-3">
            <div className="metric-card">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                Fast setup
              </p>
              <p className="mt-2 text-sm font-semibold" style={{ color: "var(--text)" }}>
                Create your company account and start posting in minutes.
              </p>
            </div>
            <div className="metric-card">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                Better brand presence
              </p>
              <p className="mt-2 text-sm font-semibold" style={{ color: "var(--text)" }}>
                Richer presentation across the public jobs experience.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md justify-self-center space-y-6">
          <div className="space-y-2 text-center lg:text-left">
            <div className="flex items-center justify-center gap-2 lg:justify-start">
              <Briefcase size={20} style={{ color: "var(--brand)" }} />
              <span className="font-display text-lg font-bold" style={{ color: "var(--text)" }}>
                Hire<span style={{ color: "var(--brand)" }}>Board</span>
              </span>
            </div>
            <h1 className="text-3xl font-display font-bold tracking-tight" style={{ color: "var(--text)" }}>
              Create your company account
            </h1>
            <p className="text-sm font-medium text-muted">Start posting jobs in minutes</p>
          </div>

          <div className="surface-card-strong space-y-4 p-6">
            {error && (
              <div className="ui-alert ui-alert-error text-xs font-medium" aria-live="polite">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold tracking-wide" style={labelStyle}>
                  Company Name *
                </label>
                <input
                  type="text"
                  placeholder="Acme Inc."
                  value={form.companyName}
                  onChange={(event) => update("companyName", event.target.value)}
                  className={inputClass}
                  autoComplete="organization"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold tracking-wide" style={labelStyle}>
                  Work Email *
                </label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={(event) => update("email", event.target.value)}
                  className={inputClass}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold tracking-wide" style={labelStyle}>
                  Password *
                </label>
                <input
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={form.password}
                  onChange={(event) => update("password", event.target.value)}
                  className={inputClass}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-wide" style={labelStyle}>
                    Website
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={form.website}
                    onChange={(event) => update("website", event.target.value)}
                    className={inputClass}
                    autoComplete="url"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-wide" style={labelStyle}>
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Lagos, Nigeria"
                    value={form.location}
                    onChange={(event) => update("location", event.target.value)}
                    className={inputClass}
                    autoComplete="address-level2"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold tracking-wide" style={labelStyle}>
                  Company Description
                </label>
                <textarea
                  placeholder="Tell candidates about your company..."
                  value={form.description}
                  onChange={(event) => update("description", event.target.value)}
                  rows={3}
                  className={inputClass}
                  style={{ resize: "vertical" }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="ui-button flex w-full items-center justify-center gap-2 py-3.5 text-sm font-bold"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    {" "}Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-xs font-medium text-muted">
            Already have an account?{" "}
            <Link href="/auth/login" style={{ color: "var(--brand)" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
