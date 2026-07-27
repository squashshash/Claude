import { MilestoneMatrix } from "@/components/roadmap/milestone-matrix";
import { getRoadmapTemplate } from "@/lib/roadmap/templates";
import { CAREER_TRACK_LABELS } from "@/lib/constants";
import { MOCK_STUDENT } from "@/lib/mock-data";

export default function RoadmapPage() {
  const template = getRoadmapTemplate(MOCK_STUDENT.targetCareer);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-accent">
          {CAREER_TRACK_LABELS[MOCK_STUDENT.targetCareer]}
        </p>
        <h1 className="font-display text-2xl font-semibold">4-Year Roadmap</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{template.summary}</p>
      </div>
      <MilestoneMatrix
        template={template}
        currentGrade={MOCK_STUDENT.currentGrade}
        studentAge={MOCK_STUDENT.age}
        studentState={MOCK_STUDENT.state}
      />
    </div>
  );
}
