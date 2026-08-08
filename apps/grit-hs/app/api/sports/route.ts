import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { SPORT_XP_AWARD, LEADERSHIP_XP_BONUS, isLeadershipRole } from "@/lib/constants";
import { applyXpDelta } from "@/lib/gamification/xp";

const sportSchema = z.object({
  name: z.string().min(1),
  season: z.string().optional(),
  role: z.string().optional(),
  practiceSchedule: z.string().optional(),
  coachName: z.string().optional(),
  notes: z.string().optional(),
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

export async function GET() {
  if (!isConfigured()) return notConfigured();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { data, error } = await supabase
    .from("sports")
    .select("*")
    .eq("user_id", user.id)
    .order("name", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ sports: data });
}

export async function POST(request: Request) {
  if (!isConfigured()) return notConfigured();

  const body = await request.json().catch(() => null);
  const parsed = sportSchema.safeParse(body);
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

  const { data, error } = await supabase
    .from("sports")
    .insert({
      user_id: user.id,
      name: parsed.data.name,
      season: parsed.data.season || null,
      role: parsed.data.role || null,
      practice_schedule: parsed.data.practiceSchedule || null,
      coach_name: parsed.data.coachName || null,
      notes: parsed.data.notes || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const xpDelta = SPORT_XP_AWARD + (isLeadershipRole(parsed.data.role) ? LEADERSHIP_XP_BONUS : 0);
  const nextXp = await applyXpDelta(supabase, user.id, xpDelta);

  return NextResponse.json({ sport: data, xpAwarded: xpDelta, xpPoints: nextXp }, { status: 201 });
}
