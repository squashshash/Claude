import { Progress } from "@/components/ui/progress";
import { MilestoneCard } from "@/components/roadmap/milestone-card";
import { deriveMilestoneStatus } from "@/lib/roadmap/derive-status";
import { GRADE_LEVEL_LABELS, type GradeLevel } from "@/lib/constants";
import type { MilestoneTemplate } from "@/types/roadmap";

export function YearColumn({
  gradeLevel,
  milestones,
  currentGrade,
  studentAge,
  studentState,
}: {
  gradeLevel: GradeLevel;
  milestones: MilestoneTemplate[];
  currentGrade: GradeLevel;
  studentAge: number;
  studentState?: string;
}) {
  const statuses = milestones.map((m) =>
    deriveMilestoneStatus(m, currentGrade, studentAge, studentState)
  );
  const completedCount = statuses.filter((s) => s === "completed").length;
  const progressPct = Math.round((completedCount / milestones.length) * 100);
  const isCurrentYear = gradeLevel === currentGrade;

  return (
    <div className="flex w-80 shrink-0 flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <h3 className="font-display text-xl font-bold">
          {GRADE_LEVEL_LABELS[gradeLevel]}
        </h3>
        {isCurrentYear && (
          <span className="animate-pulse text-sm font-bold uppercase tracking-wide text-accent">
            You are here
          </span>
        )}
      </div>
      <Progress value={progressPct} className="h-3" />
      <div className="flex flex-col gap-3">
        {milestones.map((milestone, i) => (
          <MilestoneCard
            key={`${milestone.gradeLevel}-${milestone.category}`}
            milestone={milestone}
            status={statuses[i]}
            studentAge={studentAge}
            studentState={studentState}
          />
        ))}
      </div>
    </div>
  );
}
