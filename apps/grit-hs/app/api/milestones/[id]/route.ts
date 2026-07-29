import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { MILESTONE_STATUSES, MILESTONE_XP_AWARD } from "@/lib/constants";

const patchSchema = z.object({
  status: z.enum(MILESTONE_STATUSES),
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

  const { data: existing, error: existingError } = await supabase
    .from("milestones")
    .select("id, status")
    .eq("id", id)
    .maybeSingle();

  if (existingError) return NextResponse.json({ error: existingError.message }, { status: 500 });
  if (!existing) return NextResponse.json({ error: "Milestone not found" }, { status: 404 });

  const wasCompleted = existing.status === "completed";
  const willBeCompleted = parsed.data.status === "completed";

  const { data: updated, error: updateError } = await supabase
    .from("milestones")
    .update({ status: parsed.data.status })
    .eq("id", id)
    .select()
    .single();

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  if (wasCompleted !== willBeCompleted) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("xp_points")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profile) {
      const delta = willBeCompleted ? MILESTONE_XP_AWARD : -MILESTONE_XP_AWARD;
      const nextXp = Math.max(0, profile.xp_points + delta);
      await supabase.from("profiles").update({ xp_points: nextXp }).eq("user_id", user.id);
    }
  }

  return NextResponse.json({ milestone: updated });
}
