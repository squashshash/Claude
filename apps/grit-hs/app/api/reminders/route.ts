import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const PRIORITIES = ["low", "medium", "high"] as const;

const reminderSchema = z.object({
  title: z.string().min(1),
  dueDate: z.string().min(1),
  dueTime: z.string().optional(),
  course: z.string().optional(),
  priority: z.enum(PRIORITIES).optional(),
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
    .from("reminders")
    .select("*")
    .eq("user_id", user.id)
    .order("due_date", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ reminders: data });
}

export async function POST(request: Request) {
  if (!isConfigured()) return notConfigured();

  const body = await request.json().catch(() => null);
  const parsed = reminderSchema.safeParse(body);
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
    .from("reminders")
    .insert({
      user_id: user.id,
      title: parsed.data.title,
      due_date: parsed.data.dueDate,
      due_time: parsed.data.dueTime || null,
      course: parsed.data.course || null,
      priority: parsed.data.priority ?? "medium",
      notes: parsed.data.notes || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ reminder: data }, { status: 201 });
}
