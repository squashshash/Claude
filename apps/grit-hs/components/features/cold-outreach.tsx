"use client";

import { useState } from "react";
import { Copy, Check, Info, Sparkles, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MOCK_STUDENT } from "@/lib/mock-data";
import { CAREER_TRACK_LABELS } from "@/lib/constants";

interface FormState {
  studentName: string;
  targetField: string;
  facultyLastName: string;
  researchTopic: string;
  methodologyOrFinding: string;
  highSchoolName: string;
  advancedCourse: string;
  relevantCertification: string;
  term: string;
  hoursPerWeek: string;
}

const DEFAULTS: FormState = {
  studentName: MOCK_STUDENT.fullName,
  targetField: "Cardiology",
  facultyLastName: "Whitfield",
  researchTopic: "early-detection biomarkers in adolescent cardiology",
  methodologyOrFinding: "the wearable ECG cohort study",
  highSchoolName: "Central High School",
  advancedCourse: "AP Chemistry",
  relevantCertification: "NHA Certified Phlebotomy Technician (CPT) prep",
  term: "this summer",
  hoursPerWeek: "6",
};

function buildEmail(f: FormState, specialization: string) {
  return `SUBJECT: High School Research Assistantship Request - ${f.studentName} / ${f.targetField} Lab

Dear Dr. ${f.facultyLastName},

I have been following your laboratory's recent work on ${f.researchTopic}, particularly your recent findings regarding ${f.methodologyOrFinding}.

As a student at ${f.highSchoolName} specializing in ${specialization}, I have completed coursework in ${f.advancedCourse} and earned my ${f.relevantCertification}.

I am writing to inquire about potential volunteer research assistant opportunities in your laboratory during ${f.term}. I can commit ${f.hoursPerWeek} hours per week and am prepared to assist with baseline data entry, literature compilation, or basic lab protocols.

My verified technical portfolio and academic transcript are linked below for your review.

Sincerely,
${f.studentName}
[Link to Digital Credential Vault Portfolio]`;
}

const FIELD_LABELS: Record<keyof FormState, string> = {
  studentName: "Your name",
  targetField: "Target field (e.g. Cardiology)",
  facultyLastName: "Faculty/director last name",
  researchTopic: "Specific research topic",
  methodologyOrFinding: "Specific methodology or finding",
  highSchoolName: "High school name",
  advancedCourse: "Advanced course you've completed",
  relevantCertification: "Relevant certification",
  term: "Term (e.g. this summer)",
  hoursPerWeek: "Hours per week you can commit",
};

export function ColdOutreach() {
  const [form, setForm] = useState<FormState>(DEFAULTS);
  const [copied, setCopied] = useState(false);
  const [aiEmail, setAiEmail] = useState<string | null>(null);
  const [aiNotice, setAiNotice] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const specialization = CAREER_TRACK_LABELS[MOCK_STUDENT.targetCareer];
  const templateEmail = buildEmail(form, specialization);
  const email = aiEmail ?? templateEmail;

  const copy = async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const generateWithAi = async () => {
    setGenerating(true);
    setAiNotice(null);
    try {
      const res = await fetch("/api/outreach/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, specialization }),
      });
      const body = await res.json();
      if (!res.ok) {
        setAiNotice(body.error ?? "AI generation isn't available right now — showing the template version.");
        return;
      }
      setAiEmail(body.email);
    } catch {
      setAiNotice("Couldn't reach the AI endpoint — showing the template version.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex items-start gap-3 p-4 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          The template below is a real mail-merge, no model call. &quot;Generate with AI&quot; hits a
          live endpoint (Vercel AI SDK + Claude) — it&apos;ll say so plainly if no API key is
          configured yet rather than fake a result.
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="flex flex-col gap-3 p-5">
            {(Object.keys(FIELD_LABELS) as (keyof FormState)[]).map((key) => (
              <label key={key} className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-muted-foreground">{FIELD_LABELS[key]}</span>
                <input
                  value={form[key]}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, [key]: e.target.value }));
                    setAiEmail(null);
                  }}
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </label>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-3 p-5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                {aiEmail ? "AI-generated email" : "Template email"}
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="gap-2" onClick={generateWithAi} disabled={generating}>
                  {generating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                  Generate with AI
                </Button>
                <Button size="sm" variant="outline" className="gap-2" onClick={copy}>
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>
            {aiNotice && <p className="text-sm text-muted-foreground">{aiNotice}</p>}
            <pre className="whitespace-pre-wrap rounded-md bg-muted/60 p-4 font-sans text-sm leading-relaxed">
              {email}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
