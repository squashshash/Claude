import { GRADE_LEVELS, type GradeLevel, type MilestoneStatus } from "@/lib/constants";
import { YearColumn } from "@/components/roadmap/year-column";
import type { ResolvedMilestone } from "@/types/roadmap";

export function MilestoneMatrix({
  milestones,
  currentGrade,
  studentAge,
  studentState,
  onToggleComplete,
  onSetPlannedFor,
}: {
  milestones: ResolvedMilestone[];
  currentGrade: GradeLevel;
  studentAge: number;
  studentState?: string;
  onToggleComplete?: (id: string, nextStatus: MilestoneStatus) => Promise<void> | void;
  onSetPlannedFor?: (id: string, date: string) => Promise<void> | void;
}) {
  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {GRADE_LEVELS.map((gradeLevel) => (
        <YearColumn
          key={gradeLevel}
          gradeLevel={gradeLevel}
          milestones={milestones.filter((m) => m.milestone.gradeLevel === gradeLevel)}
          currentGrade={currentGrade}
          studentAge={studentAge}
          studentState={studentState}
          onToggleComplete={onToggleComplete}
          onSetPlannedFor={onSetPlannedFor}
        />
      ))}
    </div>
  );
}
