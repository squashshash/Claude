import { GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SampleDataBanner } from "./sample-data-banner";
import { CAREER_TRACK_LABELS, type CareerTrack } from "@/lib/constants";
import { MOCK_STUDENT } from "@/lib/mock-data";

const SAMPLE_MENTORS: { name: string; role: string; track: CareerTrack }[] = [
  { name: "Priya N.", role: "Nursing student, Class of 2028", track: "nursing_advanced_practice" },
  { name: "Marcus T.", role: "Pre-med junior, shadowed 200+ clinical hours", track: "pre_med_clinical_healthcare" },
  { name: "Ava R.", role: "Software engineer, 2 years out of a CS track", track: "software_engineering" },
  { name: "Diego L.", role: "Mechanical engineering sophomore", track: "mechanical_engineering_cad" },
  { name: "Sam K.", role: "Analyst, passed the SIE at 18", track: "financial_engineering" },
  { name: "Jordan P.", role: "1L law student, ran Mock Trial for 4 years", track: "law_public_policy" },
];

export function MentorMatcher() {
  const matched = SAMPLE_MENTORS.filter((m) => m.track === MOCK_STUDENT.targetCareer);
  const others = SAMPLE_MENTORS.filter((m) => m.track !== MOCK_STUDENT.targetCareer);

  return (
    <div className="flex flex-col gap-6">
      <SampleDataBanner>
        Sample mentors — a real matcher needs an actual mentor directory and messaging
        system, which isn&apos;t built yet. Matching logic against your track is real.
      </SampleDataBanner>
      {[...matched, ...others].map((mentor, i) => (
        <Card key={mentor.name}>
          <CardContent className="flex items-center gap-4 p-5">
            <Avatar className="h-11 w-11">
              <AvatarFallback>
                {mentor.name
                  .split(" ")
                  .map((p) => p[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-display text-base font-bold">{mentor.name}</p>
              <p className="text-sm text-muted-foreground">{mentor.role}</p>
            </div>
            {i < matched.length && (
              <Badge variant="accent" className="gap-1.5">
                <GraduationCap className="h-3.5 w-3.5" /> Same track
              </Badge>
            )}
            <Badge variant="outline">{CAREER_TRACK_LABELS[mentor.track]}</Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
