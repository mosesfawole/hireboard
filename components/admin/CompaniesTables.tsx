"use client";
import Image from "next/image";
import { useJobStore } from "@/store/useJobStore";
import { Building2, Globe, MapPin, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Company } from "@/types";

interface Props {
  companies: Company[];
  onRefresh: () => void;
}

export default function CompaniesTable({ companies, onRefresh }: Props) {
  const { isDark } = useJobStore();
  const [loading, setLoading] = useState<string | null>(null);

  const deleteCompany = async (id: string) => {
    if (!confirm("Delete this company and all their jobs?")) return;
    setLoading(id);
    try {
      await fetch(`/api/companies/${id}`, { method: "DELETE" });
      onRefresh();
    } finally {
      setLoading(null);
    }
  };

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: isDark ? "#0f0f20" : "#ffffff",
        border: `1px solid ${isDark ? "#252540" : "#e0e0f0"}`,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: `1px solid ${isDark ? "#252540" : "#e0e0f0"}` }}
      >
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 rounded-full" style={{ background: "#a78bfa" }} />
          <h2
            className="text-xs font-display font-bold tracking-widest uppercase"
            style={{ color: isDark ? "#ffffff" : "#1a1a2e" }}
          >
            All Companies
          </h2>
        </div>
        <span className="text-xs font-mono" style={{ color: "#5a5a8a" }}>
          {companies.length} total
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs min-w-[500px]">
          <thead>
            <tr
              style={{
                borderBottom: `1px solid ${isDark ? "#252540" : "#e0e0f0"}`,
              }}
            >
              {["Company", "Location", "Website", "Jobs Posted", "Joined", "Actions"].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 font-mono font-normal"
                  style={{ color: "#5a5a8a" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr
                key={company.id}
                style={{
                  borderBottom: `1px solid ${isDark ? "#252540" : "#e0e0f0"}`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    isDark ? "#161628" : "#f8f8fc";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                {/* Company name + logo */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shrink-0"
                      style={{ background: isDark ? "#1a1a30" : "#f0f0f8" }}
                    >
                      {company.logo ? (
                        <Image
                          src={company.logo}
                          alt={company.name}
                          width={32}
                          height={32}
                          unoptimized
                        />
                      ) : (
                        <Building2 size={14} style={{ color: "#5a5a8a" }} />
                      )}
                    </div>
                    <span
                      className="font-semibold font-display"
                      style={{ color: isDark ? "#ffffff" : "#1a1a2e" }}
                    >
                      {company.name}
                    </span>
                  </div>
                </td>

                {/* Location */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1" style={{ color: "#5a5a8a" }}>
                    <MapPin size={10} />
                    <span className="font-mono">{company.location ?? "—"}</span>
                  </div>
                </td>

                {/* Website */}
                <td className="px-4 py-3">
                  {company.website ? (
                    
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 font-mono"
                      style={{ color: "#4d9fff" }}
                    >
                      <Globe size={10} />
                      Visit
                    </a>
                  ) : (
                    <span style={{ color: "#5a5a8a" }}>—</span>
                  )}
                </td>

                {/* Jobs count */}
                <td className="px-4 py-3 font-mono" style={{ color: "#5a5a8a" }}>
                  {company.jobs?.length ?? 0} jobs
                </td>

                {/* Joined date */}
                <td className="px-4 py-3 font-mono" style={{ color: "#5a5a8a" }}>
                  {new Date(company.created_at).toLocaleDateString()}
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <button
                    onClick={() => deleteCompany(company.id)}
                    disabled={loading === company.id}
                    className="p-1.5 rounded-lg"
                    style={{
                      background: "rgba(255,77,109,0.1)",
                      color: "#ff4d6d",
                    }}
                    title="Delete company"
                  >
                    <Trash2 size={11} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}