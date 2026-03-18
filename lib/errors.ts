type ErrorWithCause = Error & {
  cause?: unknown;
  code?: string;
};

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
  return getNestedErrorMessage(error) ?? fallback;
}
