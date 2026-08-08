import { NextResponse } from "next/server";
import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { enforceRateLimit } from "@/lib/api/rate-limit-response";

const outreachSchema = z.object({
  studentName: z.string().min(1),
  targetField: z.string().min(1),
  facultyLastName: z.string().min(1),
  researchTopic: z.string().min(1),
  methodologyOrFinding: z.string().min(1),
  highSchoolName: z.string().min(1),
  specialization: z.string().min(1),
  advancedCourse: z.string().min(1),
  relevantCertification: z.string().min(1),
  term: z.string().min(1),
  hoursPerWeek: z.string().min(1),
});

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      {
        error:
          "ANTHROPIC_API_KEY isn't configured in this environment. The endpoint is fully wired — set the key and this starts generating for real.",
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
    `outreach:${user.id}`,
    20,
    60 * 60,
    "You've generated a lot of drafts in the last hour — try again shortly."
  );
  if (limited) return limited;

  const body = await request.json().catch(() => null);
  const parsed = outreachSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const f = parsed.data;

  try {
    const { text } = await generateText({
      model: anthropic("claude-sonnet-5"),
      system:
        "You write concise, professional cold-outreach emails from high school students to researchers, clinicians, or professionals, requesting shadowing or volunteer research opportunities. Keep it under 200 words, no flattery filler, one clear ask. Include a subject line as the first line.",
      prompt: `Write the email using these details:
Student name: ${f.studentName}
Target field: ${f.targetField}
Recipient last name: Dr. ${f.facultyLastName}
Specific research topic: ${f.researchTopic}
Specific methodology or finding to reference: ${f.methodologyOrFinding}
High school: ${f.highSchoolName}
Specialization track: ${f.specialization}
Advanced course completed: ${f.advancedCourse}
Relevant certification: ${f.relevantCertification}
Availability: ${f.term}, ${f.hoursPerWeek} hours/week`,
    });

    return NextResponse.json({ email: text });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Generation failed" },
      { status: 500 }
    );
  }
}
