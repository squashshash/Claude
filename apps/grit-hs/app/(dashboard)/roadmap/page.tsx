"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MilestoneMatrix } from "@/components/roadmap/milestone-matrix";
import { SkillRadarChart } from "@/components/roadmap/skill-radar-chart";
import { SkillTree } from "@/components/roadmap/skill-tree";
import { getRoadmapTemplate } from "@/lib/roadmap/templates";
import { deriveMilestoneStatus } from "@/lib/roadmap/derive-status";
import { milestoneFromDb } from "@/lib/roadmap/from-db";
import { estimateAgeFromGrade } from "@/lib/roadmap/age-rules";
import { CAREER_TRACK_LABELS, MILESTONE_CATEGORIES, type MilestoneStatus } from "@/lib/constants";
import { MOCK_STUDENT } from "@/lib/mock-data";
import { useDashboardData } from "@/lib/hooks/use-dashboard-data";
import type { ResolvedMilestone } from "@/types/roadmap";

const RADAR_AXIS_LABELS: Record<(typeof MILESTONE_CATEGORIES)[number], string> = {
  academics: "Academics",
  certifications: "Certs",
  ctso: "CTSO",
  experience: "Hands-On",
};

export default function RoadmapPage() {
  const queryClient = useQueryClient();
  const { data } = useDashboardData();
  const isReal = Boolean(
    data?.authenticated && data.profile && data.roadmap && data.milestones?.length
  );

  const targetCareer = isReal ? data!.profile!.target_career ?? MOCK_STUDENT.targetCareer : MOCK_STUDENT.targetCareer;
  const currentGrade = isReal ? data!.profile!.current_grade ?? MOCK_STUDENT.currentGrade : MOCK_STUDENT.currentGrade;
  const studentAge = isReal ? estimateAgeFromGrade(currentGrade) : MOCK_STUDENT.age;
  const studentState = isReal ? data!.profile!.state ?? undefined : MOCK_STUDENT.state;

  const resolvedMilestones: ResolvedMilestone[] = isReal
    ? data!.milestones!.map((row) => ({ id: row.id, milestone: milestoneFromDb(row), status: row.status }))
    : getRoadmapTemplate(MOCK_STUDENT.targetCareer).milestones.map((m) => ({
        milestone: m,
        status: deriveMilestoneStatus(m, MOCK_STUDENT.currentGrade, MOCK_STUDENT.age, MOCK_STUDENT.state),
      }));

  const summary = getRoadmapTemplate(targetCareer).summary;

  const radarAxes = MILESTONE_CATEGORIES.map((category) => {
    const inCategory = resolvedMilestones.filter((m) => m.milestone.category === category);
    const completed = inCategory.filter((m) => m.status === "completed").length;
    return {
      label: RADAR_AXIS_LABELS[category],
      pct: inCategory.length ? Math.round((completed / inCategory.length) * 100) : 0,
    };
  });

  const handleToggleComplete = async (id: string, nextStatus: MilestoneStatus) => {
    const res = await fetch(`/api/milestones/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    if (res.ok) {
      await queryClient.invalidateQueries({ queryKey: ["dashboard-state"] });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">
            {CAREER_TRACK_LABELS[targetCareer]}
          </p>
          <h1 className="font-display text-4xl font-bold">4-Year Roadmap</h1>
          <p className="mt-2 max-w-2xl text-base text-muted-foreground">{summary}</p>
        </div>
        <Badge variant={isReal ? "default" : "locked"}>{isReal ? "Your data" : "Sample data"}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Skill tree</CardTitle>
          <CardDescription>
            Your roadmap as a tree — one branch per category, one node per milestone.{" "}
            {isReal ? "Click a node to mark it complete." : "Sample data is read-only."}
          </CardDescription>
        </CardHeader>
        <CardContent className="py-2">
          <SkillTree
            milestones={resolvedMilestones}
            onToggleComplete={isReal ? handleToggleComplete : undefined}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skill coverage</CardTitle>
          <CardDescription>
            Completed milestones by category, so far — a quick shape of where you&apos;re strong and
            where the next push should go.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-2">
          <SkillRadarChart axes={radarAxes} />
        </CardContent>
      </Card>

      <MilestoneMatrix
        milestones={resolvedMilestones}
        currentGrade={currentGrade}
        studentAge={studentAge}
        studentState={studentState}
        onToggleComplete={isReal ? handleToggleComplete : undefined}
      />
    </div>
  );
}
