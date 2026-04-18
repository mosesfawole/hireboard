import bcrypt from "bcryptjs";
import { supabaseAdmin as supabase } from "./supabase-server";
import type {
  AdminStats,
  Company,
  CreateCompanyInput,
  CreateJobInput,
  Job,
  User,
} from "@/types";

type SupabaseErrorLike = {
  message: string;
  details?: string | null;
  hint?: string | null;
  code?: string;
};

function formatSupabaseError(error: SupabaseErrorLike): string {
  return [
    error.message,
    error.details,
    error.hint,
    error.code ? `code: ${error.code}` : null,
  ]
    .filter(Boolean)
    .join(" | ");
}

function throwSupabaseError(error: SupabaseErrorLike): never {
  throw new Error(formatSupabaseError(error));
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*, company:companies(*)")
    .eq("email", email)
    .single();

  if (error || !data) return null;
  return data as User;
}

export async function createUser(
  email: string,
  password: string,
): Promise<User | null> {
  const hashed = await bcrypt.hash(password, 12);

  const { data, error } = await supabase
    .from("users")
    .insert({ email, password: hashed, role: "COMPANY" })
    .select()
    .single();

  if (error) {
    throwSupabaseError(error);
  }

  if (!data) {
    throw new Error("User was not created.");
  }

  return data as User;
}

export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createCompany(
  input: CreateCompanyInput,
): Promise<Company | null> {
  const { data, error } = await supabase
    .from("companies")
    .insert(input)
    .select()
    .single();

  if (error) {
    throwSupabaseError(error);
  }

  if (!data) {
    throw new Error("Company profile was not created.");
  }

  return data as Company;
}

export async function getActiveJobs(): Promise<Job[]> {
  const { data, error } = await supabase
    .from("jobs")
    .select("*, company:companies(*)")
    .eq("status", "ACTIVE")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as Job[];
}

export async function getJobsByCompany(companyId: string): Promise<Job[]> {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as Job[];
}

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
  const payload = {
    ...input,
    salary: input.salary?.trim() ? input.salary.trim() : null,
    status: "PENDING" as const,
    featured: false,
  };

  const { data, error } = await supabase
    .from("jobs")
    .insert(payload)
    .select()
    .single();

  if (error) {
    throwSupabaseError(error);
  }

  if (!data) {
    throw new Error("Job was not created.");
  }

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

export async function getAllJobs(): Promise<Job[]> {
  const { data, error } = await supabase
    .from("jobs")
    .select("*, company:companies(*)")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as Job[];
}

export async function getAllCompanies(): Promise<Company[]> {
  const { data, error } = await supabase
    .from("companies")
    .select("*, jobs(*)")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as Company[];
}

export async function deleteCompanyById(id: string): Promise<boolean> {
  const { error: jobsError } = await supabase
    .from("jobs")
    .delete()
    .eq("company_id", id);

  if (jobsError) {
    return false;
  }

  const { error: companyError } = await supabase
    .from("companies")
    .delete()
    .eq("id", id);

  return !companyError;
}

export async function getAdminStats(): Promise<AdminStats> {
  const [jobs, companies, users] = await Promise.all([
    supabase.from("jobs").select("status, created_at"),
    supabase.from("companies").select("id"),
    supabase.from("users").select("id"),
  ]);

  const allJobs = jobs.data ?? [];
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  return {
    totalJobs: allJobs.length,
    activeJobs: allJobs.filter((job) => job.status === "ACTIVE").length,
    pendingJobs: allJobs.filter((job) => job.status === "PENDING").length,
    totalCompanies: companies.data?.length ?? 0,
    totalUsers: users.data?.length ?? 0,
    jobsThisMonth: allJobs.filter(
      (job) => new Date(job.created_at) >= startOfMonth,
    ).length,
  };
}
