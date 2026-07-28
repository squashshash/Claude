import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

/**
 * Service-role client — bypasses RLS. Server-only, never import from a
 * Client Component. Used for flows where the actor isn't the app's own
 * authenticated user (e.g. a supervisor confirming hours via an emailed
 * link, or admin-managed certification catalog writes).
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
