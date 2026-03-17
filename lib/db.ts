import { supabase } from "./supabase";
import type {
  Job,
  Company,
  User,
  CreateJobInput,
  CreateCompanyInput,
  AdminStats,
} from "@/types";
import bcrypt from "bcryptjs";

// ── User queries ───────────────────────────────────────────────────

// Find a user by their email address
// Used during login to check if the account exists
export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*, company:companies(*)")
    .eq("email", email)
    .single();

  if (error || !data) return null;
  return data as User;
}

// Create a new user account
// Password is hashed before storing — never store plain text passwords
export async function createUser(
  email: string,
  password: string,
): Promise<User | null> {
  const hashed = await bcrypt.hash(password, 12);
  // The number 12 is the "salt rounds" — higher = more secure but slower
  // 12 is the industry standard balance between security and performance

  const { data, error } = await supabase
    .from("users")
    .insert({ email, password: hashed, role: "COMPANY" })
    .select()
    .single();

  if (error || !data) return null;
  return data as User;
}

// Verify a password against the stored hash
// Returns true if password matches, false if not
export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// ── Company queries ────────────────────────────────────────────────

export async function createCompany(
  input: CreateCompanyInput,
): Promise<Company | null> {
  const { data, error } = await supabase
    .from("companies")
    .insert(input)
    .select()
    .single();

  if (error || !data) return null;
  return data as Company;
}

export async function getCompanyByUserId(
  userId: string,
): Promise<Company | null> {
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;
  return data as Company;
}

export async function updateCompany(
  id: string,
  input: Partial<CreateCompanyInput>,
): Promise<Company | null> {
  const { data, error } = await supabase
    .from("companies")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) return null;
  return data as Company;
}

// ── Job queries ────────────────────────────────────────────────────

// Get all active jobs for the public board
// Joins company data so job cards can show company name and logo
export async function getActiveJobs(): Promise<Job[]> {
  const { data, error } = await supabase
    .from("jobs")
    .select("*, company:companies(*)")
    .eq("status", "ACTIVE")
    .order("featured", { ascending: false }) // featured jobs first
    .order("created_at", { ascending: false }); // then newest first

  if (error || !data) return [];
  return data as Job[];
}

// Get all jobs for a specific company (for their dashboard)
export async function getJobsByCompany(companyId: string): Promise<Job[]> {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as Job[];
}

// Get a single job by ID (for the job detail page)
export async function getJobById(id: string): Promise<Job | null> {
  const { data, error } = await supabase
    .from("jobs")
    .select("*, company:companies(*)")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as Job;
}

export async function createJob(input: CreateJobInput): Promise<Job | null> {
  const { data, error } = await supabase
    .from("jobs")
    .insert(input)
    .select()
    .single();

  if (error || !data) return null;
  return data as Job;
}

export async function updateJob(
  id: string,
  input: Partial<Job>,
): Promise<Job | null> {
  const { data, error } = await supabase
    .from("jobs")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) return null;
  return data as Job;
}

export async function deleteJob(id: string): Promise<boolean> {
  const { error } = await supabase.from("jobs").delete().eq("id", id);
  return !error;
}

// ── Admin queries ──────────────────────────────────────────────────

// Get all jobs for the admin dashboard
export async function getAllJobs(): Promise<Job[]> {
  const { data, error } = await supabase
    .from("jobs")
    .select("*, company:companies(*)")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as Job[];
}

// Get all companies for the admin dashboard
export async function getAllCompanies(): Promise<Company[]> {
  const { data, error } = await supabase
    .from("companies")
    .select("*, jobs(*)")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as Company[];
}

// Get overview stats for the admin dashboard
export async function getAdminStats(): Promise<AdminStats> {
  const [jobs, companies, users] = await Promise.all([
    supabase.from("jobs").select("status, created_at"),
    supabase.from("companies").select("id"),
    supabase.from("users").select("id"),
  ]);

  const allJobs = (jobs.data ?? []) as Pick<Job, "status" | "created_at">[];
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  return {
    totalJobs: allJobs.length,
    activeJobs: allJobs.filter((j) => j.status === "ACTIVE").length,
    pendingJobs: allJobs.filter((j) => j.status === "PENDING").length,
    totalCompanies: companies.data?.length ?? 0,
    totalUsers: users.data?.length ?? 0,
    jobsThisMonth: allJobs.filter((j) => new Date(j.created_at) >= startOfMonth)
      .length,
  };
}
