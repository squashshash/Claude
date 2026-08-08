import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { CLUB_XP_AWARD, LEADERSHIP_XP_BONUS, isLeadershipRole } from "@/lib/constants";
import { applyXpDelta } from "@/lib/gamification/xp";

const CLUB_CATEGORIES = ["stem", "arts", "athletics", "service", "other"] as const;

const clubSchema = z.object({
  name: z.string().min(1),
  category: z.enum(CLUB_CATEGORIES).optional(),
  role: z.string().optional(),
  meetingSchedule: z.string().optional(),
  advisorName: z.string().optional(),
  joinedDate: z.string().optional(),
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
    .from("clubs")
    .select("*")
    .eq("user_id", user.id)
    .order("name", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ clubs: data });
}

export async function POST(request: Request) {
  if (!isConfigured()) return notConfigured();

  const body = await request.json().catch(() => null);
  const parsed = clubSchema.safeParse(body);
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
    .from("clubs")
    .insert({
      user_id: user.id,
      name: parsed.data.name,
      category: parsed.data.category ?? "other",
      role: parsed.data.role || null,
      meeting_schedule: parsed.data.meetingSchedule || null,
      advisor_name: parsed.data.advisorName || null,
      joined_date: parsed.data.joinedDate || null,
      notes: parsed.data.notes || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const xpDelta = CLUB_XP_AWARD + (isLeadershipRole(parsed.data.role) ? LEADERSHIP_XP_BONUS : 0);
  const nextXp = await applyXpDelta(supabase, user.id, xpDelta);

  return NextResponse.json({ club: data, xpAwarded: xpDelta, xpPoints: nextXp }, { status: 201 });
}
