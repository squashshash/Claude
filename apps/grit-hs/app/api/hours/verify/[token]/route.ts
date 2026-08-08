import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { enforceRateLimit } from "@/lib/api/rate-limit-response";
import { clientIp } from "@/lib/rate-limit";

function isConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function notConfigured() {
  return NextResponse.json(
    { error: "No Supabase project is configured in this environment." },
    { status: 501 }
  );
}

async function findEntry(token: string) {
  const supabase = createAdminClient();
  return supabase.from("hours_logged").select("*").eq("verification_token", token).maybeSingle();
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  if (!isConfigured()) return notConfigured();

  // Unauthenticated: the token is a UUID so guessing is impractical, but cap
  // per-IP anyway so the endpoint can't be used to probe for valid tokens.
  const limited = enforceRateLimit(`hours-verify:${clientIp(request)}`, 30, 60);
  if (limited) return limited;

  const { token } = await params;
  const { data, error } = await findEntry(token);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Verification link not found" }, { status: 404 });

  return NextResponse.json({
    entry: {
      category: data.category,
      supervisorName: data.supervisor_name,
      hours: data.hours,
      date: data.date,
      status: data.status,
    },
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  if (!isConfigured()) return notConfigured();

  const limited = enforceRateLimit(`hours-verify-post:${clientIp(request)}`, 15, 60);
  if (limited) return limited;

  const { token } = await params;
  const { data: entry, error: lookupError } = await findEntry(token);

  if (lookupError) return NextResponse.json({ error: lookupError.message }, { status: 500 });
  if (!entry) return NextResponse.json({ error: "Verification link not found" }, { status: 404 });

  if (entry.status === "verified") {
    return NextResponse.json({ alreadyVerified: true });
  }

  const supabase = createAdminClient();
  const { error: updateError } = await supabase
    .from("hours_logged")
    .update({ status: "verified", verified_at: new Date().toISOString() })
    .eq("verification_token", token);

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({ alreadyVerified: false });
}
