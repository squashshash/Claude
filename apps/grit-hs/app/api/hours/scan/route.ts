import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { enforceRateLimit } from "@/lib/api/rate-limit-response";

function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

function notConfigured() {
  return NextResponse.json(
    { error: "No Supabase project is configured in this environment." },
    { status: 501 }
  );
}

// Extracted fields are always returned for the student to review/edit before
// they're ever submitted to /api/hours — a guess this route makes is never
// silently trusted, same anti-fabrication discipline the rest of the app
// applies to real-world data it can't independently verify.
const extractionSchema = z.object({
  supervisorName: z.string().nullable().describe("The supervisor's printed or signed name, if legible"),
  hours: z.number().nullable().describe("The number of hours logged on the form, if present"),
  date: z.string().nullable().describe("The date on the form in YYYY-MM-DD format, if present"),
  notes: z.string().nullable().describe("Any brief activity description written on the form"),
});

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) return notConfigured();

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      {
        error:
          "ANTHROPIC_API_KEY isn't configured in this environment. The endpoint is fully wired — set the key and this starts reading forms for real.",
      },
      { status: 501 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const limited = enforceRateLimit(
    `hours-scan:${user.id}`,
    10,
    60 * 60,
    "You've scanned a lot of forms in the last hour — take a break and try again shortly."
  );
  if (limited) return limited;

  const formData = await request.formData();
  const file = formData.get("photo");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "A photo of the signed form is required" }, { status: 400 });
  }

  const path = `${user.id}/${crypto.randomUUID()}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from("hours-scans")
    .upload(path, file, { contentType: file.type || undefined });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: signed } = await supabase.storage.from("hours-scans").createSignedUrl(path, 3600);

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");

    const { object } = await generateObject({
      model: anthropic("claude-sonnet-5"),
      schema: extractionSchema,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "This is a photographed volunteer/clinical hours verification form, signed by a supervisor. Extract the supervisor's name, the number of hours logged, the date, and any brief activity notes. Use null for any field you can't confidently read — never guess a value you aren't reasonably sure of.",
            },
            { type: "file", mediaType: file.type || "image/jpeg", data: base64 },
          ],
        },
      ],
    });

    return NextResponse.json({
      scannedDocPath: path,
      signedUrl: signed?.signedUrl ?? null,
      extracted: object,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Scan reading failed",
        scannedDocPath: path,
        signedUrl: signed?.signedUrl ?? null,
        extracted: null,
      },
      { status: 500 }
    );
  }
}
