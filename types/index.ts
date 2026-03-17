// ── Job types ──────────────────────────────────────────────────────

export type JobType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "REMOTE"
  | "INTERNSHIP";

export type JobStatus = "PENDING" | "ACTIVE" | "REJECTED" | "CLOSED";

// What a job looks like when fetched from the database
export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  salary?: string;
  type: JobType;
  category: string;
  apply_url: string;
  status: JobStatus;
  featured: boolean;
  company_id: string;
  created_at: string;
  // When we fetch a job we also join the company data
  // so you can show the company name and logo on the job card
  company?: Company;
}

// What you send when creating a new job
// No id, status or created_at — the database generates those
export interface CreateJobInput {
  title: string;
  description: string;
  location: string;
  salary?: string;
  type: JobType;
  category: string;
  apply_url: string;
  company_id: string;
}

// ── Company types ──────────────────────────────────────────────────

export interface Company {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  description?: string;
  location?: string;
  user_id: string;
  created_at: string;
  // When fetching a company we can also get their jobs
  jobs?: Job[];
}

export interface CreateCompanyInput {
  name: string;
  logo?: string;
  website?: string;
  description?: string;
  location?: string;
  user_id: string;
}

// ── User types ─────────────────────────────────────────────────────

export type UserRole = "ADMIN" | "COMPANY";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  // A user can have one company profile
  company?: Company;
}

// What you send when registering
export interface RegisterInput {
  email: string;
  password: string;
  companyName: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

// ── Auth session ───────────────────────────────────────────────────

// What gets stored in the NextAuth session
// Available on every page via useSession()
export interface SessionUser {
  id: string;
  email: string;
  role: UserRole;
  companyId?: string;
}

// ── Filter types ───────────────────────────────────────────────────

// What the job filter bar controls
export interface JobFilters {
  search: string;
  category: string;
  type: string;
  location: string;
}

// ── Admin stats ────────────────────────────────────────────────────

// What the admin dashboard overview shows
export interface AdminStats {
  totalJobs: number;
  activeJobs: number;
  pendingJobs: number;
  totalCompanies: number;
  totalUsers: number;
  jobsThisMonth: number;
}
