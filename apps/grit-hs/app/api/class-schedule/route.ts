import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const classSchema = z.object({
  courseName: z.string().min(1),
  daysOfWeek: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  room: z.string().optional(),
  teacherName: z.string().optional(),
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
    .from("class_schedule")
    .select("*")
    .eq("user_id", user.id)
    .order("start_time", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ classes: data });
}

export async function POST(request: Request) {
  if (!isConfigured()) return notConfigured();

  const body = await request.json().catch(() => null);
  const parsed = classSchema.safeParse(body);
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
    .from("class_schedule")
    .insert({
      user_id: user.id,
      course_name: parsed.data.courseName,
      days_of_week: parsed.data.daysOfWeek || null,
      start_time: parsed.data.startTime || null,
      end_time: parsed.data.endTime || null,
      room: parsed.data.room || null,
      teacher_name: parsed.data.teacherName || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ class: data }, { status: 201 });
}
