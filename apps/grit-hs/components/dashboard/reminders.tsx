"use client";

import { useEffect, useState } from "react";
import { Bell, Clock, ListChecks, UploadCloud, Link2, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { CareerTrack, GradeLevel } from "@/lib/constants";

// Deliberately structural, evergreen facts about how each track's key exams
// actually work — not specific calendar dates, which would go stale. Where a
// program has a fixed annual window (AP exams), that's stated as a season,
// not a date, with a pointer to the real source for this year's exact one.
//
// Partial, not a full Record — only populated where a specific, verified
// exam-window fact is known. Every other track gets GENERIC_GUIDANCE rather
// than a fabricated claim about a specific certification's testing schedule.
const TRACK_GUIDANCE: Partial<Record<CareerTrack, string>> = {
  pre_med_clinical_healthcare:
    "AP Biology/Chemistry exams run in early May every year, with registration usually opening the previous fall through your school. Ask your AP coordinator for this year's exact registration deadline.",
  nursing_advanced_practice:
    "AP Biology exams run in early May every year, with registration usually opening the previous fall through your school. Ask your AP coordinator for this year's exact registration deadline.",
  software_engineering:
    "CompTIA and AWS certification exams are computer-based and available on-demand year-round via Pearson VUE — no fixed test window, so you can schedule one as soon as you're ready.",
  financial_engineering:
    "The FINRA SIE exam has no fixed test window — it's available on-demand once you're eligible. Many students aim to sit for it right around their 18th birthday.",
  mechanical_engineering_cad:
    "SOLIDWORKS certification exams (CSWA/CSWP) are on-demand via Certiport testing centers — no fixed annual date, schedule whenever your modeling skills are ready.",
  law_public_policy:
    "Mock Trial and Moot Court seasons typically run fall through spring — check your CTSO or school's own calendar for this year's exact competition dates.",
  cybersecurity:
    "CompTIA Security+ exams are computer-based and available on-demand year-round via Pearson VUE — no fixed test window, so you can schedule one as soon as you're ready.",
};

const GENERIC_GUIDANCE =
  "Check with your school counselor or CTSO advisor for this year's exact deadlines and testing windows for your track's key milestones.";

interface RemindersProps {
  isReal: boolean;
  targetCareer: CareerTrack;
  currentGrade: GradeLevel;
  incompleteCount: number;
  portfolioPublic?: boolean;
}

export function Reminders({
  isReal,
  targetCareer,
  currentGrade,
  incompleteCount,
  portfolioPublic,
}: RemindersProps) {
  const [daysSinceHours, setDaysSinceHours] = useState<number | null>(null);
  const [credentialCount, setCredentialCount] = useState<number | null>(null);

  useEffect(() => {
    if (!isReal) return;
    fetch("/api/hours")
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => {
        const entries: { date: string }[] = body?.entries ?? [];
        if (entries.length === 0) {
          setDaysSinceHours(Infinity);
          return;
        }
        const mostRecent = entries.reduce((latest, e) => (e.date > latest ? e.date : latest), entries[0].date);
        const days = Math.floor((Date.now() - new Date(mostRecent).getTime()) / (1000 * 60 * 60 * 24));
        setDaysSinceHours(days);
      })
      .catch(() => {});

    fetch("/api/credentials")
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => setCredentialCount(body?.credentials?.length ?? null))
      .catch(() => {});
  }, [isReal]);

  const nudges: { id: string; icon: typeof Bell; text: string }[] = [];

  if (isReal) {
    if (incompleteCount > 0) {
      nudges.push({
        id: "milestones",
        icon: ListChecks,
        text: `You have ${incompleteCount} milestone${incompleteCount === 1 ? "" : "s"} not yet complete for your current grade — check the Skill Tree on your Roadmap.`,
      });
    }
    if (daysSinceHours !== null && daysSinceHours > 7) {
      nudges.push({
        id: "hours",
        icon: Clock,
        text:
          daysSinceHours === Infinity
            ? "You haven't logged any hours yet — log your first entry from the panel on the right."
            : `It's been ${daysSinceHours} days since you last logged hours.`,
      });
    }
    if (credentialCount === 0) {
      nudges.push({
        id: "credentials",
        icon: UploadCloud,
        text: "Your Credential Vault is empty — upload your first certificate or license.",
      });
    }
    if (portfolioPublic === false) {
      nudges.push({
        id: "portfolio",
        icon: Link2,
        text: "Your portfolio isn't public yet — set a handle to appear on the Track Leaderboard and share it with recruiters.",
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-4 w-4" aria-hidden="true" /> Reminders
        </CardTitle>
        <CardDescription>
          {currentGrade ? "Based on your real activity, plus what's worth knowing for your track." : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {nudges.map((n) => (
          <div key={n.id} className="flex items-start gap-3 rounded-md bg-muted/60 p-3 text-sm">
            <n.icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            <span>{n.text}</span>
          </div>
        ))}
        <div className="flex items-start gap-3 rounded-md border border-accent/40 bg-accent/10 p-3 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          <span>{TRACK_GUIDANCE[targetCareer] ?? GENERIC_GUIDANCE}</span>
        </div>
        {nudges.length === 0 && isReal && (
          <p className="text-sm text-muted-foreground">You&apos;re caught up — nothing urgent right now.</p>
        )}
      </CardContent>
    </Card>
  );
}
