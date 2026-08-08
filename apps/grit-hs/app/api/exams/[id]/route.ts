import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { xpForExamScore } from "@/lib/constants";
import { applyXpDelta } from "@/lib/gamification/xp";

const EXAM_TYPES = ["ap", "sat", "act", "final", "midterm", "certification", "other"] as const;
const EXAM_STATUSES = ["upcoming", "registered", "completed"] as const;

const patchSchema = z.object({
  title: z.string().min(1).optional(),
  examType: z.enum(EXAM_TYPES).optional(),
  date: z.string().min(1).optional(),
  registrationDeadline: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  status: z.enum(EXAM_STATUSES).optional(),
  notes: z.string().nullable().optional(),
  score: z.number().min(0).max(100).nullable().optional(),
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
    title?: string;
    exam_type?: (typeof EXAM_TYPES)[number];
    date?: string;
    registration_deadline?: string | null;
    location?: string | null;
    status?: (typeof EXAM_STATUSES)[number];
    notes?: string | null;
    score?: number | null;
  } = {};
  if (parsed.data.title !== undefined) updatePayload.title = parsed.data.title;
  if (parsed.data.examType !== undefined) updatePayload.exam_type = parsed.data.examType;
  if (parsed.data.date !== undefined) updatePayload.date = parsed.data.date;
  if (parsed.data.registrationDeadline !== undefined)
    updatePayload.registration_deadline = parsed.data.registrationDeadline;
  if (parsed.data.location !== undefined) updatePayload.location = parsed.data.location;
  if (parsed.data.status !== undefined) updatePayload.status = parsed.data.status;
  if (parsed.data.notes !== undefined) updatePayload.notes = parsed.data.notes;
  if (parsed.data.score !== undefined) updatePayload.score = parsed.data.score;

  // Recompute score-based XP as a delta between the prior real score and
  // the new one, so editing/correcting a score never double-counts.
  let xpDelta = 0;
  if (parsed.data.score !== undefined) {
    const { data: existing } = await supabase.from("exams").select("score").eq("id", id).maybeSingle();
    xpDelta = xpForExamScore(parsed.data.score) - xpForExamScore(existing?.score ?? null);
  }

  const { data, error } = await supabase
    .from("exams")
    .update(updatePayload)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const nextXp = await applyXpDelta(supabase, user.id, xpDelta);
  return NextResponse.json({ exam: data, xpAwarded: xpDelta || undefined, xpPoints: nextXp });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isConfigured()) return notConfigured();

  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { data: existing } = await supabase.from("exams").select("score").eq("id", id).eq("user_id", user.id).maybeSingle();

  const { error } = await supabase.from("exams").delete().eq("id", id).eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (existing) {
    const xpDelta = -xpForExamScore(existing.score);
    await applyXpDelta(supabase, user.id, xpDelta);
  }

  return NextResponse.json({ success: true });
}
