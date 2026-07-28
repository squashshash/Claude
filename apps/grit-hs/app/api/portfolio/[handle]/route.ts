import { NextResponse } from "next/server";
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

export async function GET(_request: Request, { params }: { params: Promise<{ handle: string }> }) {
  if (!isConfigured()) return notConfigured();

  const { handle } = await params;
  const supabase = createAdminClient();

  // Only ever select the fields that are safe to expose publicly — never
  // user_id, state, or zip_code, even though the service-role client could
  // see them. portfolio_public=false rows are never returned, matching the
  // opt-in default set in the 0004 migration.
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("user_id, full_name, target_career, current_grade, target_graduation_year, xp_points")
    .eq("handle", handle.toLowerCase())
    .eq("portfolio_public", true)
    .maybeSingle();

  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 500 });
  if (!profile) return NextResponse.json({ error: "No public portfolio at that handle." }, { status: 404 });

  const { data: roadmap } = await supabase
    .from("roadmaps")
    .select("id")
    .eq("user_id", profile.user_id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let milestones: { title: string; category: string; grade_level: string }[] = [];
  if (roadmap) {
    const { data } = await supabase
      .from("milestones")
      .select("title, category, grade_level")
      .eq("roadmap_id", roadmap.id)
      .eq("status", "completed");
    milestones = data ?? [];
  }

  const { data: credentials } = await supabase
    .from("user_credentials")
    .select("cert_name, issue_date")
    .eq("user_id", profile.user_id)
    .eq("is_public", true);

  return NextResponse.json({
    fullName: profile.full_name,
    targetCareer: profile.target_career,
    currentGrade: profile.current_grade,
    targetGraduationYear: profile.target_graduation_year,
    xpPoints: profile.xp_points,
    milestones,
    credentials: credentials ?? [],
  });
}
