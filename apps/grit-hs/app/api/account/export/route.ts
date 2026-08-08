import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function isConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function GET() {
  if (!isConfigured()) {
    return NextResponse.json(
      { error: "No Supabase project is configured in this environment." },
      { status: 501 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const [
    profile,
    roadmaps,
    hours,
    credentials,
    achievements,
    clubs,
    sports,
    exams,
    schedule,
    reminders,
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("roadmaps").select("*").eq("user_id", user.id),
    supabase.from("hours_logged").select("*").eq("user_id", user.id),
    supabase.from("user_credentials").select("*").eq("user_id", user.id),
    supabase.from("achievement_posts").select("*").eq("user_id", user.id),
    supabase.from("clubs").select("*").eq("user_id", user.id),
    supabase.from("sports").select("*").eq("user_id", user.id),
    supabase.from("exams").select("*").eq("user_id", user.id),
    supabase.from("class_schedule").select("*").eq("user_id", user.id),
    supabase.from("reminders").select("*").eq("user_id", user.id),
  ]);

  const roadmapIds = (roadmaps.data ?? []).map((r) => r.id);
  const { data: milestones } = roadmapIds.length
    ? await supabase.from("milestones").select("*").in("roadmap_id", roadmapIds)
    : { data: [] };

  const payload = {
    exportedAt: new Date().toISOString(),
    account: {
      id: user.id,
      email: user.email,
      createdAt: user.created_at,
    },
    profile: profile.data ?? null,
    roadmaps: roadmaps.data ?? [],
    milestones: milestones ?? [],
    hoursLogged: hours.data ?? [],
    credentials: credentials.data ?? [],
    achievementPosts: achievements.data ?? [],
    clubs: clubs.data ?? [],
    sports: sports.data ?? [],
    exams: exams.data ?? [],
    classSchedule: schedule.data ?? [],
    reminders: reminders.data ?? [],
    note: "Uploaded files (signatures, scanned forms, credential documents) are referenced by path in the records above. Download them individually from the app before deleting your account.",
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="grit-data-export-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}
