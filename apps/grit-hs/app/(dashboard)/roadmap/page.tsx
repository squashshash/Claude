import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MilestoneMatrix } from "@/components/roadmap/milestone-matrix";
import { SkillRadarChart } from "@/components/roadmap/skill-radar-chart";
import { getRoadmapTemplate } from "@/lib/roadmap/templates";
import { deriveMilestoneStatus } from "@/lib/roadmap/derive-status";
import { CAREER_TRACK_LABELS, MILESTONE_CATEGORIES } from "@/lib/constants";
import { MOCK_STUDENT } from "@/lib/mock-data";

const RADAR_AXIS_LABELS: Record<(typeof MILESTONE_CATEGORIES)[number], string> = {
  academics: "Academics",
  certifications: "Certs",
  ctso: "CTSO",
  experience: "Hands-On",
};

export default function RoadmapPage() {
  const template = getRoadmapTemplate(MOCK_STUDENT.targetCareer);

  const radarAxes = MILESTONE_CATEGORIES.map((category) => {
    const inCategory = template.milestones.filter((m) => m.category === category);
    const completed = inCategory.filter(
      (m) =>
        deriveMilestoneStatus(m, MOCK_STUDENT.currentGrade, MOCK_STUDENT.age, MOCK_STUDENT.state) ===
        "completed"
    ).length;
    return {
      label: RADAR_AXIS_LABELS[category],
      pct: inCategory.length ? Math.round((completed / inCategory.length) * 100) : 0,
    };
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">
          {CAREER_TRACK_LABELS[MOCK_STUDENT.targetCareer]}
        </p>
        <h1 className="font-display text-4xl font-bold">4-Year Roadmap</h1>
        <p className="mt-2 max-w-2xl text-base text-muted-foreground">{template.summary}</p>
      </div>

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
        template={template}
        currentGrade={MOCK_STUDENT.currentGrade}
        studentAge={MOCK_STUDENT.age}
        studentState={MOCK_STUDENT.state}
      />
    </div>
  );
}
