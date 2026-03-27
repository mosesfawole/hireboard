type ErrorWithCause = Error & {
  cause?: unknown;
  code?: string;
};

function humanizeFieldName(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\bapply url\b/i, "application URL")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function normalizeReadableMessage(message: string) {
  const trimmed = message.trim();
  const lower = trimmed.toLowerCase();

  if (!trimmed) return null;

  if (lower.includes("row-level security")) {
    return "The app could not save data because your Supabase permissions are blocking this action.";
  }

  if (
    lower.includes("enotfound") ||
    lower.includes("getaddrinfo") ||
    lower.includes("fetch failed")
  ) {
    return "The app could not connect to Supabase. Check your project URL, keys, and network access.";
  }

  if (lower.includes("invalid login credentials")) {
    return "The email or password is incorrect.";
  }

  const requiredMatch = trimmed.match(/^([a-z_]+) is required$/i);
  if (requiredMatch) {
    return `${humanizeFieldName(requiredMatch[1])} is required.`;
  }

  if (/password must be at least 8 characters/i.test(trimmed)) {
    return "Your password must be at least 8 characters long.";
  }

  if (/an account with this email already exists/i.test(trimmed)) {
    return "An account already exists with this email address.";
  }

  if (/failed to create account/i.test(trimmed)) {
    return "We could not create your account right now. Please try again.";
  }

  if (/failed to create company profile/i.test(trimmed)) {
    return "Your account was created, but the company profile could not be set up yet.";
  }

  return trimmed;
}

function getNestedErrorMessage(error: unknown): string | null {
  if (!(error instanceof Error)) {
    return null;
  }

  const details = [error.message];
  const nestedCause = (error as ErrorWithCause).cause;

  if (nestedCause instanceof Error && nestedCause.message) {
    details.push(nestedCause.message);
  }

  const code = (error as ErrorWithCause).code;
  if (typeof code === "string" && code) {
    details.push(`code: ${code}`);
  }

  return details.filter(Boolean).join(" | ");
}

export function getErrorMessage(error: unknown, fallback = "Unknown error") {
  const raw = getNestedErrorMessage(error) ?? fallback;
  return normalizeReadableMessage(raw) ?? fallback;
}
