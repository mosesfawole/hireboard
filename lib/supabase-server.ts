import { createClient } from "@supabase/supabase-js";

function getRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const supabaseUrl = getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL");
const serviceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
