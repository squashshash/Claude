import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function isConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

function notConfigured() {
  return NextResponse.json(
    { error: "No Supabase project is configured in this environment." },
    { status: 501 }
  );
}

/**
 * Open, app-wide achievement feed (RLS lets any authenticated user read
 * every row — see 0006 migration). Identity is still resolved server-side
 * to the student's public-portfolio handle if they've set one, or a
 * generic label otherwise — the feed being open doesn't mean a student's
 * real name is exposed by default; that's still the same opt-in surface
 * the leaderboard and public portfolio already use.
 */
export async function GET() {
  if (!isConfigured()) return notConfigured();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { data: posts, error } = await supabase
    .from("achievement_posts")
    .select("id, user_id, kind, title, body, created_at")
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!posts || posts.length === 0) return NextResponse.json({ posts: [] });

  const userIds = [...new Set(posts.map((p) => p.user_id))];
  let identities = new Map<string, string>();

  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const admin = createAdminClient();
    const { data: profiles } = await admin
      .from("profiles")
      .select("user_id, handle, portfolio_public")
      .in("user_id", userIds);
    identities = new Map(
      (profiles ?? []).map((p) => [p.user_id, p.portfolio_public && p.handle ? p.handle : "A Grit student"])
    );
  }

  return NextResponse.json({
    posts: posts.map((p) => ({
      id: p.id,
      kind: p.kind,
      title: p.title,
      body: p.body,
      createdAt: p.created_at,
      isYou: p.user_id === user.id,
      displayName: p.user_id === user.id ? "You" : (identities.get(p.user_id) ?? "A Grit student"),
    })),
  });
}
