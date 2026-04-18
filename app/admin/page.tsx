"use client";

import { useEffect, useState, useCallback } from "react";
import { Shield } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import StatsCards from "@/components/admin/StatsCards";
import JobsTable from "@/components/admin/JobsTable";
import CompaniesTable from "@/components/admin/CompaniesTables";
import type { AdminStats, Job, Company } from "@/types";

type Tab = "overview" | "jobs" | "companies";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/stats");
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Failed to load admin data");
      }

      const data = await response.json();
      setStats(data.stats);
      setJobs(data.jobs);
      setCompanies(data.companies);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load admin data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "jobs", label: `Jobs (${jobs.length})` },
    { key: "companies", label: `Companies (${companies.length})` },
  ];

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "transparent" }}>
      <Navbar />

      <main className="page-shell flex-1 space-y-6">
        <section className="surface-card-strong hero-panel p-6 md:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <span className="section-kicker">
                <Shield size={12} />
                Admin control room
              </span>
              <div className="flex items-start gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{
                    background: "rgba(139, 92, 246, 0.12)",
                    border: "1px solid rgba(139, 92, 246, 0.18)",
                  }}
                >
                  <Shield size={18} style={{ color: "#b37bff" }} />
                </div>
                <div>
                  <h1
                    className="font-display text-3xl font-bold tracking-tight"
                    style={{ color: "var(--text)" }}
                  >
                    Admin Dashboard
                  </h1>
                  <p className="mt-2 text-sm leading-7 text-muted">
                    Review listings, manage companies, and keep the marketplace high quality.
                  </p>
                </div>
              </div>
            </div>

            <div className="metric-card min-w-[220px]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                Workspace status
              </p>
              <p className="mt-2 text-sm font-semibold" style={{ color: "var(--text)" }}>
                {isLoading ? "Refreshing metrics..." : "All management tools available"}
              </p>
            </div>
          </div>
        </section>

        <div className="ui-tabs flex w-fit gap-1 p-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`ui-tab px-4 py-2.5 text-xs transition-all ${
                activeTab === tab.key ? "ui-tab-active" : "ui-tab-inactive"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="ui-alert ui-alert-error text-xs font-medium" aria-live="polite">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="surface-card h-24 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {activeTab === "overview" && stats && (
              <div className="space-y-6">
                <StatsCards stats={stats} />

                {jobs.filter((job) => job.status === "PENDING").length > 0 && (
                  <div className="space-y-3">
                    <h2 className="text-sm font-display font-bold" style={{ color: "var(--text)" }}>
                      Pending Review ({jobs.filter((job) => job.status === "PENDING").length})
                    </h2>
                    <JobsTable
                      jobs={jobs.filter((job) => job.status === "PENDING")}
                      onRefresh={fetchData}
                    />
                  </div>
                )}
              </div>
            )}

            {activeTab === "jobs" && <JobsTable jobs={jobs} onRefresh={fetchData} />}

            {activeTab === "companies" && (
              <CompaniesTable companies={companies} onRefresh={fetchData} />
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
