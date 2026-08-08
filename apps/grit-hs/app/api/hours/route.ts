import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const hoursEntrySchema = z.object({
  category: z.enum(["clinical", "volunteer", "shadowing"]),
  supervisorName: z.string().min(1),
  supervisorEmail: z.string().email().optional().or(z.literal("")),
  hours: z.number().positive(),
  date: z.string().min(1),
  notes: z.string().optional(),
  signaturePath: z.string().optional(),
  scannedDocPath: z.string().optional(),
});

function notConfigured() {
  return NextResponse.json(
    { error: "No Supabase project is configured in this environment." },
    { status: 501 }
  );
}

function isConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function GET() {
  if (!isConfigured()) return notConfigured();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { data, error } = await supabase
    .from("hours_logged")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const withUrls = await Promise.all(
    (data ?? []).map(async (row) => {
      const [signatureUrl, scannedDocUrl] = await Promise.all([
        row.signature_path
          ? supabase.storage.from("hours-signatures").createSignedUrl(row.signature_path, 3600)
          : Promise.resolve({ data: null }),
        row.scanned_doc_path
          ? supabase.storage.from("hours-scans").createSignedUrl(row.scanned_doc_path, 3600)
          : Promise.resolve({ data: null }),
      ]);
      return {
        ...row,
        signatureUrl: signatureUrl.data?.signedUrl ?? null,
        scannedDocUrl: scannedDocUrl.data?.signedUrl ?? null,
      };
    })
  );

  return NextResponse.json({ entries: withUrls });
}

export async function POST(request: Request) {
  if (!isConfigured()) return notConfigured();

  const body = await request.json().catch(() => null);
  const parsed = hoursEntrySchema.safeParse(body);
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
    .from("hours_logged")
    .insert({
      user_id: user.id,
      category: parsed.data.category,
      supervisor_name: parsed.data.supervisorName,
      supervisor_email: parsed.data.supervisorEmail || "",
      hours: parsed.data.hours,
      date: parsed.data.date,
      notes: parsed.data.notes ?? null,
      signature_path: parsed.data.signaturePath ?? null,
      signature_captured_at: parsed.data.signaturePath ? new Date().toISOString() : null,
      scanned_doc_path: parsed.data.scannedDocPath ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ entry: data }, { status: 201 });
}
