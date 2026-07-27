import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
    .from("user_credentials")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const withUrls = await Promise.all(
    (data ?? []).map(async (row) => {
      if (!row.document_url) return { ...row, signedUrl: null };
      const { data: signed } = await supabase.storage
        .from("credentials")
        .createSignedUrl(row.document_url, 3600);
      return { ...row, signedUrl: signed?.signedUrl ?? null };
    })
  );

  return NextResponse.json({ credentials: withUrls });
}

export async function POST(request: Request) {
  if (!isConfigured()) return notConfigured();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file");
  const certName = formData.get("certName");
  const issueDate = formData.get("issueDate");

  if (!(file instanceof File) || typeof certName !== "string" || !certName) {
    return NextResponse.json({ error: "A file and credential name are required" }, { status: 400 });
  }

  const path = `${user.id}/${crypto.randomUUID()}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from("credentials")
    .upload(path, file, { contentType: file.type || undefined });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("user_credentials")
    .insert({
      user_id: user.id,
      cert_name: certName,
      issue_date: typeof issueDate === "string" && issueDate ? issueDate : null,
      document_url: path,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: signed } = await supabase.storage.from("credentials").createSignedUrl(path, 3600);

  return NextResponse.json(
    { credential: { ...data, signedUrl: signed?.signedUrl ?? null } },
    { status: 201 }
  );
}

export async function PATCH(request: Request) {
  if (!isConfigured()) return notConfigured();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body?.id || typeof body.isPublic !== "boolean") {
    return NextResponse.json({ error: "id and isPublic are required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("user_credentials")
    .update({ is_public: body.isPublic })
    .eq("id", body.id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ credential: data });
}
