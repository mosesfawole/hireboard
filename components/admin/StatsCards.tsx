"use client";
import { useJobStore } from "@/store/useJobStore";
import {
  Briefcase,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
} from "lucide-react";
import type { AdminStats } from "@/types";

interface Props {
  stats: AdminStats;
}

export default function StatsCards({ stats }: Props) {
  const { isDark } = useJobStore();

  const cards = [
    {
      icon: <Briefcase size={14} />,
      label: "Total Jobs",
      value: stats.totalJobs,
      accent: "#4d9fff",
    },
    {
      icon: <CheckCircle size={14} />,
      label: "Active Jobs",
      value: stats.activeJobs,
      accent: "#00d4aa",
    },
    {
      icon: <Clock size={14} />,
      label: "Pending Review",
      value: stats.pendingJobs,
      accent: "#f0c040",
    },
    {
      icon: <Building2 size={14} />,
      label: "Companies",
      value: stats.totalCompanies,
      accent: "#a78bfa",
    },
    {
      icon: <TrendingUp size={14} />,
      label: "Jobs This Month",
      value: stats.jobsThisMonth,
      accent: "#00d4aa",
    },
    {
      icon: <XCircle size={14} />,
      label: "Total Users",
      value: stats.totalUsers,
      accent: "#ff4d6d",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl p-4"
          style={{
            background: isDark ? "#0f0f20" : "#ffffff",
            border: `1px solid ${isDark ? "#252540" : "#e0e0f0"}`,
            borderBottom: `2px solid ${card.accent}`,
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <p
              className="text-[10px] font-mono tracking-widest uppercase"
              style={{ color: "#5a5a8a" }}
            >
              {card.label}
            </p>
            <span style={{ color: card.accent }}>{card.icon}</span>
          </div>
          <p
            className="text-2xl font-display font-bold"
            style={{ color: isDark ? "#ffffff" : "#1a1a2e" }}
          >
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
