import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL in your environment configuration.",
  );
}

if (!supabaseKey) {
  throw new Error(
    "Missing Supabase publishable key. Set NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey ?? supabaseKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);
