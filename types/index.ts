export type JobType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "REMOTE"
  | "INTERNSHIP";

export type JobStatus = "PENDING" | "ACTIVE" | "REJECTED" | "CLOSED";

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
  company?: Company;
}

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

export interface Company {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  description?: string;
  location?: string;
  user_id: string;
  created_at: string;
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

export type UserRole = "ADMIN" | "COMPANY";

export interface User {
  id: string;
  email: string;
  password?: string;
  role: UserRole;
  created_at: string;
  company?: Company;
}

export interface JobFilters {
  search: string;
  category: string;
  type: string;
  location: string;
}

export interface AdminStats {
  totalJobs: number;
  activeJobs: number;
  pendingJobs: number;
  totalCompanies: number;
  totalUsers: number;
  jobsThisMonth: number;
}
