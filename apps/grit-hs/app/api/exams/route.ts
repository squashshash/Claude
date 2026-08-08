import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const EXAM_TYPES = ["ap", "sat", "act", "final", "midterm", "certification", "other"] as const;
const EXAM_STATUSES = ["upcoming", "registered", "completed"] as const;

const examSchema = z.object({
  title: z.string().min(1),
  examType: z.enum(EXAM_TYPES).optional(),
  date: z.string().min(1),
  registrationDeadline: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(EXAM_STATUSES).optional(),
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
    .from("exams")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ exams: data });
}

export async function POST(request: Request) {
  if (!isConfigured()) return notConfigured();

  const body = await request.json().catch(() => null);
  const parsed = examSchema.safeParse(body);
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
    .from("exams")
    .insert({
      user_id: user.id,
      title: parsed.data.title,
      exam_type: parsed.data.examType ?? "other",
      date: parsed.data.date,
      registration_deadline: parsed.data.registrationDeadline || null,
      location: parsed.data.location || null,
      status: parsed.data.status ?? "upcoming",
      notes: parsed.data.notes || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ exam: data }, { status: 201 });
}
