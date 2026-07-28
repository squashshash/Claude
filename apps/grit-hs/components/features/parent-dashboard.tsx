"use client";

import { useEffect, useState } from "react";
import { Eye, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MilestoneMatrix } from "@/components/roadmap/milestone-matrix";
import { MOCK_STUDENT } from "@/lib/mock-data";
import { getRoadmapTemplate } from "@/lib/roadmap/templates";
import { deriveMilestoneStatus } from "@/lib/roadmap/derive-status";
import { useDashboardData } from "@/lib/hooks/use-dashboard-data";
import { CAREER_TRACK_LABELS, GRADE_LEVEL_LABELS } from "@/lib/constants";

type HoursCategory = "clinical" | "volunteer" | "shadowing";
interface DbHoursRow {
  category: HoursCategory;
  hours: number;
}

const SAMPLE_HOURS_TOTALS: Record<HoursCategory, number> = { clinical: 0, volunteer: 0, shadowing: 4 };

export function ParentDashboard() {
  const { data } = useDashboardData();
  const isReal = Boolean(data?.authenticated && data.profile && data.roadmap);
  const [hoursTotals, setHoursTotals] = useState<Record<HoursCategory, number>>(SAMPLE_HOURS_TOTALS);

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
  }, []);

  const fullName = isReal ? data!.profile!.full_name ?? "Student" : MOCK_STUDENT.fullName;
  const currentGrade = isReal
    ? data!.profile!.current_grade ?? MOCK_STUDENT.currentGrade
    : MOCK_STUDENT.currentGrade;
  const targetCareer = isReal
    ? data!.profile!.target_career ?? MOCK_STUDENT.targetCareer
    : MOCK_STUDENT.targetCareer;
  const xp = isReal ? data!.profile!.xp_points : MOCK_STUDENT.xpPoints;

  const template = getRoadmapTemplate(targetCareer);
  const statuses = template.milestones.map((m) =>
    deriveMilestoneStatus(m, currentGrade, MOCK_STUDENT.age, MOCK_STUDENT.state)
  );
  const completedCount = statuses.filter((s) => s === "completed").length;
  const overallPct = Math.round((completedCount / statuses.length) * 100);
  const totalHours = hoursTotals.clinical + hoursTotals.volunteer + hoursTotals.shadowing;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex items-start gap-3 p-4 text-sm text-muted-foreground">
          <Eye className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          Read-only. Nothing on this page can be edited from here — it mirrors what {fullName} sees,
          without any logging forms or upload controls.
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">{fullName}</h2>
          <p className="text-sm text-muted-foreground">
            {GRADE_LEVEL_LABELS[currentGrade]} &middot; {CAREER_TRACK_LABELS[targetCareer]}
          </p>
        </div>
        <Badge variant={isReal ? "default" : "locked"}>{isReal ? "Your data" : "Sample data"}</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Roadmap progress</CardDescription>
            <CardTitle className="text-2xl">{overallPct}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={overallPct} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>XP earned</CardDescription>
            <CardTitle className="text-2xl">{xp.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Milestones</CardDescription>
            <CardTitle className="text-2xl">
              {completedCount} / {statuses.length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Hours logged</CardDescription>
            <CardTitle className="text-2xl">{totalHours}h</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardContent className="flex items-start gap-3 p-4 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          Full 4-year roadmap, for context — same read-only view as the student&apos;s own Roadmap page.
        </CardContent>
      </Card>

      <MilestoneMatrix
        template={template}
        currentGrade={currentGrade}
        studentAge={MOCK_STUDENT.age}
        studentState={MOCK_STUDENT.state}
      />
    </div>
  );
}
