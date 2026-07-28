import { getRoadmapTemplate } from "@/lib/roadmap/templates";
import { deriveMilestoneStatus } from "@/lib/roadmap/derive-status";
import { CAREER_TRACK_LABELS, GRADE_LEVEL_LABELS, MILESTONE_CATEGORY_LABELS } from "@/lib/constants";
import { MOCK_STUDENT } from "@/lib/mock-data";
import { FocusModeToggle, type NextUpItem } from "@/components/dashboard/focus-mode";

export default function DashboardPage() {
  const template = getRoadmapTemplate(MOCK_STUDENT.targetCareer);
  const withStatus = template.milestones.map((m) => ({
    milestone: m,
    status: deriveMilestoneStatus(m, MOCK_STUDENT.currentGrade, MOCK_STUDENT.age, MOCK_STUDENT.state),
  }));
  const completed = withStatus.filter((m) => m.status === "completed").length;
  const overallPct = Math.round((completed / withStatus.length) * 100);

  const nextUp: NextUpItem[] = withStatus
    .filter((m) => m.status === "in_progress" || m.status === "not_started")
    .slice(0, 2)
    .map(({ milestone }) => ({
      title: milestone.title,
      description: milestone.description,
      category: MILESTONE_CATEGORY_LABELS[milestone.category],
    }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-4xl font-bold">
          Welcome back, {MOCK_STUDENT.fullName.split(" ")[0]}
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          {GRADE_LEVEL_LABELS[MOCK_STUDENT.currentGrade]} &middot;{" "}
          {CAREER_TRACK_LABELS[MOCK_STUDENT.targetCareer]}
        </p>
      </div>

      <FocusModeToggle
        overallPct={overallPct}
        xp={MOCK_STUDENT.xpPoints}
        completed={completed}
        total={withStatus.length}
        nextUp={nextUp}
      />
    </div>
  );
}
