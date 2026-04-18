"use client";

import { useState } from "react";
import Link from "next/link";
import { getSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Briefcase, Loader2, Sparkles } from "lucide-react";
import { getErrorMessage } from "@/lib/errors";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ email: "", password: "" });

  const justRegistered = searchParams.get("registered") === "true";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        return;
      }

      const session = await getSession();
      const role = session?.user?.role;

      if (role === "ADMIN") {
        router.replace("/admin");
      } else {
        router.replace("/company/dashboard");
      }
    } catch (error) {
      console.error("[LoginForm]", getErrorMessage(error));
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "ui-input w-full px-4 py-3 text-sm outline-none";

  return (
    <div className="min-h-screen px-4 py-8" style={{ background: "transparent" }}>
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="surface-card-strong hero-panel hidden h-full min-h-[560px] p-8 lg:flex lg:flex-col lg:justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Briefcase size={20} style={{ color: "var(--brand)" }} />
              <span className="font-display text-lg font-bold" style={{ color: "var(--text)" }}>
                HireBoard
              </span>
            </div>
            <span className="section-kicker">
              <Sparkles size={12} />
              Employer access
            </span>
            <h1 className="font-display text-4xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
              Welcome back to the sharper side of hiring.
            </h1>
            <p className="max-w-md text-sm leading-7 text-muted">
              Manage listings, track approvals, and keep your recruiting presence polished.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="metric-card">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                Fast workflow
              </p>
              <p className="mt-2 text-sm font-semibold" style={{ color: "var(--text)" }}>
                Post and manage roles in one place
              </p>
            </div>
            <div className="metric-card">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                Clean presentation
              </p>
              <p className="mt-2 text-sm font-semibold" style={{ color: "var(--text)" }}>
                Better looking pages for every company
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
              Welcome back
            </h1>
            <p className="text-sm text-muted">Sign in to manage your hiring pipeline.</p>
          </div>

          {justRegistered && (
            <div className="ui-alert ui-alert-success text-center text-xs font-medium" aria-live="polite">
              Account created successfully. Please sign in.
            </div>
          )}

          <div className="surface-card-strong space-y-4 p-6">
            {error && (
              <div className="ui-alert ui-alert-error text-xs font-medium" aria-live="polite">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  className="text-xs font-semibold tracking-wide"
                  style={{ color: "var(--text)" }}
                >
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      email: event.target.value,
                    }))
                  }
                  className={inputClass}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label
                  className="text-xs font-semibold tracking-wide"
                  style={{ color: "var(--text)" }}
                >
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      password: event.target.value,
                    }))
                  }
                  className={inputClass}
                  autoComplete="current-password"
                  required
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
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-xs font-medium text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" style={{ color: "var(--brand)" }}>
              Register your company
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
