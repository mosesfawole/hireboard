"use client";
import {
  formatJobType,
  getJobTypeBadge,
  getStatusBadge,
  type BadgeVariant,
} from "@/lib/job-ui";

interface BadgeProps {
  label: string;
  variant: BadgeVariant;
}

// Maps each variant to its color values
const variants: Record<BadgeProps["variant"], { bg: string; color: string }> = {
  green: { bg: "rgba(0,212,170,0.1)", color: "#00d4aa" },
  blue: { bg: "rgba(77,159,255,0.1)", color: "#4d9fff" },
  purple: { bg: "rgba(167,139,250,0.1)", color: "#a78bfa" },
  gold: { bg: "rgba(240,192,64,0.1)", color: "#f0c040" },
  red: { bg: "rgba(255,77,109,0.1)", color: "#ff4d6d" },
  muted: { bg: "rgba(148,163,184,0.12)", color: "#94a3b8" },
  pending: { bg: "rgba(240,192,64,0.1)", color: "#f0c040" },
  active: { bg: "rgba(0,212,170,0.1)", color: "#00d4aa" },
  rejected: { bg: "rgba(255,77,109,0.1)", color: "#ff4d6d" },
  closed: { bg: "rgba(148,163,184,0.12)", color: "#94a3b8" },
};

export default function Badge({ label, variant }: BadgeProps) {
  const { bg, color } = variants[variant];
  return (
    <span
      className="ui-badge inline-flex items-center"
      style={{ background: bg, color, borderColor: `${color}26` }}
    >
      {label}
    </span>
  );
}

export { formatJobType, getJobTypeBadge, getStatusBadge };
