"use client";
import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import StatsCards from "@/components/admin/StatsCards";
import JobsTable from "@/components/admin/JobsTable";
import CompaniesTable from "@/components/admin/CompaniesTables";
import { useJobStore } from "@/store/useJobStore";
import type { AdminStats, Job, Company } from "@/types";
import { Shield } from "lucide-react";

type Tab = "overview" | "jobs" | "companies";

export default function AdminPage() {
  const { isDark } = useJobStore();
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
    <div
      className="min-h-screen flex flex-col"
      style={{ background: isDark ? "#08080f" : "#f4f4f8" }}
    >
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: "rgba(167,139,250,0.1)",
              border: "1px solid rgba(167,139,250,0.25)",
            }}
          >
            <Shield size={14} style={{ color: "#a78bfa" }} />
          </div>
          <div>
            <h1
              className="text-xl font-display font-bold"
              style={{ color: isDark ? "#ffffff" : "#1a1a2e" }}
            >
              Admin Dashboard
            </h1>
            <p className="text-xs font-mono" style={{ color: "#5a5a8a" }}>
              Manage all jobs, companies and users
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 p-1 rounded-xl w-fit"
          style={{ background: isDark ? "#0f0f20" : "#ffffff" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all"
              style={{
                background:
                  activeTab === tab.key
                    ? isDark
                      ? "#1e1e38"
                      : "#f0f0f8"
                    : "transparent",
                color:
                  activeTab === tab.key
                    ? isDark
                      ? "#ffffff"
                      : "#1a1a2e"
                    : "#5a5a8a",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-xl animate-pulse"
                style={{ background: isDark ? "#0f0f20" : "#ffffff" }}
              />
            ))}
          </div>
        ) : (
          <>
            {/* Overview tab */}
            {activeTab === "overview" && stats && (
              <div className="space-y-6">
                <StatsCards stats={stats} />

                {/* Pending jobs section */}
                {jobs.filter((j) => j.status === "PENDING").length > 0 && (
                  <div className="space-y-3">
                    <h2
                      className="text-sm font-display font-bold"
                      style={{ color: isDark ? "#ffffff" : "#1a1a2e" }}
                    >
                      Pending Review (
                      {jobs.filter((j) => j.status === "PENDING").length})
                    </h2>
                    <JobsTable
                      jobs={jobs.filter((j) => j.status === "PENDING")}
                      onRefresh={fetchData}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Jobs tab */}
            {activeTab === "jobs" && (
              <JobsTable jobs={jobs} onRefresh={fetchData} />
            )}

            {/* Companies tab */}
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
