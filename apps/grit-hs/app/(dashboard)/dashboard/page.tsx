import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getRoadmapTemplate } from "@/lib/roadmap/templates";
import { deriveMilestoneStatus } from "@/lib/roadmap/derive-status";
import { CAREER_TRACK_LABELS, GRADE_LEVEL_LABELS } from "@/lib/constants";
import { MOCK_STUDENT } from "@/lib/mock-data";

export default function DashboardPage() {
  const template = getRoadmapTemplate(MOCK_STUDENT.targetCareer);
  const statuses = template.milestones.map((m) =>
    deriveMilestoneStatus(m, MOCK_STUDENT.currentGrade, MOCK_STUDENT.age, MOCK_STUDENT.state)
  );
  const completed = statuses.filter((s) => s === "completed").length;
  const overallPct = Math.round((completed / statuses.length) * 100);

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

      <div className="grid gap-5 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription className="text-base">Overall roadmap progress</CardDescription>
            <CardTitle className="text-3xl">{overallPct}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={overallPct} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription className="text-base">XP earned</CardDescription>
            <CardTitle className="text-3xl">{MOCK_STUDENT.xpPoints.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription className="text-base">Milestones completed</CardDescription>
            <CardTitle className="text-3xl">
              {completed} / {statuses.length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
