import type { JobType } from "@/types";

export type BadgeVariant =
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

export const JOB_CATEGORIES = [
  "Engineering",
  "Design",
  "Marketing",
  "Sales",
  "Finance",
  "HR",
  "Operations",
  "Legal",
  "Other",
] as const;

export const JOB_TYPE_OPTIONS: ReadonlyArray<{
  label: string;
  value: JobType;
}> = [
  { label: "Full Time", value: "FULL_TIME" },
  { label: "Part Time", value: "PART_TIME" },
  { label: "Contract", value: "CONTRACT" },
  { label: "Remote", value: "REMOTE" },
  { label: "Internship", value: "INTERNSHIP" },
];

export function getJobTypeBadge(type: JobType): BadgeVariant {
  const map: Record<JobType, BadgeVariant> = {
    FULL_TIME: "green",
    PART_TIME: "blue",
    CONTRACT: "purple",
    REMOTE: "gold",
    INTERNSHIP: "muted",
  };

  return map[type];
}

export function getStatusBadge(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    PENDING: "pending",
    ACTIVE: "active",
    REJECTED: "rejected",
    CLOSED: "closed",
  };

  return map[status] ?? "muted";
}

export function formatJobType(type: JobType): string {
  const map: Record<JobType, string> = {
    FULL_TIME: "Full Time",
    PART_TIME: "Part Time",
    CONTRACT: "Contract",
    REMOTE: "Remote",
    INTERNSHIP: "Internship",
  };

  return map[type];
}
