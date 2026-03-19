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

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-2xl flex items-center justify-center"
            style={{
              background: "rgba(139, 92, 246, 0.12)",
              border: "1px solid rgba(139, 92, 246, 0.18)",
            }}
          >
            <Shield size={15} style={{ color: "#8b5cf6" }} />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold" style={{ color: "var(--text)" }}>
              Admin Dashboard
            </h1>
            <p className="text-xs font-medium text-muted">
              Manage all jobs, companies and users
            </p>
          </div>
        </div>

        <div className="ui-tabs flex gap-1 p-1.5 w-fit">
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
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
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
