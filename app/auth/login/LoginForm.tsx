"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Briefcase, Loader2 } from "lucide-react";
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

      const response = await fetch("/api/auth/session");
      const session = await response.json();
      const role = session?.user?.role;

      if (role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/company/dashboard");
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
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "transparent" }}
    >
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Briefcase size={20} style={{ color: "var(--brand)" }} />
            <span
              className="font-display font-bold text-lg"
              style={{ color: "var(--text)" }}
            >
              Hire<span style={{ color: "var(--brand)" }}>Board</span>
            </span>
          </div>
          <h1
            className="text-xl font-display font-bold"
            style={{ color: "var(--text)" }}
          >
            Welcome back
          </h1>
        </div>

        {justRegistered && (
          <div className="ui-alert ui-alert-success text-xs font-medium text-center">
            Account created successfully. Please sign in.
          </div>
        )}

        <div className="surface-card-strong p-6 space-y-4">
          {error && (
            <div className="ui-alert ui-alert-error text-xs font-medium">
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
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="ui-button w-full flex items-center justify-center gap-2 py-3.5 text-sm font-bold"
            >
              {isLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
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
  );
}
