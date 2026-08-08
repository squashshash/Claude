"use client";

import { getRoadmapTemplate } from "@/lib/roadmap/templates";
import { deriveMilestoneStatus } from "@/lib/roadmap/derive-status";
import { milestoneFromDb } from "@/lib/roadmap/from-db";
import { CAREER_TRACK_LABELS, GRADE_LEVEL_LABELS, MILESTONE_CATEGORY_LABELS } from "@/lib/constants";
import { MOCK_STUDENT } from "@/lib/mock-data";
import { useDashboardData } from "@/lib/hooks/use-dashboard-data";
import { identityTitle } from "@/lib/gamification/titles";
import { Badge } from "@/components/ui/badge";
import { FocusModeToggle, type NextUpItem } from "@/components/dashboard/focus-mode";
import { Reminders } from "@/components/dashboard/reminders";
import { AchievementFeed } from "@/components/dashboard/achievement-feed";

export default function DashboardPage() {
  const { data } = useDashboardData();
  const isReal = Boolean(
    data?.authenticated && data.profile && data.roadmap && data.milestones?.length
  );

  let fullName: string;
  let currentGrade: keyof typeof GRADE_LEVEL_LABELS;
  let targetCareer: keyof typeof CAREER_TRACK_LABELS;
  let xp: number;
  let completed: number;
  let total: number;
  let nextUp: NextUpItem[];
  let incompleteThisGrade: number;
  let portfolioPublic: boolean | undefined;

  if (isReal) {
    const profile = data!.profile!;
    const milestones = data!.milestones!.map(milestoneFromDb);
    fullName = profile.full_name ?? "Student";
    currentGrade = profile.current_grade ?? MOCK_STUDENT.currentGrade;
    targetCareer = profile.target_career ?? MOCK_STUDENT.targetCareer;
    xp = profile.xp_points;
    completed = milestones.filter((m) => m.status === "completed").length;
    total = milestones.length;
    nextUp = milestones
      .filter((m) => m.status === "in_progress" || m.status === "not_started")
      .slice(0, 2)
      .map((m) => ({
        title: m.title,
        description: m.description,
        category: MILESTONE_CATEGORY_LABELS[m.category],
      }));
    incompleteThisGrade = milestones.filter(
      (m) => m.gradeLevel === currentGrade && m.status !== "completed" && m.status !== "locked"
    ).length;
    portfolioPublic = profile.portfolio_public;
  } else {
    const template = getRoadmapTemplate(MOCK_STUDENT.targetCareer);
    const withStatus = template.milestones.map((m) => ({
      milestone: m,
      status: deriveMilestoneStatus(m, MOCK_STUDENT.currentGrade, MOCK_STUDENT.age, MOCK_STUDENT.state),
    }));
    fullName = MOCK_STUDENT.fullName;
    currentGrade = MOCK_STUDENT.currentGrade;
    targetCareer = MOCK_STUDENT.targetCareer;
    xp = MOCK_STUDENT.xpPoints;
    completed = withStatus.filter((m) => m.status === "completed").length;
    total = withStatus.length;
    nextUp = withStatus
      .filter((m) => m.status === "in_progress" || m.status === "not_started")
      .slice(0, 2)
      .map(({ milestone }) => ({
        title: milestone.title,
        description: milestone.description,
        category: MILESTONE_CATEGORY_LABELS[milestone.category],
      }));
    incompleteThisGrade = withStatus.filter(
      (m) => m.milestone.gradeLevel === currentGrade && m.status !== "completed" && m.status !== "locked"
    ).length;
    portfolioPublic = undefined;
  }

  const overallPct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="font-display text-4xl font-bold">
            Welcome back, {fullName.split(" ")[0]}
          </h1>
          <p className="mt-1 font-display text-sm font-bold uppercase tracking-wide text-accent">
            {identityTitle(targetCareer, currentGrade)}
          </p>
          <p className="mt-2 text-base text-muted-foreground">
            {GRADE_LEVEL_LABELS[currentGrade]} &middot; {CAREER_TRACK_LABELS[targetCareer]}
          </p>
        </div>
        <Badge variant={isReal ? "default" : "locked"}>{isReal ? "Your data" : "Sample data"}</Badge>
      </div>

      <FocusModeToggle
        overallPct={overallPct}
        xp={xp}
        completed={completed}
        total={total}
        nextUp={nextUp}
      />

      <Reminders
        isReal={isReal}
        targetCareer={targetCareer}
        currentGrade={currentGrade}
        incompleteCount={incompleteThisGrade}
        portfolioPublic={portfolioPublic}
      />

      <AchievementFeed />
    </div>
  );
}
