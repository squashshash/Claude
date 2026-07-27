"use client";

import { Printer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MOCK_STUDENT } from "@/lib/mock-data";
import { getRoadmapTemplate } from "@/lib/roadmap/templates";
import { deriveMilestoneStatus } from "@/lib/roadmap/derive-status";
import {
  CAREER_TRACK_LABELS,
  GRADE_LEVEL_LABELS,
  MILESTONE_CATEGORY_LABELS,
  MILESTONE_CATEGORIES,
} from "@/lib/constants";

export function ResumeBuilder() {
  const template = getRoadmapTemplate(MOCK_STUDENT.targetCareer);
  const completed = template.milestones.filter(
    (m) =>
      deriveMilestoneStatus(m, MOCK_STUDENT.currentGrade, MOCK_STUDENT.age, MOCK_STUDENT.state) === "completed"
  );

  return (
    <div className="flex flex-col gap-4">
      <Button onClick={() => window.print()} className="w-fit gap-2 print:hidden">
        <Printer className="h-4 w-4" /> Print / Save as PDF
      </Button>

      <Card>
        <CardContent className="flex flex-col gap-6 p-8">
          <div className="border-b border-border pb-4">
            <h1 className="font-display text-3xl font-bold">{MOCK_STUDENT.fullName}</h1>
            <p className="text-muted-foreground">
              {GRADE_LEVEL_LABELS[MOCK_STUDENT.currentGrade]} &middot;{" "}
              {CAREER_TRACK_LABELS[MOCK_STUDENT.targetCareer]} Track
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
