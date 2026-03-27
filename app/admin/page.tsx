"use client";
import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import StatsCards from "@/components/admin/StatsCards";
import JobsTable from "@/components/admin/JobsTable";
import CompaniesTable from "@/components/admin/CompaniesTables";
import type { AdminStats, Job, Company } from "@/types";
import { Shield } from "lucide-react";

type Tab = "overview" | "jobs" | "companies";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setStats(data.stats);
      setJobs(data.jobs);
      setCompanies(data.companies);
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
    <div className="min-h-screen flex flex-col" style={{ background: "transparent" }}>
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
                    className="text-3xl font-display font-bold tracking-tight"
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
              onClick={() => setActiveTab(tab.key)}
              className={`ui-tab px-4 py-2.5 text-xs transition-all ${
                activeTab === tab.key ? "ui-tab-active" : "ui-tab-inactive"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="surface-card h-24 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {activeTab === "overview" && stats && (
              <div className="space-y-6">
                <StatsCards stats={stats} />

                {jobs.filter((j) => j.status === "PENDING").length > 0 && (
                  <div className="space-y-3">
                    <h2 className="text-sm font-display font-bold" style={{ color: "var(--text)" }}>
                      Pending Review ({jobs.filter((j) => j.status === "PENDING").length})
                    </h2>
                    <JobsTable
                      jobs={jobs.filter((j) => j.status === "PENDING")}
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
