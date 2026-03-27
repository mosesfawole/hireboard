"use client";
import Image from "next/image";
import { Building2, Globe, MapPin, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Company } from "@/types";

interface Props {
  companies: Company[];
  onRefresh: () => void;
}

export default function CompaniesTable({ companies, onRefresh }: Props) {
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
    <div className="surface-card overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid var(--panel-border)" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 rounded-full" style={{ background: "#8b5cf6" }} />
          <h2
            className="text-xs font-display font-bold tracking-widest uppercase"
            style={{ color: "var(--text)" }}
          >
            All Companies
          </h2>
        </div>
        <span className="text-xs font-medium text-muted">
          {companies.length} total
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="data-table w-full text-xs min-w-[500px]">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--panel-border)" }}>
              {["Company", "Location", "Website", "Jobs Posted", "Joined", "Actions"].map(
                (heading) => (
                  <th
                    key={heading}
                    className="text-left px-4 py-3 font-medium text-muted"
                  >
                    {heading}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id} style={{ borderBottom: "1px solid var(--panel-border)" }}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shrink-0"
                      style={{ background: "var(--surface-2)" }}
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
                        <Building2 size={14} style={{ color: "var(--text-soft)" }} />
                      )}
                    </div>
                    <span
                      className="font-semibold font-display"
                      style={{ color: "var(--text)" }}
                    >
                      {company.name}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-1" style={{ color: "var(--text-soft)" }}>
                    <MapPin size={10} />
                    <span className="font-medium">{company.location ?? "-"}</span>
                  </div>
                </td>

                <td className="px-4 py-3">
                  {company.website ? (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 font-medium"
                      style={{ color: "var(--brand)" }}
                    >
                      <Globe size={10} />
                      Visit
                    </a>
                  ) : (
                    <span style={{ color: "var(--text-soft)" }}>-</span>
                  )}
                </td>

                <td className="px-4 py-3 font-medium text-muted">
                  {company.jobs?.length ?? 0} jobs
                </td>

                <td className="px-4 py-3 font-medium text-muted">
                  {new Date(company.created_at).toLocaleDateString()}
                </td>

                <td className="px-4 py-3">
                  <button
                    onClick={() => deleteCompany(company.id)}
                    disabled={loading === company.id}
                    className="ui-button-danger p-1.5"
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
