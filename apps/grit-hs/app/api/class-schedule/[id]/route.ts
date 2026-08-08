import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const patchSchema = z.object({
  courseName: z.string().min(1).optional(),
  daysOfWeek: z.string().nullable().optional(),
  startTime: z.string().nullable().optional(),
  endTime: z.string().nullable().optional(),
  room: z.string().nullable().optional(),
  teacherName: z.string().nullable().optional(),
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
    course_name?: string;
    days_of_week?: string | null;
    start_time?: string | null;
    end_time?: string | null;
    room?: string | null;
    teacher_name?: string | null;
  } = {};
  if (parsed.data.courseName !== undefined) updatePayload.course_name = parsed.data.courseName;
  if (parsed.data.daysOfWeek !== undefined) updatePayload.days_of_week = parsed.data.daysOfWeek;
  if (parsed.data.startTime !== undefined) updatePayload.start_time = parsed.data.startTime;
  if (parsed.data.endTime !== undefined) updatePayload.end_time = parsed.data.endTime;
  if (parsed.data.room !== undefined) updatePayload.room = parsed.data.room;
  if (parsed.data.teacherName !== undefined) updatePayload.teacher_name = parsed.data.teacherName;

  const { data, error } = await supabase
    .from("class_schedule")
    .update(updatePayload)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ class: data });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isConfigured()) return notConfigured();

  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { error } = await supabase.from("class_schedule").delete().eq("id", id).eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
