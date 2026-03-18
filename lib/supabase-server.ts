import { createClient } from "@supabase/supabase-js";

// This client uses the service role key — bypasses RLS
// ONLY use this in server-side code (API routes, lib/db.ts)
// NEVER expose this key to the browser
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
