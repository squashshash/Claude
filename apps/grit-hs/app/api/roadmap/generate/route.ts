import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { onboardingSchema } from "@/lib/validations/onboarding";
import { getRoadmapTemplate } from "@/lib/roadmap/templates";
import { MILESTONE_XP_AWARD } from "@/lib/constants";
import { enforceRateLimit } from "@/lib/api/rate-limit-response";
import type { Database } from "@/types/database.types";

export async function POST(request: Request) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json(
      {
        error:
          "No Supabase project is configured in this environment. This endpoint is fully wired — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY and it starts writing real rows.",
      },
      { status: 501 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = onboardingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }
  const { targetCareer, currentGrade, state, zipCode, baseline } = parsed.data;

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Each call replaces the roadmap and writes ~20 milestone rows, so cap the churn.
  const limited = enforceRateLimit(`roadmap-generate:${user.id}`, 10, 60 * 60);
  if (limited) return limited;

  const template = getRoadmapTemplate(targetCareer);
  // Endowed-progress effect (Nunes & Drèze) — a new roadmap starts with its
  // first milestone already checked off and the real XP for it already
  // awarded, disclosed in the onboarding-complete screen as a starting
  // step, not something manufactured to look earned.
  const hasStartingMilestone = template.milestones.length > 0;

  const profileUpsert: Database["public"]["Tables"]["profiles"]["Insert"] = {
    user_id: user.id,
    full_name: (user.user_metadata?.full_name as string | undefined) ?? null,
    state,
    zip_code: zipCode,
    target_career: targetCareer,
    current_grade: currentGrade,
    xp_points: hasStartingMilestone ? MILESTONE_XP_AWARD : 0,
  };

  const { error: profileError } = await supabase
    .from("profiles")
    .upsert(profileUpsert, { onConflict: "user_id" });

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  const { data: roadmap, error: roadmapError } = await supabase
    .from("roadmaps")
    .insert({
      user_id: user.id,
      career_track: targetCareer,
      roadmap_json: {
        summary: template.summary,
        generatedFrom: "onboarding",
        baseline: baseline || null,
      },
    })
    .select("id")
    .single();

  if (roadmapError || !roadmap) {
    return NextResponse.json(
      { error: roadmapError?.message ?? "Couldn't create roadmap" },
      { status: 500 }
    );
  }

  const milestoneRows: Database["public"]["Tables"]["milestones"]["Insert"][] =
    template.milestones.map((m, index) => ({
      roadmap_id: roadmap.id,
      grade_level: m.gradeLevel,
      category: m.category,
      title: m.title,
      description: m.description,
      age_prerequisite: m.agePrerequisite ?? null,
      status: index === 0 ? "completed" : "not_started",
      sort_order: index,
    }));

  const { error: milestonesError } = await supabase.from("milestones").insert(milestoneRows);

  if (milestonesError) {
    return NextResponse.json({ error: milestonesError.message }, { status: 500 });
  }

  if (hasStartingMilestone) {
    await supabase.from("achievement_posts").insert({
      user_id: user.id,
      kind: "milestone_completed",
      title: milestoneRows[0].title,
      body: "First milestone, already checked off — a head start on your roadmap.",
    });
  }

  return NextResponse.json(
    { roadmapId: roadmap.id, startedWithMilestone: hasStartingMilestone },
    { status: 201 }
  );
}
