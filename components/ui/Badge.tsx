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
  green: { bg: "var(--success-soft)", color: "var(--success)" },
  blue: { bg: "#e1ecee", color: "#356c73" },
  purple: { bg: "#e9e4ef", color: "#69557b" },
  gold: { bg: "var(--warning-soft)", color: "var(--warning)" },
  red: { bg: "var(--danger-soft)", color: "var(--danger)" },
  muted: { bg: "var(--surface-2)", color: "var(--text-soft)" },
  pending: { bg: "var(--warning-soft)", color: "var(--warning)" },
  active: { bg: "var(--success-soft)", color: "var(--success)" },
  rejected: { bg: "var(--danger-soft)", color: "var(--danger)" },
  closed: { bg: "var(--surface-2)", color: "var(--text-soft)" },
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
