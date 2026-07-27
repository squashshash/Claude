import { GRADE_LEVELS, type GradeLevel } from "@/lib/constants";
import { YearColumn } from "@/components/roadmap/year-column";
import type { CareerTrackTemplate } from "@/types/roadmap";

export function MilestoneMatrix({
  template,
  currentGrade,
  studentAge,
  studentState,
}: {
  template: CareerTrackTemplate;
  currentGrade: GradeLevel;
  studentAge: number;
  studentState?: string;
}) {
  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {GRADE_LEVELS.map((gradeLevel) => (
        <YearColumn
          key={gradeLevel}
          gradeLevel={gradeLevel}
          milestones={template.milestones.filter((m) => m.gradeLevel === gradeLevel)}
          currentGrade={currentGrade}
          studentAge={studentAge}
          studentState={studentState}
        />
      ))}
    </div>
  );
}
