import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkIn, streakMessage } from "@/lib/gamification/streak";

function isConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

function notConfigured() {
  return NextResponse.json(
    { error: "No Supabase project is configured in this environment." },
    { status: 501 }
  );
}

/** "I showed up today" — real, persisted, once-per-day streak check-in. */
export async function POST() {
  if (!isConfigured()) return notConfigured();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("current_streak, longest_streak, last_active_date, streak_grace_available")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 500 });
  if (!profile) return NextResponse.json({ error: "No profile found" }, { status: 404 });

  const today = new Date().toISOString().slice(0, 10);
  const result = checkIn(
    {
      currentStreak: profile.current_streak,
      longestStreak: profile.longest_streak,
      lastActiveDate: profile.last_active_date,
      graceAvailable: profile.streak_grace_available,
    },
    today
  );

  if (!result.alreadyCheckedInToday) {
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        current_streak: result.currentStreak,
        longest_streak: result.longestStreak,
        last_active_date: result.lastActiveDate,
        streak_grace_available: result.graceAvailable,
      })
      .eq("user_id", user.id);

    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

    // Real, evergreen milestone — not a randomized reward. Every 7th day.
    if (result.currentStreak > 0 && result.currentStreak % 7 === 0) {
      await supabase.from("achievement_posts").insert({
        user_id: user.id,
        kind: "streak_milestone",
        title: `${result.currentStreak}-day streak`,
        body: streakMessage(result),
      });
    }
  }

  return NextResponse.json({ ...result, message: streakMessage(result) });
}
