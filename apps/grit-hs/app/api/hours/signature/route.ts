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

// Persists the on-screen drawn signature (a canvas toDataURL() PNG, sent here
// as a Blob) so it survives past the current session — previously it was
// kept in React state only and thrown away on reload.
export async function POST(request: Request) {
  if (!isConfigured()) return notConfigured();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("signature");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "A signature image is required" }, { status: 400 });
  }

  const path = `${user.id}/${crypto.randomUUID()}.png`;
  const { error: uploadError } = await supabase.storage
    .from("hours-signatures")
    .upload(path, file, { contentType: file.type || "image/png" });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: signed } = await supabase.storage.from("hours-signatures").createSignedUrl(path, 3600);

  return NextResponse.json({ signaturePath: path, signedUrl: signed?.signedUrl ?? null }, { status: 201 });
}
