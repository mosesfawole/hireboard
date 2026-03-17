"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useJobStore } from "@/store/useJobStore";
import { Briefcase, Loader2 } from "lucide-react";
import { getErrorMessage } from "@/lib/errors";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isDark } = useJobStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ email: "", password: "" });

  const justRegistered = searchParams.get("registered") === "true";

  const handleSubmit = async (event: React.FormEvent) => {
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
      console.error("[LoginPage]", getErrorMessage(error));
      setError("Something went wrong. Please try again.");
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

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: isDark ? "#08080f" : "#f4f4f8" }}
    >
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Briefcase size={20} style={{ color: "#4d9fff" }} />
            <span
              className="font-display font-bold text-lg"
              style={{ color: isDark ? "#ffffff" : "#1a1a2e" }}
            >
              Hire<span style={{ color: "#4d9fff" }}>Board</span>
            </span>
          </div>
          <h1
            className="text-xl font-display font-bold"
            style={{ color: isDark ? "#ffffff" : "#1a1a2e" }}
          >
            Welcome back
          </h1>
        </div>

        {justRegistered && (
          <div
            className="px-4 py-3 rounded-xl text-xs font-mono text-center"
            style={{
              background: "rgba(0,212,170,0.1)",
              border: "1px solid rgba(0,212,170,0.2)",
              color: "#00d4aa",
            }}
          >
            Account created successfully - please sign in
          </div>
        )}

        <div
          className="rounded-xl p-6 space-y-4"
          style={{
            background: isDark ? "#0f0f20" : "#ffffff",
            border: `1px solid ${isDark ? "#252540" : "#e0e0f0"}`,
          }}
        >
          {error && (
            <div
              className="px-4 py-3 rounded-xl text-xs font-mono"
              style={{
                background: "rgba(255,77,109,0.1)",
                border: "1px solid rgba(255,77,109,0.2)",
                color: "#ff4d6d",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                className="text-xs font-mono font-semibold"
                style={{ color: isDark ? "#e0e0f4" : "#1a1a2e" }}
              >
                Email
              </label>
              <input
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, email: event.target.value }))
                }
                className={inputClass}
                style={inputStyle}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label
                className="text-xs font-mono font-semibold"
                style={{ color: isDark ? "#e0e0f4" : "#1a1a2e" }}
              >
                Password
              </label>
              <input
                type="password"
                placeholder="password"
                value={form.password}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, password: event.target.value }))
                }
                className={inputClass}
                style={inputStyle}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold"
              style={{
                background: isLoading ? "#1e1e38" : "#4d9fff",
                color: isLoading ? "#5a5a8a" : "#ffffff",
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs font-mono" style={{ color: "#5a5a8a" }}>
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" style={{ color: "#4d9fff" }}>
            Register your company
          </Link>
        </p>
      </div>
    </div>
  );
}
