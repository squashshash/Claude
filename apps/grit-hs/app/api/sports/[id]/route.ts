import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { SPORT_XP_AWARD, LEADERSHIP_XP_BONUS, isLeadershipRole } from "@/lib/constants";
import { applyXpDelta } from "@/lib/gamification/xp";

const patchSchema = z.object({
  name: z.string().min(1).optional(),
  season: z.string().nullable().optional(),
  role: z.string().nullable().optional(),
  practiceSchedule: z.string().nullable().optional(),
  coachName: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
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

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const updatePayload: {
    name?: string;
    season?: string | null;
    role?: string | null;
    practice_schedule?: string | null;
    coach_name?: string | null;
    notes?: string | null;
  } = {};
  if (parsed.data.name !== undefined) updatePayload.name = parsed.data.name;
  if (parsed.data.season !== undefined) updatePayload.season = parsed.data.season;
  if (parsed.data.role !== undefined) updatePayload.role = parsed.data.role;
  if (parsed.data.practiceSchedule !== undefined) updatePayload.practice_schedule = parsed.data.practiceSchedule;
  if (parsed.data.coachName !== undefined) updatePayload.coach_name = parsed.data.coachName;
  if (parsed.data.notes !== undefined) updatePayload.notes = parsed.data.notes;

  let xpDelta = 0;
  if (parsed.data.role !== undefined) {
    const { data: existing } = await supabase.from("sports").select("role").eq("id", id).maybeSingle();
    const wasLeader = isLeadershipRole(existing?.role ?? null);
    const willBeLeader = isLeadershipRole(parsed.data.role);
    if (wasLeader !== willBeLeader) xpDelta = willBeLeader ? LEADERSHIP_XP_BONUS : -LEADERSHIP_XP_BONUS;
  }

  const { data, error } = await supabase
    .from("sports")
    .update(updatePayload)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const nextXp = await applyXpDelta(supabase, user.id, xpDelta);
  return NextResponse.json({ sport: data, xpPoints: nextXp });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isConfigured()) return notConfigured();

  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { data: existing } = await supabase.from("sports").select("role").eq("id", id).eq("user_id", user.id).maybeSingle();

  const { error } = await supabase.from("sports").delete().eq("id", id).eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (existing) {
    const xpDelta = -(SPORT_XP_AWARD + (isLeadershipRole(existing.role) ? LEADERSHIP_XP_BONUS : 0));
    await applyXpDelta(supabase, user.id, xpDelta);
  }

  return NextResponse.json({ success: true });
}
