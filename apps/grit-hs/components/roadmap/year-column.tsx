import { Progress } from "@/components/ui/progress";
import { MilestoneCard } from "@/components/roadmap/milestone-card";
import { GRADE_LEVEL_LABELS, type GradeLevel, type MilestoneStatus } from "@/lib/constants";
import type { ResolvedMilestone } from "@/types/roadmap";

export function YearColumn({
  gradeLevel,
  milestones,
  currentGrade,
  studentAge,
  studentState,
  onToggleComplete,
  onSetPlannedFor,
}: {
  gradeLevel: GradeLevel;
  milestones: ResolvedMilestone[];
  currentGrade: GradeLevel;
  studentAge: number;
  studentState?: string;
  onToggleComplete?: (id: string, nextStatus: MilestoneStatus) => Promise<void> | void;
  onSetPlannedFor?: (id: string, date: string) => Promise<void> | void;
}) {
  const completedCount = milestones.filter((m) => m.status === "completed").length;
  const progressPct = milestones.length ? Math.round((completedCount / milestones.length) * 100) : 0;
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
        {milestones.map(({ id, milestone, status, plannedFor }) => (
          <MilestoneCard
            key={id ?? `${milestone.gradeLevel}-${milestone.category}-${milestone.title}`}
            id={id}
            milestone={milestone}
            status={status}
            studentAge={studentAge}
            studentState={studentState}
            plannedFor={plannedFor}
            onToggleComplete={onToggleComplete}
            onSetPlannedFor={onSetPlannedFor}
          />
        ))}
      </div>
    </div>
  );
}
