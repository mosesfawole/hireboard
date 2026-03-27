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

export function getJobTypeBadge(type: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    FULL_TIME: "green",
    PART_TIME: "blue",
    CONTRACT: "purple",
    REMOTE: "gold",
    INTERNSHIP: "muted",
  };

  return map[type] ?? "muted";
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
