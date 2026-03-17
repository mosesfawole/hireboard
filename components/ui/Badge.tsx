"use client";

interface BadgeProps {
  label: string;
  variant:
    | "green"
    | "blue"
    | "purple"
    | "gold"
    | "red"
    | "muted"
    | "pending"
    | "active"
    | "rejected"
    | "closed";
}

// Maps each variant to its color values
const variants: Record<BadgeProps["variant"], { bg: string; color: string }> = {
  green: { bg: "rgba(0,212,170,0.1)", color: "#00d4aa" },
  blue: { bg: "rgba(77,159,255,0.1)", color: "#4d9fff" },
  purple: { bg: "rgba(167,139,250,0.1)", color: "#a78bfa" },
  gold: { bg: "rgba(240,192,64,0.1)", color: "#f0c040" },
  red: { bg: "rgba(255,77,109,0.1)", color: "#ff4d6d" },
  muted: { bg: "rgba(90,90,138,0.1)", color: "#5a5a8a" },
  pending: { bg: "rgba(240,192,64,0.1)", color: "#f0c040" },
  active: { bg: "rgba(0,212,170,0.1)", color: "#00d4aa" },
  rejected: { bg: "rgba(255,77,109,0.1)", color: "#ff4d6d" },
  closed: { bg: "rgba(90,90,138,0.1)", color: "#5a5a8a" },
};

// Maps job type strings to badge variants
export function getJobTypeBadge(type: string): BadgeProps["variant"] {
  const map: Record<string, BadgeProps["variant"]> = {
    FULL_TIME: "green",
    PART_TIME: "blue",
    CONTRACT: "purple",
    REMOTE: "gold",
    INTERNSHIP: "muted",
  };
  return map[type] ?? "muted";
}

// Maps job status strings to badge variants
export function getStatusBadge(status: string): BadgeProps["variant"] {
  const map: Record<string, BadgeProps["variant"]> = {
    PENDING: "pending",
    ACTIVE: "active",
    REJECTED: "rejected",
    CLOSED: "closed",
  };
  return map[status] ?? "muted";
}

// Formats job type for display
export function formatJobType(type: string): string {
  const map: Record<string, string> = {
    FULL_TIME: "Full Time",
    PART_TIME: "Part Time",
    CONTRACT: "Contract",
    REMOTE: "Remote",
    INTERNSHIP: "Internship",
  };
  return map[type] ?? type;
}

export default function Badge({ label, variant }: BadgeProps) {
  const { bg, color } = variants[variant];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold"
      style={{ background: bg, color }}
    >
      {label}
    </span>
  );
}
