"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useJobStore } from "@/store/useJobStore";
import { Briefcase, Loader2 } from "lucide-react";
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
  const { isDark } = useJobStore();
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

  const inputClass =
    "w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-colors font-mono";
  const inputStyle = {
    background: isDark ? "#0f0f20" : "#ffffff",
    border: `1px solid ${isDark ? "#252540" : "#e0e0f0"}`,
    color: isDark ? "#ffffff" : "#1a1a2e",
  };
  const labelStyle = { color: isDark ? "#e0e0f4" : "#1a1a2e" };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: isDark ? "#08080f" : "#f4f4f8" }}
    >
      <div className="w-full max-w-md space-y-6">
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
            Create your company account
          </h1>
          <p className="text-xs font-mono" style={{ color: "#5a5a8a" }}>
            Start posting jobs in minutes
          </p>
        </div>

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
              <label className="text-xs font-mono font-semibold" style={labelStyle}>
                Company Name *
              </label>
              <input
                type="text"
                placeholder="Acme Inc."
                value={form.companyName}
                onChange={(event) => update("companyName", event.target.value)}
                className={inputClass}
                style={inputStyle}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold" style={labelStyle}>
                Work Email *
              </label>
              <input
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
                className={inputClass}
                style={inputStyle}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold" style={labelStyle}>
                Password *
              </label>
              <input
                type="password"
                placeholder="Minimum 8 characters"
                value={form.password}
                onChange={(event) => update("password", event.target.value)}
                className={inputClass}
                style={inputStyle}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold" style={labelStyle}>
                  Website
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={form.website}
                  onChange={(event) => update("website", event.target.value)}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold" style={labelStyle}>
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Lagos, Nigeria"
                  value={form.location}
                  onChange={(event) => update("location", event.target.value)}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold" style={labelStyle}>
                Company Description
              </label>
              <textarea
                placeholder="Tell candidates about your company..."
                value={form.description}
                onChange={(event) => update("description", event.target.value)}
                rows={3}
                className={inputClass}
                style={{ ...inputStyle, resize: "vertical" }}
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
                  <Loader2 size={14} className="animate-spin" /> Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs font-mono" style={{ color: "#5a5a8a" }}>
          Already have an account?{" "}
          <Link href="/auth/login" style={{ color: "#4d9fff" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
