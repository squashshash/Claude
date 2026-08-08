import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { CAREER_TRACKS } from "@/lib/constants";
import { getRoadmapTemplate } from "@/lib/roadmap/templates";
import type { Database } from "@/types/database.types";

const patchSchema = z.object({
  targetCareer: z.enum(CAREER_TRACKS, { message: "Pick a valid pathway" }),
});

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
 * Lets a student change their target pathway after onboarding. Replaces
 * their roadmap + milestones with a fresh set for the new track (old
 * milestone-completion state on the previous pathway doesn't carry over —
 * it's a different roadmap now — but xp_points is untouched, so XP already
 * earned isn't lost). Existing roadmap rows for the user are deleted first
 * so a student switching pathways repeatedly doesn't accumulate orphaned
 * rows the dashboard would otherwise just silently ignore.
 */
export async function PATCH(request: Request) {
  if (!isConfigured()) return notConfigured();

  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }
  const { targetCareer } = parsed.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ target_career: targetCareer })
    .eq("user_id", user.id);

  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 500 });

  const { error: deleteError } = await supabase.from("roadmaps").delete().eq("user_id", user.id);
  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });

  const template = getRoadmapTemplate(targetCareer);

  const { data: roadmap, error: roadmapError } = await supabase
    .from("roadmaps")
    .insert({
      user_id: user.id,
      career_track: targetCareer,
      roadmap_json: { summary: template.summary, generatedFrom: "pathway_change" },
    })
    .select("id")
    .single();

  if (roadmapError || !roadmap) {
    return NextResponse.json(
      { error: roadmapError?.message ?? "Couldn't create roadmap" },
      { status: 500 }
    );
  }

  // Same endowed-progress head start as onboarding (first milestone starts
  // checked off), but deliberately NO extra XP here — XP already carries
  // over unchanged from the old pathway (see doc comment above), and
  // awarding another 100 XP on every switch would let a student farm XP by
  // repeatedly changing pathways.
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

  if (milestoneRows.length > 0) {
    const { error: milestonesError } = await supabase.from("milestones").insert(milestoneRows);
    if (milestonesError) return NextResponse.json({ error: milestonesError.message }, { status: 500 });
  }

  return NextResponse.json({ roadmapId: roadmap.id, startedWithMilestone: milestoneRows.length > 0 });
}
