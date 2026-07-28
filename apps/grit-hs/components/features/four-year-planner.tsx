"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CAREER_TRACKS,
  CAREER_TRACK_LABELS,
  GRADE_LEVELS,
  GRADE_LEVEL_LABELS,
  type CareerTrack,
  type GradeLevel,
} from "@/lib/constants";
import { getRoadmapTemplate } from "@/lib/roadmap/templates";
import { MOCK_STUDENT } from "@/lib/mock-data";

/**
 * Generic core graduation requirements, modeled on typical US high school
 * expectations (4 years English, 3-4 math/science/social studies, PE/health).
 * Not sourced from any specific state's actual requirements — a real
 * implementation would look these up per-state (see #12 in the registry).
 */
const CORE_REQUIREMENTS: Record<Exclude<GradeLevel, "summer_0">, string[]> = {
  grade_9: ["English I", "Algebra I / Geometry", "Physical Science", "PE / Health"],
  grade_10: ["English II", "Geometry / Algebra II", "Biology", "World History"],
  grade_11: ["English III", "Algebra II / Pre-Calculus", "Chemistry or Physics", "US History"],
  grade_12: ["English IV", "Math elective", "Science elective", "Government & Economics"],
};

export function FourYearPlanner() {
  const [track, setTrack] = useState<CareerTrack>(MOCK_STUDENT.targetCareer);
  const template = getRoadmapTemplate(track);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex items-start gap-3 p-4 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          Core requirements below are a generic US model, not your actual state/district
          requirements — pair this with your counselor&apos;s graduation checklist.
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 p-5">
          <span className="text-sm font-medium text-muted-foreground">Career-track electives for:</span>
          {CAREER_TRACKS.map((t) => (
            <button
              key={t}
              onClick={() => setTrack(t)}
              className={
                "rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 " +
                (t === track
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70")
              }
            >
              {CAREER_TRACK_LABELS[t]}
            </button>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        {GRADE_LEVELS.filter((g): g is Exclude<GradeLevel, "summer_0"> => g !== "summer_0").map(
          (grade) => {
            const elective = template.milestones.find(
              (m) => m.gradeLevel === grade && m.category === "academics"
            );
            return (
              <Card key={grade}>
                <CardContent className="grid gap-4 p-5 sm:grid-cols-2">
                  <div>
                    <Badge variant="outline" className="mb-2">
                      {GRADE_LEVEL_LABELS[grade]}
                    </Badge>
                    <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      Core graduation requirements
                    </p>
                    <ul className="mt-1 flex flex-col gap-1 text-sm">
                      {CORE_REQUIREMENTS[grade].map((course) => (
                        <li key={course}>{course}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-accent">
                      Career-track electives
                    </p>
                    {elective ? (
                      <>
                        <p className="mt-1 font-display font-bold">{elective.title}</p>
                        <p className="text-sm text-muted-foreground">{elective.description}</p>
                      </>
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">No electives listed for this year.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          }
        )}
      </div>
    </div>
  );
}
