import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ configured: false, authenticated: false });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ configured: true, authenticated: false });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: roadmap } = await supabase
    .from("roadmaps")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: milestones } = roadmap
    ? await supabase
        .from("milestones")
        .select("*")
        .eq("roadmap_id", roadmap.id)
        .order("sort_order", { ascending: true })
    : { data: [] };

  return NextResponse.json({
    configured: true,
    authenticated: true,
    profile,
    roadmap,
    milestones: milestones ?? [],
  });
}
