import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { MILESTONE_STATUSES, MILESTONE_XP_AWARD } from "@/lib/constants";
import { applyXpDelta } from "@/lib/gamification/xp";

const patchSchema = z.object({
  status: z.enum(MILESTONE_STATUSES).optional(),
  plannedFor: z.string().date().nullable().optional(),
});

// Every 5th real completed milestone gets a small, non-XP, non-random
// acknowledgment — the "tame" version of Part B's mystery-box mechanic.
// Deterministic and inspectable (not a random draw, no gambling-style
// reveal), but not something a student is tracking toward, so it still
// lands as a pleasant surprise in normal use.
const SURPRISE_EVERY_NTH_COMPLETION = 5;

function isConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

function notConfigured() {
  return NextResponse.json(
    { error: "No Supabase project is configured in this environment." },
    { status: 501 }
  );
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isConfigured()) return notConfigured();

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }
  if (parsed.data.status === undefined && parsed.data.plannedFor === undefined) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { data: existing, error: existingError } = await supabase
    .from("milestones")
    .select("id, status, title, roadmap_id")
    .eq("id", id)
    .maybeSingle();

  if (existingError) return NextResponse.json({ error: existingError.message }, { status: 500 });
  if (!existing) return NextResponse.json({ error: "Milestone not found" }, { status: 404 });

  const wasCompleted = existing.status === "completed";
  const willBeCompleted = parsed.data.status ? parsed.data.status === "completed" : wasCompleted;

  const updatePayload: { status?: (typeof MILESTONE_STATUSES)[number]; planned_for?: string | null } = {};
  if (parsed.data.status !== undefined) updatePayload.status = parsed.data.status;
  if (parsed.data.plannedFor !== undefined) updatePayload.planned_for = parsed.data.plannedFor;

  const { data: updated, error: updateError } = await supabase
    .from("milestones")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  let surprise = false;

  if (wasCompleted !== willBeCompleted) {
    await applyXpDelta(supabase, user.id, willBeCompleted ? MILESTONE_XP_AWARD : -MILESTONE_XP_AWARD);

    if (willBeCompleted) {
      const { data: roadmaps } = await supabase.from("roadmaps").select("id").eq("user_id", user.id);
      const roadmapIds = (roadmaps ?? []).map((r) => r.id);
      const { count } = roadmapIds.length
        ? await supabase
            .from("milestones")
            .select("id", { count: "exact", head: true })
            .eq("status", "completed")
            .in("roadmap_id", roadmapIds)
        : { count: 0 };

      surprise = Boolean(count && count > 0 && count % SURPRISE_EVERY_NTH_COMPLETION === 0);

      await supabase.from("achievement_posts").insert({
        user_id: user.id,
        kind: surprise ? "xp_badge" : "milestone_completed",
        title: surprise ? `${count} milestones done — on a roll!` : existing.title,
        body: surprise ? `Just completed: ${existing.title}` : null,
        milestone_id: existing.id,
      });
    }
  }

  return NextResponse.json({ milestone: updated, surprise });
}
