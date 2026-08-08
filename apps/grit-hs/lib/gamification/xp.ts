import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

/**
 * Applies a delta to the student's xp_points and returns the new total.
 * Positive awards, negative revokes (e.g. deleting a club, or an edit that
 * removes a leadership role or score that had earned XP).
 *
 * Runs as a single atomic `xp_points = greatest(0, xp_points + delta)` in
 * Postgres rather than a read-then-write, so two overlapping awards can't both
 * read the same starting value and have the second clobber the first.
 */
export async function applyXpDelta(
  supabase: SupabaseClient<Database>,
  userId: string,
  delta: number
): Promise<number | null> {
  if (delta === 0) return null;

  const { data, error } = await supabase.rpc("increment_xp", {
    p_user_id: userId,
    p_delta: delta,
  });

  if (error) return null;
  return data ?? null;
}
