import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { CLUB_XP_AWARD, LEADERSHIP_XP_BONUS, isLeadershipRole } from "@/lib/constants";
import { applyXpDelta } from "@/lib/gamification/xp";

const CLUB_CATEGORIES = ["stem", "arts", "athletics", "service", "other"] as const;

const patchSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.enum(CLUB_CATEGORIES).optional(),
  role: z.string().nullable().optional(),
  meetingSchedule: z.string().nullable().optional(),
  advisorName: z.string().nullable().optional(),
  joinedDate: z.string().nullable().optional(),
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
    category?: (typeof CLUB_CATEGORIES)[number];
    role?: string | null;
    meeting_schedule?: string | null;
    advisor_name?: string | null;
    joined_date?: string | null;
    notes?: string | null;
  } = {};
  if (parsed.data.name !== undefined) updatePayload.name = parsed.data.name;
  if (parsed.data.category !== undefined) updatePayload.category = parsed.data.category;
  if (parsed.data.role !== undefined) updatePayload.role = parsed.data.role;
  if (parsed.data.meetingSchedule !== undefined) updatePayload.meeting_schedule = parsed.data.meetingSchedule;
  if (parsed.data.advisorName !== undefined) updatePayload.advisor_name = parsed.data.advisorName;
  if (parsed.data.joinedDate !== undefined) updatePayload.joined_date = parsed.data.joinedDate;
  if (parsed.data.notes !== undefined) updatePayload.notes = parsed.data.notes;

  // Recompute the leadership XP bonus if the role is changing — read the
  // prior role first so a leader->member edit revokes it and a
  // member->leader edit awards it, instead of silently drifting.
  let xpDelta = 0;
  if (parsed.data.role !== undefined) {
    const { data: existing } = await supabase.from("clubs").select("role").eq("id", id).maybeSingle();
    const wasLeader = isLeadershipRole(existing?.role ?? null);
    const willBeLeader = isLeadershipRole(parsed.data.role);
    if (wasLeader !== willBeLeader) xpDelta = willBeLeader ? LEADERSHIP_XP_BONUS : -LEADERSHIP_XP_BONUS;
  }

  const { data, error } = await supabase
    .from("clubs")
    .update(updatePayload)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const nextXp = await applyXpDelta(supabase, user.id, xpDelta);
  return NextResponse.json({ club: data, xpPoints: nextXp });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isConfigured()) return notConfigured();

  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { data: existing } = await supabase.from("clubs").select("role").eq("id", id).eq("user_id", user.id).maybeSingle();

  const { error } = await supabase.from("clubs").delete().eq("id", id).eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (existing) {
    const xpDelta = -(CLUB_XP_AWARD + (isLeadershipRole(existing.role) ? LEADERSHIP_XP_BONUS : 0));
    await applyXpDelta(supabase, user.id, xpDelta);
  }

  return NextResponse.json({ success: true });
}
