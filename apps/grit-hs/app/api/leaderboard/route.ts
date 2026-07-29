import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function isConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function notConfigured() {
  return NextResponse.json(
    { error: "No Supabase project is configured in this environment." },
    { status: 501 }
  );
}

// Leaderboard entries are only ever students who've already opted into the
// public portfolio handle (portfolio_public=true) — no separate opt-in
// surface, and no fields beyond what that feature already exposes publicly.
export async function GET() {
  if (!isConfigured()) return notConfigured();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { data: you } = await supabase
    .from("profiles")
    .select("handle, portfolio_public, xp_points")
    .eq("user_id", user.id)
    .maybeSingle();

  const admin = createAdminClient();
  const { data: entries, error } = await admin
    .from("profiles")
    .select("handle, xp_points")
    .eq("portfolio_public", true)
    .not("handle", "is", null)
    .order("xp_points", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    entries: entries ?? [],
    you: you ? { handle: you.handle, isPublic: you.portfolio_public, xpPoints: you.xp_points } : null,
  });
}
