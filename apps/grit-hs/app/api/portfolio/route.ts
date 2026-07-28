import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const HANDLE_PATTERN = /^[a-z0-9](?:[a-z0-9-]{1,28}[a-z0-9])?$/;

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
    .from("profiles")
    .select("handle, portfolio_public")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ handle: data?.handle ?? null, portfolioPublic: data?.portfolio_public ?? false });
}

export async function PATCH(request: Request) {
  if (!isConfigured()) return notConfigured();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (typeof body?.portfolioPublic !== "boolean") {
    return NextResponse.json({ error: "portfolioPublic (boolean) is required" }, { status: 400 });
  }

  let handle: string | undefined;
  if (body.portfolioPublic) {
    if (typeof body.handle !== "string" || !HANDLE_PATTERN.test(body.handle.toLowerCase())) {
      return NextResponse.json(
        { error: "Handle must be 3-30 lowercase letters, numbers, or hyphens." },
        { status: 400 }
      );
    }
    handle = body.handle.toLowerCase();
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ portfolio_public: body.portfolioPublic, ...(handle ? { handle } : {}) })
    .eq("user_id", user.id)
    .select("handle, portfolio_public")
    .single();

  if (error) {
    const message = error.code === "23505" ? "That handle is already taken." : error.message;
    return NextResponse.json({ error: message }, { status: error.code === "23505" ? 409 : 500 });
  }

  return NextResponse.json({ handle: data.handle, portfolioPublic: data.portfolio_public });
}
