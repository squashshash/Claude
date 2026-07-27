"use client";

import { Printer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_STUDENT } from "@/lib/mock-data";
import { getRoadmapTemplate } from "@/lib/roadmap/templates";
import { deriveMilestoneStatus } from "@/lib/roadmap/derive-status";
import { milestoneFromDb } from "@/lib/roadmap/from-db";
import { useDashboardData } from "@/lib/hooks/use-dashboard-data";
import {
  CAREER_TRACK_LABELS,
  GRADE_LEVEL_LABELS,
  MILESTONE_CATEGORY_LABELS,
  MILESTONE_CATEGORIES,
} from "@/lib/constants";

export function ResumeBuilder() {
  const { data } = useDashboardData();
  const isReal = Boolean(data?.authenticated && data.profile && data.roadmap);

  const fullName = isReal ? data!.profile!.full_name ?? "Student" : MOCK_STUDENT.fullName;
  const currentGrade = isReal ? data!.profile!.current_grade ?? MOCK_STUDENT.currentGrade : MOCK_STUDENT.currentGrade;
  const targetCareer = isReal ? data!.profile!.target_career ?? MOCK_STUDENT.targetCareer : MOCK_STUDENT.targetCareer;

  const completed = isReal
    ? data!.milestones!.filter((m) => m.status === "completed").map(milestoneFromDb)
    : getRoadmapTemplate(MOCK_STUDENT.targetCareer).milestones.filter(
        (m) =>
          deriveMilestoneStatus(m, MOCK_STUDENT.currentGrade, MOCK_STUDENT.age, MOCK_STUDENT.state) ===
          "completed"
      );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 print:hidden">
        <Button onClick={() => window.print()} className="w-fit gap-2">
          <Printer className="h-4 w-4" /> Print / Save as PDF
        </Button>
        <Badge variant={isReal ? "default" : "locked"}>{isReal ? "Your data" : "Sample data"}</Badge>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-6 p-8">
          <div className="border-b border-border pb-4">
            <h1 className="font-display text-3xl font-bold">{fullName}</h1>
            <p className="text-muted-foreground">
              {GRADE_LEVEL_LABELS[currentGrade]} &middot; {CAREER_TRACK_LABELS[targetCareer]} Track
            </p>
          </div>

          {MILESTONE_CATEGORIES.map((category) => {
            const items = completed.filter((m) => m.category === category);
            if (items.length === 0) return null;
            return (
              <div key={category}>
                <h2 className="font-display text-lg font-bold uppercase tracking-wide text-primary">
                  {MILESTONE_CATEGORY_LABELS[category]}
                </h2>
                <ul className="mt-2 flex flex-col gap-2">
                  {items.map((item) => (
                    <li key={item.title} className="flex flex-col">
                      <span className="font-semibold">{item.title}</span>
                      <span className="text-sm text-muted-foreground">
                        {GRADE_LEVEL_LABELS[item.gradeLevel]} &middot; {item.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          {completed.length === 0 && (
            <p className="text-muted-foreground">
              No completed milestones yet — this resume grows automatically as you check things off.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
