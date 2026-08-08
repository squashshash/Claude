"use client";

import { Sun, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SampleDataBanner } from "./sample-data-banner";
import { useDashboardData } from "@/lib/hooks/use-dashboard-data";
import { MOCK_STUDENT } from "@/lib/mock-data";
import type { CareerTrack } from "@/lib/constants";

const SAMPLE_PROGRAMS: { name: string; grades: string; funded: boolean; track: CareerTrack }[] = [
  { name: "Research Science Institute (RSI)", grades: "Rising seniors", funded: true, track: "pre_med_clinical_healthcare" },
  { name: "Simons Summer Research Program", grades: "Rising seniors", funded: true, track: "pre_med_clinical_healthcare" },
  { name: "National Youth Science Camp", grades: "Graduating seniors", funded: true, track: "nursing_advanced_practice" },
  { name: "University Pre-College Engineering Program", grades: "Grades 10-12", funded: false, track: "mechanical_engineering_cad" },
  { name: "Journal of Emerging Investigators mentorship track", grades: "Grades 9-12", funded: true, track: "software_engineering" },
  { name: "Wharton Global Youth Finance Academy", grades: "Grades 10-12", funded: false, track: "financial_engineering" },
  { name: "Pre-Law Summer Institute (regional)", grades: "Grades 10-12", funded: false, track: "law_public_policy" },
];

export function SummerPrograms() {
  const { data } = useDashboardData();
  const isReal = Boolean(data?.authenticated && data.profile);
  const targetCareer = isReal ? data!.profile!.target_career ?? MOCK_STUDENT.targetCareer : MOCK_STUDENT.targetCareer;

  const sorted = [...SAMPLE_PROGRAMS].sort((a, b) => {
    const aMatch = a.track === targetCareer ? 0 : 1;
    const bMatch = b.track === targetCareer ? 0 : 1;
    return aMatch - bMatch;
  });

  return (
    <div className="flex flex-col gap-6">
      <SampleDataBanner>
        Sample programs — a real directory needs a maintained, verified list with
        current deadlines, which isn&apos;t sourced yet. Layout and track-matching logic are real.
      </SampleDataBanner>
      <div className="grid gap-4 sm:grid-cols-2">
        {sorted.map((p) => (
          <Card key={p.name}>
            <CardContent className="flex flex-col gap-2 p-5">
              <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
                <Sun className="h-4 w-4" aria-hidden="true" />
                <Badge variant={p.funded ? "default" : "outline"}>{p.funded ? "Fully funded" : "Paid program"}</Badge>
                {p.track === targetCareer && (
                  <Badge variant="accent" className="gap-1">
                    <GraduationCap className="h-3 w-3" /> Matches your track
                  </Badge>
                )}
              </div>
              <p className="font-display text-lg font-bold leading-snug">{p.name}</p>
              <p className="text-sm text-muted-foreground">{p.grades}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
