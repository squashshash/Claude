import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const PRIORITIES = ["low", "medium", "high"] as const;

const patchSchema = z.object({
  title: z.string().min(1).optional(),
  dueDate: z.string().min(1).optional(),
  dueTime: z.string().nullable().optional(),
  course: z.string().nullable().optional(),
  priority: z.enum(PRIORITIES).optional(),
  completed: z.boolean().optional(),
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
    title?: string;
    due_date?: string;
    due_time?: string | null;
    course?: string | null;
    priority?: (typeof PRIORITIES)[number];
    completed?: boolean;
    notes?: string | null;
  } = {};
  if (parsed.data.title !== undefined) updatePayload.title = parsed.data.title;
  if (parsed.data.dueDate !== undefined) updatePayload.due_date = parsed.data.dueDate;
  if (parsed.data.dueTime !== undefined) updatePayload.due_time = parsed.data.dueTime;
  if (parsed.data.course !== undefined) updatePayload.course = parsed.data.course;
  if (parsed.data.priority !== undefined) updatePayload.priority = parsed.data.priority;
  if (parsed.data.completed !== undefined) updatePayload.completed = parsed.data.completed;
  if (parsed.data.notes !== undefined) updatePayload.notes = parsed.data.notes;

  const { data, error } = await supabase
    .from("reminders")
    .update(updatePayload)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ reminder: data });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isConfigured()) return notConfigured();

  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { error } = await supabase.from("reminders").delete().eq("id", id).eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
