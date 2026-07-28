"use client";

import { useEffect, useState } from "react";
import { Printer, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_STUDENT } from "@/lib/mock-data";
import { getRoadmapTemplate } from "@/lib/roadmap/templates";
import { deriveMilestoneStatus } from "@/lib/roadmap/derive-status";
import { milestoneFromDb } from "@/lib/roadmap/from-db";
import { useDashboardData } from "@/lib/hooks/use-dashboard-data";
import {
  CAREER_TRACK_LABELS,
  GRADE_LEVEL_LABELS,
  MILESTONE_CATEGORY_LABELS,
  MILESTONE_CATEGORIES,
} from "@/lib/constants";

type HoursCategory = "clinical" | "volunteer" | "shadowing";

interface DbHoursRow {
  category: HoursCategory;
  hours: number;
}

interface DbCredentialRow {
  cert_name: string;
  issue_date: string | null;
}

// Mirrors the Hours Logger's own sample seed so the numbers agree if a
// counselor cross-checks both pages in the same demo session.
const SAMPLE_HOURS_TOTALS: Record<HoursCategory, number> = { clinical: 0, volunteer: 0, shadowing: 4 };
const SAMPLE_CREDENTIALS: { certName: string }[] = [];

export function CounselorExport() {
  const { data } = useDashboardData();
  const isReal = Boolean(data?.authenticated && data.profile && data.roadmap);

  const [hoursTotals, setHoursTotals] = useState<Record<HoursCategory, number>>(SAMPLE_HOURS_TOTALS);
  const [credentials, setCredentials] = useState<{ certName: string }[]>(SAMPLE_CREDENTIALS);

  useEffect(() => {
    fetch("/api/hours")
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => {
        if (!body?.entries) return;
        const totals: Record<HoursCategory, number> = { clinical: 0, volunteer: 0, shadowing: 0 };
        for (const row of body.entries as DbHoursRow[]) totals[row.category] += Number(row.hours);
        setHoursTotals(totals);
      })
      .catch(() => {});

    fetch("/api/credentials")
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => {
        if (!body?.credentials) return;
        setCredentials(
          (body.credentials as DbCredentialRow[]).map((row) => ({ certName: row.cert_name }))
        );
      })
      .catch(() => {});
  }, []);

  const fullName = isReal ? data!.profile!.full_name ?? "Student" : MOCK_STUDENT.fullName;
  const currentGrade = isReal
    ? data!.profile!.current_grade ?? MOCK_STUDENT.currentGrade
    : MOCK_STUDENT.currentGrade;
  const targetCareer = isReal
    ? data!.profile!.target_career ?? MOCK_STUDENT.targetCareer
    : MOCK_STUDENT.targetCareer;
  const xp = isReal ? data!.profile!.xp_points : MOCK_STUDENT.xpPoints;

  const allMilestones = isReal
    ? data!.milestones!.map(milestoneFromDb)
    : getRoadmapTemplate(MOCK_STUDENT.targetCareer).milestones.map((m) => ({
        ...m,
        status: deriveMilestoneStatus(m, MOCK_STUDENT.currentGrade, MOCK_STUDENT.age, MOCK_STUDENT.state),
      }));

  const completed = allMilestones.filter((m) => m.status === "completed");
  const overallPct = Math.round((completed.length / allMilestones.length) * 100);
  const totalHours = hoursTotals.clinical + hoursTotals.volunteer + hoursTotals.shadowing;
  const generatedOn = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Print-only one-pager — everything else below is print:hidden */}
      <div className="hidden print:block">
        <h1 className="text-2xl font-bold">{fullName} — Advisor Summary</h1>
        <p className="mt-1 text-sm">
          {GRADE_LEVEL_LABELS[currentGrade]} &middot; {CAREER_TRACK_LABELS[targetCareer]} Track &middot;
          Generated {generatedOn}
        </p>
        <p className="mt-3 text-sm">
          Roadmap progress: {overallPct}% ({completed.length}/{allMilestones.length} milestones) &middot;
          XP: {xp} &middot; Hours logged: {totalHours}h (Clinical {hoursTotals.clinical}h, Volunteer{" "}
          {hoursTotals.volunteer}h, Shadowing {hoursTotals.shadowing}h) &middot; Credentials on file:{" "}
          {credentials.length}
        </p>

        {MILESTONE_CATEGORIES.map((category) => {
          const items = completed.filter((m) => m.category === category);
          if (items.length === 0) return null;
          return (
            <div key={category} className="mt-4">
              <h2 className="text-base font-bold uppercase tracking-wide">
                {MILESTONE_CATEGORY_LABELS[category]}
              </h2>
              <ul className="mt-1 list-disc pl-5 text-sm">
                {items.map((m) => (
                  <li key={m.title}>{m.title}</li>
                ))}
              </ul>
            </div>
          );
        })}

        {credentials.length > 0 && (
          <div className="mt-4">
            <h2 className="text-base font-bold uppercase tracking-wide">Credentials on file</h2>
            <ul className="mt-1 list-disc pl-5 text-sm">
              {credentials.map((c) => (
                <li key={c.certName}>{c.certName}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <Card className="print:hidden">
        <CardContent className="flex items-start gap-3 p-4 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          One printable page combining roadmap progress, logged hours, and credentials on file — meant
          to hand to a counselor or advisor for an endorsement letter or recommendation.
        </CardContent>
      </Card>

      <div className="flex items-center gap-3 print:hidden">
        <Badge variant={isReal ? "default" : "locked"}>{isReal ? "Your data" : "Sample data"}</Badge>
        <Button size="sm" className="gap-2" onClick={() => window.print()}>
          <Printer className="h-3.5 w-3.5" /> Print / Save as PDF
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-4 print:hidden">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Roadmap progress</p>
            <p className="font-display text-2xl font-bold">{overallPct}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">XP</p>
            <p className="font-display text-2xl font-bold">{xp.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Hours logged</p>
            <p className="font-display text-2xl font-bold">{totalHours}h</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Credentials</p>
            <p className="font-display text-2xl font-bold">{credentials.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="print:hidden">
        <CardContent className="flex flex-col gap-4 p-5">
          {MILESTONE_CATEGORIES.map((category) => {
            const items = completed.filter((m) => m.category === category);
            if (items.length === 0) return null;
            return (
              <div key={category}>
                <p className="font-display text-sm font-bold uppercase tracking-wide text-primary">
                  {MILESTONE_CATEGORY_LABELS[category]}
                </p>
                <ul className="mt-1 list-disc pl-5 text-sm text-muted-foreground">
                  {items.map((m) => (
                    <li key={m.title}>{m.title}</li>
                  ))}
                </ul>
              </div>
            );
          })}
          {completed.length === 0 && (
            <p className="text-sm text-muted-foreground">No completed milestones yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
